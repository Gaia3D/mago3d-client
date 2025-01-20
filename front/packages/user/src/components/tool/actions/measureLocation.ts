import * as Cesium from "cesium";
import { eventManager } from "@/components/tool/actions/eventManager.ts";
import { GlobeController } from "@/api/GlobeController.ts";

const color = Cesium.Color.WHITE;
const bgColor = Cesium.Color.BLACK.withAlpha(0.8);

export const createMeasureLocation = (globeController: GlobeController, unit: string) => {
    const { viewer, toolDataSource } = globeController;
    if (!viewer) return;

    eventManager.init(viewer);

    const getUnitFactor = (unit: string): number => {
        switch (unit) {
            case "m": return 1;
            case "km": return 1000;
            case "nmi": return 1852;
            case "in": return 0.0254;
            case "ft": return 0.3048;
            case "yd": return 0.9144;
            case "mi": return 1609.344;
            default: return 1;
        }
    };

    const getUnitHeight = (distance: number): string => {
        return `${Math.round((distance / getUnitFactor(unit)) * 100) / 100} ${unit}`;
    };

    const mouseLeftClickHandler = (event: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
        const cartesian = globeController.pickPosition(event.position);
        if (!cartesian) return;

        const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
        const lat = parseFloat(Cesium.Math.toDegrees(cartographic.latitude).toFixed(6));
        const lon = parseFloat(Cesium.Math.toDegrees(cartographic.longitude).toFixed(6));
        const height = parseFloat(getUnitHeight(cartographic.height));

        console.log(`Lat: ${lat}, Lon: ${lon}, Height: ${height}`);

        toolDataSource.entities.removeAll();

        toolDataSource.entities.add({
            position: cartesian,
            point: {
                show: true,
                pixelSize: 5,
                color: color,
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
            },
            label: {
                text: `Lat: ${lat}\nLon: ${lon}\nHeight: ${height} ${unit}`,
                font: "14px monospace",
                horizontalOrigin: Cesium.HorizontalOrigin.RIGHT,
                verticalOrigin: Cesium.VerticalOrigin.TOP,
                pixelOffset: new Cesium.Cartesian2(-15, 0),
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
                fillColor: color,
                showBackground: true,
                backgroundColor: bgColor,
                backgroundPadding: new Cesium.Cartesian2(16, 8),
            },
        });
    };

    eventManager.addHandler(Cesium.ScreenSpaceEventType.LEFT_CLICK, mouseLeftClickHandler);
};

export const removeMeasureLocation = (globeController: GlobeController) => {
    const { viewer, toolDataSource } = globeController;
    if (!viewer) return;

    toolDataSource.entities.removeAll();
    eventManager.destroy();
};
