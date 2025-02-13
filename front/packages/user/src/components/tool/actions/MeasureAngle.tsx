import React, { useEffect } from "react";
import * as Cesium from "cesium";
import { eventManager } from "@/components/tool/eventManager.ts";
import { GlobeController } from "@/api/GlobeController.ts";

interface MeasureAngleProps {
    globeController: GlobeController;
}

const eventGroupId = "MeasureAngle";

const createPointEntity = (toolDataSource: Cesium.CustomDataSource, cartesian: Cesium.Cartesian3) => {
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
};

const createPolylineEntity = (toolDataSource: Cesium.CustomDataSource, cartesians: Cesium.Cartesian3[]) => {
    toolDataSource.entities.add({
        polyline: {
            positions: cartesians,
            width: 2,
            material: Cesium.Color.RED,
        },
    });
};

const createLabelEntity = (toolDataSource: Cesium.CustomDataSource, position: Cesium.Cartesian3, text: string) => {
    toolDataSource.entities.add({
        position,
        label: {
            text,
            font: "14px monospace",
            showBackground: true,
            backgroundColor: Cesium.Color.WHITE,
            horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            fillColor: Cesium.Color.RED,
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
        }
    });
};

export const MeasureAngle = ({ globeController }: MeasureAngleProps) => {

    useEffect(() => {
        const { viewer, toolDataSource } = globeController;
        if (!viewer) return;

        const cartesians: Cesium.Cartesian3[] = [];

        const leftClickHandler = (event: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
            const scene = viewer.scene;
            const ray = scene.camera.getPickRay(event.position);
            if (!ray) return;

            const cartesian = scene.globe.pick(ray, scene);
            if (!cartesian) return;

            cartesians.push(cartesian);
            createPointEntity(toolDataSource, cartesian);

            if (cartesians.length >= 2) {
                createPolylineEntity(toolDataSource, [
                    cartesians[cartesians.length - 2],
                    cartesians[cartesians.length - 1]],
                );
            }

            if (cartesians.length >= 3) {
                createPolylineEntity(toolDataSource, [cartesians[cartesians.length - 2], cartesians[cartesians.length - 1]]);

                const difference1 = Cesium.Cartesian3.subtract(cartesians[cartesians.length - 2], cartesians[cartesians.length - 3], new Cesium.Cartesian3());
                const difference2 = Cesium.Cartesian3.subtract(cartesians[cartesians.length - 2], cartesians[cartesians.length - 1], new Cesium.Cartesian3());
                Cesium.Cartesian3.normalize(difference1, difference1);
                Cesium.Cartesian3.normalize(difference2, difference2);

                const angle = Cesium.Math.toDegrees(Cesium.Cartesian3.angleBetween(difference1, difference2));
                createLabelEntity(toolDataSource, cartesians[cartesians.length - 2], `${angle.toFixed(2)}°`);
            }
        };

        const escKeyHandler = (keyboardEvent: KeyboardEvent) => {
            if (keyboardEvent.key === "Escape") {
                toolDataSource.entities.removeAll();
                cartesians.length = 0;
            }
        };

        eventManager.init(viewer);
        eventManager.addHandler(eventGroupId, Cesium.ScreenSpaceEventType.LEFT_CLICK, leftClickHandler);
        eventManager.addGlobalHandler(eventGroupId, "keydown", escKeyHandler as EventListener);

        return () => {
            toolDataSource.entities.removeAll();
            eventManager.destroyGroup(eventGroupId);
        };
    }, [globeController]);

    return (
        <div>
            <h3>Measure Angle</h3>
        </div>
    );
};
