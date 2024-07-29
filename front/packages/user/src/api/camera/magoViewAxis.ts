import * as Cesium from 'cesium';

const MAN_HEIGHT = 1.5;
const UP_HEIGHT = 50.0;
const color = Cesium.Color.RED;
let screenSpaceEventHandler: Cesium.ScreenSpaceEventHandler | undefined = undefined;

let status = false;

let pickedObject: any = undefined;
let startCartesian: Cesium.Cartesian3 | undefined = undefined;
let endCartesian: Cesium.Cartesian3 | undefined = undefined;

let startEntity: Cesium.Entity | undefined = undefined;
let endEntity: Cesium.Entity | undefined = undefined;
let lineEntity: Cesium.Entity | undefined = undefined;

export const onViewAxis = (viewer: Cesium.Viewer) => {
  const scene = viewer.scene;

  if (!screenSpaceEventHandler) {
    screenSpaceEventHandler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
  }

  const mouseLeftClickHandler = (event: any) => {
    if (!status) {
      status = true;
      clearEntities(viewer);
    } else {
      status = false;

      if (startCartesian && endCartesian) {
        setCameraView(viewer, startCartesian, endCartesian);
      }
      return;
    }

    pickedObject = scene.pick(event.position);
    let pickedEllipsoidPosition = getEllipsoidPosition(viewer, event.position, pickedObject);

    if (pickedEllipsoidPosition) {
      const convertCartographic = Cesium.Cartographic.fromCartesian(pickedEllipsoidPosition);
      pickedEllipsoidPosition = Cesium.Cartesian3.fromRadians(
          convertCartographic.longitude,
          convertCartographic.latitude,
          convertCartographic.height + MAN_HEIGHT
      );

      startCartesian = adjustHeight(pickedEllipsoidPosition, MAN_HEIGHT);
      endCartesian = startCartesian;

      startEntity = viewer.entities.add({
        position: startCartesian,
        point: {
          color: Cesium.Color.RED,
          pixelSize: 4,
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
        },
      });

      lineEntity = viewer.entities.add({
        polyline: {
          positions: new Cesium.CallbackProperty(() => [startCartesian, endCartesian], false),
          width: 5,
          depthFailMaterial: color,
          material: new Cesium.PolylineArrowMaterialProperty(color),
        },
      });
    }
  };

  const adjustHeight = (cartesian: Cesium.Cartesian3, height: number): Cesium.Cartesian3 => {
    const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
    return Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, cartographic.height + height);
  };

  const setCameraView = (viewer: Cesium.Viewer, startCartesian: Cesium.Cartesian3, endCartesian: Cesium.Cartesian3) => {
    const startCartographic = Cesium.Cartographic.fromCartesian(startCartesian);
    const startDestination = adjustHeight(startCartesian, MAN_HEIGHT);

    const startDirection = Cesium.Cartesian3.subtract(endCartesian, startCartesian, new Cesium.Cartesian3());
    const startDirectionNormal = Cesium.Cartesian3.normalize(startDirection, new Cesium.Cartesian3());

    const startUpCartesian = adjustHeight(startCartesian, UP_HEIGHT);
    const startUpNormal = Cesium.Cartesian3.subtract(startUpCartesian, startCartesian, new Cesium.Cartesian3());

    viewer.camera.setView({
      destination: startDestination,
      orientation: {
        direction: startDirectionNormal,
        up: startUpNormal,
      },
    });
  };

  const mouseMoveHandler = (moveEvent: any) => {
    if (!status) {
      return;
    }
    const pickedEllipsoidPosition = getEllipsoidPosition(viewer, moveEvent.endPosition);

    if (pickedEllipsoidPosition) {
      endCartesian = adjustHeight(pickedEllipsoidPosition, MAN_HEIGHT);
    }
  };

  screenSpaceEventHandler.setInputAction(mouseLeftClickHandler, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  screenSpaceEventHandler.setInputAction(mouseMoveHandler, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
};

export const offViewAxis = (viewer: Cesium.Viewer) => {
  clearEntities(viewer);
  if (screenSpaceEventHandler) {
    screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
    screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  }
};

export const clearEntities = (viewer: Cesium.Viewer) => {
  if(lineEntity) viewer.entities.remove(lineEntity);
  if(startEntity) viewer.entities.remove(startEntity);
  if(endEntity) viewer.entities.remove(endEntity);
  lineEntity = undefined;
  startEntity = undefined;
  endEntity = undefined;
};

const getEllipsoidPosition = (viewer: Cesium.Viewer, position: Cesium.Cartesian2, pickedObject?: any) => {
  const scene = viewer.scene;
  let pickedEllipsoidPosition;

  if (scene.pickPositionSupported) {
    if (pickedObject?.primitive instanceof Cesium.PointPrimitive) {
      pickedEllipsoidPosition = pickedObject.primitive.position;
    } else {
      pickedEllipsoidPosition = scene.pickPosition(position);
    }
  }

  if (!pickedEllipsoidPosition) {
    pickedEllipsoidPosition = viewer.camera.pickEllipsoid(position, scene.globe.ellipsoid);
    if (pickedEllipsoidPosition) {
      const cartographic = Cesium.Cartographic.fromCartesian(pickedEllipsoidPosition);
      const height = scene.globe.getHeight(cartographic);
      pickedEllipsoidPosition = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, height || 0);
    }
  }

  return pickedEllipsoidPosition;
};
