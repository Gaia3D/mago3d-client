import React, { useEffect, useState } from "react";
import * as Cesium from "cesium";
import { polygon as turfPolygon, area as turfArea, centerOfMass } from "@turf/turf";
import { getAreaUnitFactor } from "@/components/utils/unit.ts";
import { GlobeController } from "@/api/GlobeController.ts";
import { eventManager } from "@/components/tool/actions/eventManager.ts";

interface MeasureAreaProps {
    globeController: GlobeController;
    unit: string;
}

const createPolygonEntity = (toolDataSource: Cesium.CustomDataSource, cartesians: Cesium.Cartesian3[]) => {
    toolDataSource.entities.add({
        polygon: {
            hierarchy: new Cesium.CallbackProperty(() => new Cesium.PolygonHierarchy(cartesians), false),
            material: Cesium.Color.RED.withAlpha(0.5),
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        },
        id: "areaPolygon",
    });
};

const createLabelEntity = (toolDataSource: Cesium.CustomDataSource) => {
    toolDataSource.entities.add({
        position: Cesium.Cartesian3.fromDegrees(0, 0),
        label: {
            text: "",
            showBackground: true,
            font: "14px monospace",
            fillColor: Cesium.Color.fromCssColorString('#FF015F'),
            backgroundColor: Cesium.Color.fromCssColorString('#FFF').withAlpha(1),
            horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            style: Cesium.LabelStyle.FILL,
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
        },
        id: "areaLabel",
    });
};

const getPolygon = (cartesians: Cesium.Cartesian3[]) => {
    const lonlats = cartesians.map(cartesian => {
        const carto = Cesium.Cartographic.fromCartesian(cartesian);
        return [Cesium.Math.toDegrees(carto.longitude), Cesium.Math.toDegrees(carto.latitude)];
    });
    lonlats.push(lonlats[0]); // 닫힌 폴리곤 생성
    return turfPolygon([lonlats]);
};

const updateAreaLabel = (
    toolDataSource: Cesium.CustomDataSource,
    cartesians: Cesium.Cartesian3[],
    unit: string,
    setResult: React.Dispatch<React.SetStateAction<number>>
) => {
    if (cartesians.length < 3) return;

    const polygon = getPolygon(cartesians);
    const area = turfArea(polygon);
    const formattedResult = Math.round((area / getAreaUnitFactor(unit)) * 100) / 100;
    setResult(formattedResult);

    const center = centerOfMass(polygon);
    const [lon, lat] = center.geometry.coordinates;
    const labelPosition = Cesium.Cartesian3.fromDegrees(lon, lat);

    const areaLabelEntity = toolDataSource.entities.getById("areaLabel");
    if (areaLabelEntity?.label) {
        areaLabelEntity.position = new Cesium.ConstantPositionProperty(labelPosition);
        areaLabelEntity.label.text = new Cesium.ConstantProperty(formattedResult + " " + unit);
    }
};

export const MeasureArea = ({ globeController, unit }: MeasureAreaProps) => {
    const [result, setResult] = useState(0);

    useEffect(() => {
        const { viewer, toolDataSource } = globeController;
        if (!viewer) return;

        const cartesians: Cesium.Cartesian3[] = [];

        createPolygonEntity(toolDataSource, cartesians);
        createLabelEntity(toolDataSource);

        const leftClickHandler = (positionedEvent: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
            const cartesian = globeController.pickPosition(positionedEvent.position);
            if (!cartesian) return;

            cartesians.push(cartesian);

            toolDataSource.entities.add({
                position: cartesian,
                point: {
                    pixelSize: 10,
                    color: Cesium.Color.WHITE,
                    outlineColor: Cesium.Color.RED,
                    outlineWidth: 2,
                    disableDepthTestDistance: Number.POSITIVE_INFINITY,
                },
            });

            updateAreaLabel(toolDataSource, cartesians, unit, setResult);
        };

        const escKeyHandler = (keyboardEvent: KeyboardEvent) => {
            if (keyboardEvent.key === "Escape") {
                cartesians.length = 0;
                toolDataSource.entities.removeAll();
                createPolygonEntity(toolDataSource, cartesians);
                createLabelEntity(toolDataSource);
            }
        };

        eventManager.init(viewer);
        eventManager.addHandler(Cesium.ScreenSpaceEventType.LEFT_CLICK, leftClickHandler);
        eventManager.addGlobalHandler("keydown", escKeyHandler as EventListener);

        return () => {
            toolDataSource.entities.removeAll();
            eventManager.destroy();
        };
    }, [globeController, unit]);

    return <div>{result}</div>;
};
