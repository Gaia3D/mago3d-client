import * as Cesium from 'cesium';
import { PerspectiveFrustum } from 'cesium';

let screenSpaceEventHandler: Cesium.ScreenSpaceEventHandler | undefined;
let keyboardEventHandler: any | undefined;
let keyDownEventHandler: (e: KeyboardEvent) => void;
let keyUpEventHandler: (e: KeyboardEvent) => void;
let previousFov: number | undefined;

let status = false;

const flags: Record<string, boolean> = {
  looking: false,
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
    KeyA: "moveLeft"
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

export const onFirstPersonView = (viewer: Cesium.Viewer) => {
  const { scene, camera } = viewer;

  if (!screenSpaceEventHandler) {
    screenSpaceEventHandler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
  }
  const handler = screenSpaceEventHandler;

  if (camera.frustum instanceof PerspectiveFrustum) {
    previousFov = camera.frustum.fov;
    camera.frustum.fov = Cesium.Math.toRadians(90);
  }

  const mouseWheelHandler = (event: any) => {
    const moveRate = 10;
    const delta = event / 100.0;
    camera.moveForward(moveRate * delta);
  };

  const mouseDownHandler = () => {
    status = true;
  };

  const mouseMoveHandler = (moveEvent: Cesium.ScreenSpaceEventHandler.MotionEvent) => {
    handleMouseMove(moveEvent, viewer, 1.5);
  };

  const mouseMoveWithShiftHandler = (moveEvent: Cesium.ScreenSpaceEventHandler.MotionEvent) => {
    handleMouseMove(moveEvent, viewer, 4.0);
  };

  const mouseUpHandler = () => {
    status = false;
  };

  keyboardEventHandler = () => {
    const moveRate = 0.75;
    if (flags.moveForward) camera.moveForward(moveRate);
    if (flags.moveBackward) camera.moveBackward(moveRate);
    if (flags.moveUp) camera.moveUp(moveRate);
    if (flags.moveDown) camera.moveDown(moveRate);
    if (flags.moveLeft) camera.moveLeft(moveRate);
    if (flags.moveRight) camera.moveRight(moveRate);
  };

  keyDownEventHandler = (e: KeyboardEvent) => {
    const flagName = getFlagForKeyCode(e.code);
    if (flagName) {
      flags[flagName] = true;
    }
  };

  keyUpEventHandler = (e: KeyboardEvent) => {
    const flagName = getFlagForKeyCode(e.code);
    if (flagName) {
      flags[flagName] = false;
    }
  };

  viewer.clock.onTick.addEventListener(keyboardEventHandler);
  document.addEventListener(
      "keydown",
      keyDownEventHandler,
      false
  );
  document.addEventListener(
      "keyup",
      keyUpEventHandler,
      false
  );

  handler.setInputAction(mouseDownHandler, Cesium.ScreenSpaceEventType.LEFT_DOWN);
  handler.setInputAction(mouseMoveHandler, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  handler.setInputAction(mouseMoveWithShiftHandler, Cesium.ScreenSpaceEventType.MOUSE_MOVE, Cesium.KeyboardEventModifier.SHIFT);
  handler.setInputAction(mouseWheelHandler, Cesium.ScreenSpaceEventType.WHEEL);
  handler.setInputAction(mouseUpHandler, Cesium.ScreenSpaceEventType.LEFT_UP);

  Object.assign(scene.screenSpaceCameraController, {
    enableRotate: false,
    enableTranslate: false,
    enableZoom: false,
    enableTilt: false,
    enableLook: false
  });
};

export const offFirstPersonView = (viewer: Cesium.Viewer) => {
  const { scene, camera } = viewer;

  Object.assign(scene.screenSpaceCameraController, {
    enableRotate: true,
    enableTranslate: true,
    enableZoom: true,
    enableTilt: true,
    enableLook: true
  });

  if (camera.frustum instanceof PerspectiveFrustum && previousFov !== undefined) {
    camera.frustum.fov = previousFov;
  }

  if (keyboardEventHandler) {
    viewer.clock.onTick.removeEventListener(keyboardEventHandler);
    document.removeEventListener(
        "keydown",
        keyDownEventHandler,
        false
    );
    document.removeEventListener(
        "keyup",
        keyUpEventHandler,
        false
    );
  }

  const handler = screenSpaceEventHandler;
  if (handler) {
    handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOWN);
    handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE, Cesium.KeyboardEventModifier.SHIFT);
    handler.removeInputAction(Cesium.ScreenSpaceEventType.WHEEL);
    handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_UP);
  }
};
