import * as Cesium from "cesium";
import { PerspectiveFrustum } from "cesium";
import { GlobeController } from "@/api/GlobeController.ts";
import {eventManager} from "@/components/tool/actions/eventManager.ts";

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

export const createSetPersonView = (globeController: GlobeController) => {
    const { viewer } = globeController;
    if (!viewer) return;

    eventManager.init(viewer);

    const { scene, camera } = viewer;

    if (camera.frustum instanceof PerspectiveFrustum) {
        previousFov = camera.frustum.fov;
        camera.frustum.fov = Cesium.Math.toRadians(FOV);
    }

    const mouseWheelHandler = (event: any) => {
        const delta = event / 100.0;
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

    console.log("add person")
    eventManager.addHandler(Cesium.ScreenSpaceEventType.WHEEL, mouseWheelHandler);
    eventManager.addHandler(Cesium.ScreenSpaceEventType.LEFT_DOWN, mouseDownHandler);
    eventManager.addHandler(Cesium.ScreenSpaceEventType.MOUSE_MOVE, mouseMoveHandler);
    eventManager.addHandler(Cesium.ScreenSpaceEventType.LEFT_UP, mouseUpHandler);

    eventManager.addGlobalHandler("keydown", keyDownHandler as EventListener);
    eventManager.addGlobalHandler("keyup", keyUpHandler as EventListener);

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
};

export const removeSetPersonView = (globeController: GlobeController) => {
    const { viewer } = globeController;
    if (!viewer) return;

    console.log("destroy person")
    eventManager.destroy();

    if (keyboardEventHandler) {
        viewer.clock.onTick.removeEventListener(keyboardEventHandler);
    }

    const { scene, camera } = viewer;

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
