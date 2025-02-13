import React, { useEffect } from "react";
import * as Cesium from "cesium";
import { PerspectiveFrustum } from "cesium";
import { GlobeController } from "@/api/GlobeController.ts";
import { eventManager } from "@/components/tool/eventManager.ts";

interface PersonViewProps {
    globeController: GlobeController;
}

const eventGroupId = "PersonView";

let keyboardEventHandler: (() => void) | null = null;
let previousFov: number | undefined;

let status = false;

const WHEEL_MOVE_RATE = 10;
const MOVE_RATE = 0.75;
const FOV = 90;

const flags: Record<string, boolean> = {
    moveForward: false,
    moveBackward: false,
    moveUp: false,
    moveDown: false,
    moveLeft: false,
    moveRight: false,
};

const getFlagForKeyCode = (code: string): string | undefined => {
    const keyMapping: Record<string, string> = {
        KeyW: "moveForward",
        KeyS: "moveBackward",
        KeyQ: "moveUp",
        KeyE: "moveDown",
        KeyD: "moveRight",
        KeyA: "moveLeft",
    };
    return keyMapping[code];
};

const handleMouseMove = (
    moveEvent: Cesium.ScreenSpaceEventHandler.MotionEvent,
    viewer: Cesium.Viewer,
    intensity: number
) => {
    if (status) {
        const { clientWidth: width, clientHeight: height } = viewer.canvas;
        const x = moveEvent.endPosition.x - moveEvent.startPosition.x;
        const y = moveEvent.endPosition.y - moveEvent.startPosition.y;
        const angleX = (-x / width) * intensity;
        const angleY = (y / height) * intensity;

        const { camera } = viewer;
        camera.setView({
            destination: camera.position,
            orientation: {
                heading: camera.heading + angleX,
                pitch: camera.pitch + angleY,
                roll: camera.roll,
            },
        });
    }
};

export const PersonView: React.FC<PersonViewProps> = ({ globeController }) => {
    useEffect(() => {
        const { viewer } = globeController;
        if (!viewer) return;

        const { scene, camera } = viewer;

        if (camera.frustum instanceof PerspectiveFrustum) {
            previousFov = camera.frustum.fov;
            camera.frustum.fov = Cesium.Math.toRadians(FOV);
        }

        const mouseWheelHandler = (wheelRate: number) => {
            const delta = wheelRate / 100.0;
            camera.moveForward(WHEEL_MOVE_RATE * delta);
        };

        const mouseDownHandler = () => (status = true);

        const mouseMoveHandler = (moveEvent: Cesium.ScreenSpaceEventHandler.MotionEvent) =>
            handleMouseMove(moveEvent, viewer, 1.5);

        const mouseUpHandler = () => (status = false);

        const keyDownHandler = (e: KeyboardEvent) => {
            const flagName = getFlagForKeyCode(e.code);
            if (flagName) flags[flagName] = true;
        };

        const keyUpHandler = (e: KeyboardEvent) => {
            const flagName = getFlagForKeyCode(e.code);
            if (flagName) flags[flagName] = false;
        };

        eventManager.init(viewer);
        eventManager.addHandler(eventGroupId, Cesium.ScreenSpaceEventType.WHEEL, mouseWheelHandler);
        eventManager.addHandler(eventGroupId, Cesium.ScreenSpaceEventType.LEFT_DOWN, mouseDownHandler);
        eventManager.addHandler(eventGroupId, Cesium.ScreenSpaceEventType.MOUSE_MOVE, mouseMoveHandler);
        eventManager.addHandler(eventGroupId, Cesium.ScreenSpaceEventType.LEFT_UP, mouseUpHandler);

        eventManager.addGlobalHandler(eventGroupId, "keydown", keyDownHandler as EventListener);
        eventManager.addGlobalHandler(eventGroupId, "keyup", keyUpHandler as EventListener);

        keyboardEventHandler = () => {
            if (flags.moveForward) camera.moveForward(MOVE_RATE);
            if (flags.moveBackward) camera.moveBackward(MOVE_RATE);
            if (flags.moveUp) camera.moveUp(MOVE_RATE);
            if (flags.moveDown) camera.moveDown(MOVE_RATE);
            if (flags.moveLeft) camera.moveLeft(MOVE_RATE);
            if (flags.moveRight) camera.moveRight(MOVE_RATE);
        };
        viewer.clock.onTick.addEventListener(keyboardEventHandler);

        Object.assign(scene.screenSpaceCameraController, {
            enableRotate: false,
            enableTranslate: false,
            enableZoom: false,
            enableTilt: false,
            enableLook: false,
        });

        return () => {
            eventManager.destroyGroup(eventGroupId);

            if (keyboardEventHandler) {
                viewer.clock.onTick.removeEventListener(keyboardEventHandler);
            }

            Object.assign(scene.screenSpaceCameraController, {
                enableRotate: true,
                enableTranslate: true,
                enableZoom: true,
                enableTilt: true,
                enableLook: true,
            });

            if (camera.frustum instanceof PerspectiveFrustum && previousFov !== undefined) {
                camera.frustum.fov = previousFov;
            }
        };
    }, [globeController]);

    return null;
};
