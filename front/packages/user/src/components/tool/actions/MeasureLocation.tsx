import React, { useState, useEffect } from "react";
import * as Cesium from "cesium";
import { GlobeController } from "@/api/GlobeController.ts";
import {getLengthUnitFactor} from "@/components/utils/unit.ts";

interface MeasureLocationProps {
    globeController: GlobeController;
    unit: string;
}

const createPointEntity = (toolDataSource: Cesium.CustomDataSource, cartesian: Cesium.Cartesian3, labelText: string) => {
    toolDataSource.entities.add({
        id: "locationPoint",
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

const MeasureLocation = ({ globeController, unit }: MeasureLocationProps) => {
    const { viewer, toolDataSource } = globeController;
    const [locationData, setLocationData] = useState<{ lat: number; lon: number; height: string } | null>(null);

    useEffect(() => {
        if (!viewer) return;

        const getUnitHeight = (distance: number): string => {
            return `${Math.round((distance / getLengthUnitFactor(unit)) * 100) / 100} ${unit}`;
        };

        const mouseLeftClickHandler = (event: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
            const cartesian = globeController.pickPosition(event.position);
            if (!cartesian) return;

            const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
            const lat = parseFloat(Cesium.Math.toDegrees(cartographic.latitude).toFixed(6));
            const lon = parseFloat(Cesium.Math.toDegrees(cartographic.longitude).toFixed(6));
            const height = getUnitHeight(cartographic.height);

            setLocationData({ lat, lon, height });

            toolDataSource.entities.removeById("locationPoint");
            const labelText = `Lat: ${lat}\nLon: ${lon}\nHeight: ${height}`;
            createPointEntity(toolDataSource, cartesian, labelText)
        };

        const eventManager = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        eventManager.setInputAction(mouseLeftClickHandler, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        return () => {
            toolDataSource.entities.removeById("locationPoint");
            eventManager.destroy();
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
