import React, { useEffect } from "react";
import * as Cesium from "cesium";
import { GlobeController } from "@/api/GlobeController.ts";
import { eventManager } from "@/components/tool/eventManager.ts";

interface LocationViewProps {
    globeController: GlobeController;
}

const eventGroupId = "LocationView";
const CONST_HEIGHT = 300;

let pickedObject: any | undefined = undefined;

const getCenterHeight = (
    pickedObject: any | undefined,
    startCartesian: Cesium.Cartesian3,
    scene: Cesium.Scene
): number => {
    if (pickedObject instanceof Cesium.Cesium3DTileFeature) {
        return Cesium.Cartographic.fromCartesian(startCartesian).height;
    } else if (pickedObject?.primitive instanceof Cesium.Primitive) {
        return pickedObject.id.polygon.height.getValue();
    } else {
        const cartographic = Cesium.Cartographic.fromCartesian(startCartesian);
        return scene.globe.getHeight(cartographic) || 0;
    }
};

export const LocationView: React.FC<LocationViewProps> = ({ globeController }) => {
    useEffect(() => {
        const { viewer } = globeController;
        if (!viewer) return;

        const leftClickHandler = (event: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
            const scene = viewer.scene;
            pickedObject = scene.pick(event.position);

            const pickedEllipsoidPosition = scene.pickPositionSupported
                ? scene.pickPosition(event.position)
                : viewer.camera.pickEllipsoid(event.position, scene.globe.ellipsoid);

            if (!pickedEllipsoidPosition) {
                console.warn("Position not found on ellipsoid");
                return;
            }

            const startCartesian = pickedEllipsoidPosition;
            const cartographic = Cesium.Cartographic.fromCartesian(startCartesian);
            const centerHeight = getCenterHeight(pickedObject, startCartesian, scene);
            const startDestination = Cesium.Cartesian3.fromRadians(
                cartographic.longitude,
                cartographic.latitude,
                centerHeight + CONST_HEIGHT
            );

            viewer.camera.flyTo({
                destination: startDestination,
                orientation: {
                    heading: viewer.camera.heading,
                    pitch: Cesium.Math.toRadians(-90),
                    roll: 0
                },
                duration: 2.0,
            });
        };

        eventManager.init(viewer);
        eventManager.addHandler(eventGroupId, Cesium.ScreenSpaceEventType.LEFT_CLICK, leftClickHandler);

        return () => {
            eventManager.destroyGroup(eventGroupId);
        };
    }, [globeController]);

    return null;
};