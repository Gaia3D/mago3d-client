import React, { useEffect } from "react";
import * as Cesium from "cesium";
import { eventManager } from "@/components/tool/eventManager.ts";
import { GlobeController } from "@/api/GlobeController.ts";
import {createLabelEntity, createPointEntity, createPolylineEntity} from "@/components/utils/measureEntities.ts";

interface MeasureAngleProps {
    globeController: GlobeController;
}

const eventGroupId = "MeasureAngle";


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
                createPolylineEntity(
                    toolDataSource,
                    [cartesians[cartesians.length - 2], cartesians[cartesians.length - 1]],
                    false
                );
            }

            if (cartesians.length >= 3) {
                createPolylineEntity(toolDataSource, [cartesians[cartesians.length - 2], cartesians[cartesians.length - 1]], false);

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

    return null;
};
