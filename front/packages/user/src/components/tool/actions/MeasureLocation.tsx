import React, {useState, useEffect, ChangeEvent} from "react";
import * as Cesium from "cesium";
import { GlobeController } from "@/api/GlobeController.ts";
import {getLengthUnitFactor} from "@/components/utils/unit.ts";
import { eventManager } from "@/components/tool/eventManager.ts";
import {useTranslation} from "react-i18next";
import {useRecoilState} from "recoil";
import {DistanceUnitState, DistanceUnitType} from "@/recoils/Unit.ts";

interface MeasureLocationProps {
    globeController: GlobeController;
}

const eventGroupId = "MeasureLocation";

const createPointEntity = (toolDataSource: Cesium.CustomDataSource, cartesian: Cesium.Cartesian3, labelText: string) => {
    toolDataSource.entities.add({
        id: "location-point",
        position: cartesian,
        point: {
            show: true,
            pixelSize: 10,
            color: Cesium.Color.WHITE,
            outlineColor: Cesium.Color.RED,
            outlineWidth: 2,
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
        },
        label: {
            text: labelText,
            font: "14px monospace",
            horizontalOrigin: Cesium.HorizontalOrigin.RIGHT,
            verticalOrigin: Cesium.VerticalOrigin.TOP,
            pixelOffset: new Cesium.Cartesian2(-15, 0),
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
            showBackground: true,
            backgroundPadding: new Cesium.Cartesian2(16, 8),
        },
    });
}

const getUnitHeight = (distance: number, unit: string) => {
    return Math.round((distance / getLengthUnitFactor(unit)) * 100) / 100;
};

const MeasureLocation = ({ globeController }: MeasureLocationProps) => {
    const {t} = useTranslation();
    const [unit, setUnit] = useRecoilState<DistanceUnitType>(DistanceUnitState);
    const { viewer, toolDataSource } = globeController;
    const [locationData, setLocationData] = useState<{ lat: number; lon: number; height: number } | null>(null);

    useEffect(() => {
        if (!viewer) return;

        const leftClickHandler = (event: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
            const cartesian = globeController.pickPosition(event.position);
            if (!cartesian) return;

            const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
            const lat = parseFloat(Cesium.Math.toDegrees(cartographic.latitude).toFixed(6));
            const lon = parseFloat(Cesium.Math.toDegrees(cartographic.longitude).toFixed(6));
            const height = cartographic.height;

            setLocationData({ lat, lon, height });

            toolDataSource.entities.removeById("location-point");
            const labelText = `Lat: ${lat}\nLon: ${lon}\nHeight: ${getUnitHeight(height, unit)}${unit}`;
            createPointEntity(toolDataSource, cartesian, labelText)
        };

        eventManager.init(viewer);
        eventManager.addHandler(eventGroupId, Cesium.ScreenSpaceEventType.LEFT_CLICK, leftClickHandler);
        return () => {
            toolDataSource.entities.removeById("location-point");
            eventManager.destroyGroup(eventGroupId);
        };
    }, [viewer, toolDataSource, globeController, unit]);

    const handleUnitChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const newUnit = e.target.value as DistanceUnitType;
        if (["m", "km", "nmi", "in", "ft", "yd", "mi"].includes(newUnit)) {
            setUnit(newUnit);
            setLocationData(null);
        }
    };

    return (
        <div className="pop-layer-sub measure">
            <div className="pop-layer-header">
                <h3 className="title">{t("measure.position")}</h3>
                {/*<div className="close-button"></div>*/}
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
                    <label>{t("measure.lat")}</label>
                    <input type="text" value={locationData?.lat || 0} readOnly/>
                </div>
                <div className="value-container">
                    <label>{t("measure.lon")}</label>
                    <input type="text" value={locationData?.lon || 0} readOnly/>
                </div>
                <div className="value-container">
                    <label>{t("measure.alt")}</label>
                    <input type="text" value={`${getUnitHeight(locationData?.height || 0, unit)} ${unit}`} readOnly/>
                </div>

            </div>
        </div>
    )
        ;
};

export default MeasureLocation;
