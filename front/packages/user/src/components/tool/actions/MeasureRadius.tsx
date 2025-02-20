import React, {ChangeEvent, useEffect, useState} from "react";
import * as Cesium from "cesium";
import { GlobeController } from "@/api/GlobeController.ts";
import { eventManager } from "@/components/tool/eventManager.ts";
import { getLengthUnitFactor } from "@/components/utils/unit.ts";
import {useTranslation} from "react-i18next";
import {useRecoilState} from "recoil";
import {AreaUnitType, DistanceUnitState, DistanceUnitType} from "@/recoils/Unit.ts";
import {
    createEllipsoidEntity,
    createLabelEntity,
    createPointEntity,
    createPolylineEntity
} from "@/components/utils/measureEntities.ts";

interface MeasureRadiusProps {
    globeController: GlobeController;
}

const eventGroupId = "MeasureRadius";

export const MeasureRadius = ({ globeController }: MeasureRadiusProps) => {
    const {t} = useTranslation();
    const [unit, setUnit] = useRecoilState<DistanceUnitType>(DistanceUnitState);
    const [result, setResult] = useState(0);
    let ellipsoidEntity: Cesium.Entity | undefined;
    let clickCount = 0;
    let isCreatingEllipsoid = false;

    const createEllipsoidEntitySafe = async (
        toolDataSource: Cesium.CustomDataSource,
        start: Cesium.Cartesian3,
        end: Cesium.Cartesian3,
        globe: Cesium.Globe
    ) => {
        if (isCreatingEllipsoid) return;
        isCreatingEllipsoid = true;

        try {
            ellipsoidEntity = await createEllipsoidEntity(toolDataSource, start, end, globe);
        } finally {
            isCreatingEllipsoid = false;
        }
    };

    useEffect(() => {
        const { viewer, toolDataSource } = globeController;
        if (!viewer) return;

        const cartesians: { start?: Cesium.Cartesian3; end?: Cesium.Cartesian3 } = {};

        const leftClickHandler = async (event: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
            clickCount++;
            const scene = viewer.scene;
            const ray = scene.camera.getPickRay(event.position);
            if (!ray) return;

            const cartesian = scene.globe.pick(ray, scene);
            if (!cartesian) return;

            if (clickCount % 2 === 1) {
                // 홀수 클릭
                if (!eventManager.eventGroups.get(eventGroupId)?.some((e) => e.type === Cesium.ScreenSpaceEventType.MOUSE_MOVE)) {
                    eventManager.addHandler(eventGroupId, Cesium.ScreenSpaceEventType.MOUSE_MOVE, moveHandler);
                }

                if (ellipsoidEntity) {
                    toolDataSource.entities.removeAll();
                    ellipsoidEntity = undefined;
                }

                cartesians.start = cartesian;
                cartesians.end = cartesian;
                createPointEntity(toolDataSource, cartesian);
            } else {
                // 짝수 클릭
                if (ellipsoidEntity) {
                    toolDataSource.entities.removeAll();
                    ellipsoidEntity = undefined;
                }

                cartesians.end = cartesian;
                createPointEntity(toolDataSource, cartesian);
                createPolylineEntity(toolDataSource, [cartesians.start!, cartesians.end!], false);

                // 비동기 로직으로 Ellipsoid 생성
                ellipsoidEntity = await createEllipsoidEntity(toolDataSource, cartesians.start!, cartesians.end!, viewer.scene.globe);

                const distance = Cesium.Cartesian3.distance(cartesians.start!, cartesians.end!);
                const convertedDistance = Number((distance / getLengthUnitFactor(unit)).toFixed(2));
                setResult(convertedDistance);

                if (cartesians.start && cartesians.end) {
                    const midPoint = Cesium.Cartesian3.midpoint(
                        cartesians.start,
                        cartesians.end,
                        new Cesium.Cartesian3()
                    );

                    // 라벨 생성 및 텍스트 설정
                    const labelEntity = createLabelEntity(toolDataSource, midPoint, "");
                    if (labelEntity?.label) {
                        labelEntity.label.text = new Cesium.ConstantProperty(`${convertedDistance} ${unit}`);
                    }
                }

                eventManager.removeSpecificHandler(eventGroupId, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
            }
        };

        const moveHandler = async (event: Cesium.ScreenSpaceEventHandler.MotionEvent) => {
            if (!cartesians.start) return;
            const scene = viewer.scene;
            const ray = scene.camera.getPickRay(event.endPosition);
            if (!ray) return;

            const cartesian = scene.globe.pick(ray, scene);
            if (!cartesian) return;

            cartesians.end = cartesian;

            if (!ellipsoidEntity) {
                await createEllipsoidEntitySafe(toolDataSource, cartesians.start, cartesians.end, viewer.scene.globe);
            } else {
                ellipsoidEntity.ellipsoid!.radii = new Cesium.CallbackProperty(() => {
                    const distance = Cesium.Cartesian3.distance(cartesians.start!, cartesians.end!);
                    return new Cesium.Cartesian3(distance, distance, distance);
                }, false);
            }

            const distance = Cesium.Cartesian3.distance(cartesians.start!, cartesians.end!);
            const convertedDistance = Number((distance / getLengthUnitFactor(unit)).toFixed(2));
            setResult(convertedDistance);
        };
        const escKeyHandler = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                cartesians.start = undefined;
                cartesians.end = undefined;
                toolDataSource.entities.removeAll();
                eventManager.removeSpecificHandler(eventGroupId, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
            }
        };

        eventManager.init(viewer);
        eventManager.addHandler(eventGroupId, Cesium.ScreenSpaceEventType.LEFT_CLICK, leftClickHandler);
        eventManager.addGlobalHandler(eventGroupId, "keydown", escKeyHandler as EventListener);

        return () => {
            toolDataSource.entities.removeAll();
            eventManager.destroyGroup(eventGroupId);
        };
    }, [globeController, unit]);

    const handleUnitChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const newUnit = e.target.value as DistanceUnitType;
        if (["m", "km", "nmi", "in", "ft", "yd", "mi"].includes(newUnit)) {
            setUnit(newUnit);
            setResult(0);
        }
    };

    return (
        <div className="pop-layer-sub measure">
            <div className="pop-layer-header">
                <h3 className="title">{t("measure.radius")}</h3>
            </div>
            <div className="pop-layer-content">
                <div className="value-container">
                    <label>{t("measure.distance-unit")}</label>
                    <select value={unit} onChange={handleUnitChange}>
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
                    <input type="text" value={`${result} ${unit}`} readOnly/>
                </div>
            </div>
        </div>
    );
};
