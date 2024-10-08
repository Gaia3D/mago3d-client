import { useEffect, useRef, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { useGlobeController } from "@/components/providers/GlobeControllerProvider";
import * as Cesium from 'cesium';
import { MeasureRadiusOpenState, ToolStatus, ToolStatusState } from "@/recoils/Tool";
import ReactDOM from "react-dom";
import {useTranslation} from "react-i18next";

const color = Cesium.Color.RED;
const getUnitFactor = (unit: string) => {
    switch(unit) {
        case "m": return 1;
        case "km": return 1000;
        case "nmi": return 1852;
        case "in": return 0.0254;
        case "ft": return 0.3048;
        case "yd": return 0.9144;
        case "mi": return 1609.344;
        default: return 1;
    }
}

let startCartesian : Cesium.Cartesian3 | undefined = undefined;
let endCartesian : Cesium.Cartesian3 | undefined = undefined;

let startEntity : Cesium.Entity | undefined = undefined;
let endEntity : Cesium.Entity | undefined = undefined;
let lineEntity : Cesium.Entity | undefined = undefined;
let radiusEntity : Cesium.Entity | undefined = undefined;

const clearEntities = (toolDataSource: Cesium.CustomDataSource) => {
    if(!lineEntity || !startEntity || !endEntity || !radiusEntity) return;
    toolDataSource.entities.remove(lineEntity);
    toolDataSource.entities.remove(startEntity);
    toolDataSource.entities.remove(endEntity);
    toolDataSource.entities.remove(radiusEntity);
    lineEntity = undefined;
    startEntity = undefined;
    endEntity = undefined;
    radiusEntity = undefined;
}

export const MeasureRadius = () => {
    const {t} = useTranslation();
    const el = document.querySelector("#map");
    const [open, setOpen] = useRecoilState(MeasureRadiusOpenState);
    const [unit, setUnit] = useState("m");
    const [result, setResult] = useState('0 m');
    const status = useRef(false);
    const {globeController} = useGlobeController();
    const setSelectedTool = useSetRecoilState(ToolStatusState);

    const getUnitDistance = (distance:number) => `${Math.round(distance / getUnitFactor(unit) * 100) / 100} ${unit}`;

    const init = () => {
        const { toolDataSource } = globeController;
        toolDataSource.entities.removeAll();
        setResult(`0 ${unit}`);
    }

    useEffect(() => {
        const { handler, toolDataSource } = globeController;
        init();

        if (open) {
            if (!handler) return;

            handler.setInputAction((movement: any) => {
                const cartesian = globeController.pickPosition(movement.position);
                if ( !cartesian ) return;

                if (!status.current) {
                    status.current = true;
                    clearEntities(toolDataSource);
                    startCartesian = cartesian;
                    endCartesian = cartesian;

                    startEntity = toolDataSource.entities.add({
                        position: cartesian,
                        point: {
                            color: color,
                            pixelSize: 5,
                            disableDepthTestDistance: Number.POSITIVE_INFINITY,
                        },
                    });

                    lineEntity = toolDataSource.entities.add({
                        polyline: {
                            positions: new Cesium.CallbackProperty(() => {
                                return [startCartesian, endCartesian];
                            }, false),
                            width: 3,
                            material: new Cesium.PolylineDashMaterialProperty({
                                color: color,
                                dashLength: 10.0,
                                dashPattern: 255,
                            }),
                        },
                    });

                    radiusEntity = toolDataSource.entities.add({
                        position: cartesian,
                        ellipsoid: {
                            radii: new Cesium.CallbackProperty(() => {
                                if (startCartesian && endCartesian) {
                                    const distance = Cesium.Cartesian3.distance(startCartesian, endCartesian);
                                    const radii = new Cesium.Cartesian3(distance, distance, distance);
                                    return radii;
                                }
                                return new Cesium.Cartesian3(0, 0, 0); // 기본 값으로 0, 0, 0을 반환
                            }, false),
                            maximumCone: Cesium.Math.PI_OVER_TWO,
                            material: color.withAlpha(0.3),
                            outlineColor: color,
                            outlineWidth: 2,
                            outline: true,
                        },
                    });

                    endEntity = toolDataSource.entities.add({
                        /* @ts-expect-error: null */
                        position: new Cesium.CallbackProperty(() => {
                            return endCartesian;
                        }, false),
                        label: {
                            showBackground: false,
                            font: "14px monospace",
                            fillColor: color,
                            horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
                            verticalOrigin: Cesium.VerticalOrigin.TOP,
                            pixelOffset: new Cesium.Cartesian2(5, 0),
                            disableDepthTestDistance: Number.POSITIVE_INFINITY,
                            text: new Cesium.CallbackProperty(() => {
                                if (startCartesian && endCartesian) {
                                    const distance = parseFloat(Cesium.Cartesian3.distance(startCartesian, endCartesian).toFixed(2));
                                    return getUnitDistance(distance);
                                }
                            }, false)
                        },
                    });

                } else {
                    status.current = false;
                    endCartesian = cartesian;

                    if (startCartesian && endCartesian) {
                        const distance = Cesium.Cartesian3.distance(startCartesian, endCartesian);
                        setResult(getUnitDistance(distance));
                    }
                }
            }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

            handler.setInputAction((moveEvent: Cesium.ScreenSpaceEventHandler.MotionEvent) => {
                if (!status.current) return;
                const cartesian = globeController.pickPosition(moveEvent.endPosition);
                if (!cartesian) return;

                endCartesian = cartesian;

                if (startCartesian && endCartesian) {
                    const distance = Cesium.Cartesian3.distance(startCartesian, endCartesian);
                    setResult(getUnitDistance(distance));
                }
            }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        } else {
            handler?.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
            handler?.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        }
    }, [open, unit]);

    const node = (
        <div className="pop-layer-sub measure">
            <div className="pop-layer-header">
                <h3 className="title">{t("measure.radius")}</h3>
                {/*<div className="close-button"></div>*/}
            </div>
            <div className="pop-layer-content">
                <div className="value-container">
                    <label>{t("measure.distance-unit")}</label>
                    <select value={unit} onChange={(e) => setUnit(e.target.value)}>
                        <option value="m">{t("measure.m")}</option>
                        <option value="km">{t("measure.km")}</option>
                        <option value="nmi">{t("measure.nmi")}</option>
                        <option value="in">{t("measure.in")}</option>
                        <option value="ft">{t("measure.ft")}</option>
                        <option value="yd">{t("measure.yd")}</option>
                        <option value="mi">{t("measure.mi")}</option>
                    </select>
                </div>
                <div className="value-container">
                    <label>{t("measure.measure-distance")}</label>
                    <input type="text" value={result}/>
                </div>
                {/*<button type="button" className="cancel" onClick={init}><a>초기화</a></button>*/}
            </div>
        </div>
    );
    return el && open ? ReactDOM.createPortal(node, el) : null;
}
