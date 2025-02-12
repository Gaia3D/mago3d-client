import React, { useState, useEffect } from "react";
import * as Cesium from "cesium";
import { GlobeController } from "@/api/GlobeController.ts";
import {getLengthUnitFactor} from "@/components/utils/unit.ts";
import { eventManager } from "@/components/tool/actions/eventManager.ts";

interface MeasureLocationProps {
    globeController: GlobeController;
    unit: string;
}

const eventGroupId = "MeasureLocation";

const createPointEntity = (toolDataSource: Cesium.CustomDataSource, cartesian: Cesium.Cartesian3, labelText: string) => {
    toolDataSource.entities.add({
        id: "location-point",
        position: cartesian,
        point: {
            show: true,
            pixelSize: 5,
            color: Cesium.Color.WHITE,
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
        },
        label: {
            text: labelText,
            font: "14px monospace",
            horizontalOrigin: Cesium.HorizontalOrigin.RIGHT,
            verticalOrigin: Cesium.VerticalOrigin.TOP,
            pixelOffset: new Cesium.Cartesian2(-15, 0),
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
            fillColor: Cesium.Color.WHITE,
            showBackground: true,
            backgroundColor: Cesium.Color.BLACK.withAlpha(0.8),
            backgroundPadding: new Cesium.Cartesian2(16, 8),
        },
    });
}

const getUnitHeight = (distance: number, unit: string) => {
    return Math.round((distance / getLengthUnitFactor(unit)) * 100) / 100;
};

const MeasureLocation = ({ globeController, unit }: MeasureLocationProps) => {
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
            const height = getUnitHeight(cartographic.height, unit);

            setLocationData({ lat, lon, height });

            toolDataSource.entities.removeById("location-point");
            const labelText = `Lat: ${lat}\nLon: ${lon}\nHeight: ${height}${unit}`;
            createPointEntity(toolDataSource, cartesian, labelText)
        };

        eventManager.init(viewer);
        eventManager.addHandler(eventGroupId, Cesium.ScreenSpaceEventType.LEFT_CLICK, leftClickHandler);
        return () => {
            toolDataSource.entities.removeById("location-point");
            eventManager.destroyGroup(eventGroupId);
        };
    }, [viewer, toolDataSource, globeController, unit]);

    return (
        <div className="measure-location">
            <h3>Measure Location</h3>
            {locationData ? (
                <div>
                    <p><strong>Latitude:</strong> {locationData.lat}</p>
                    <p><strong>Longitude:</strong> {locationData.lon}</p>
                    <p><strong>Height:</strong> {locationData.height}</p>
                </div>
            ) : (
                <p>Click on the globe to measure a location.</p>
            )}
        </div>
    );
};

export default MeasureLocation;
