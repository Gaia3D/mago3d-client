import * as Cesium from 'cesium';

let screenSpaceEventHandler: Cesium.ScreenSpaceEventHandler | undefined = undefined;

let pickedObject: any = undefined;
const MAN_HEIGHT = 1.5;

const getCenterHeight = (pickedObject: any, startCartesian: Cesium.Cartesian3, scene: Cesium.Scene): number => {
  if (pickedObject instanceof Cesium.Cesium3DTileFeature) {
    return Cesium.Cartographic.fromCartesian(startCartesian).height;
  } else if (pickedObject?.primitive instanceof Cesium.Primitive) {
    return pickedObject.id.polygon.height.getValue();
  } else {
    const cartographic = Cesium.Cartographic.fromCartesian(startCartesian);
    return scene.globe.getHeight(cartographic) || 0;
  }
};

export const onViewPoint = (viewer: Cesium.Viewer) => {
  const scene = viewer.scene;

  if (!screenSpaceEventHandler) {
    screenSpaceEventHandler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
  }

  const mouseLeftClickHandler = (event: { position: Cesium.Cartesian2 }) => {
    pickedObject = scene.pick(event.position) as Cesium.Entity | Cesium.Primitive | Cesium.Cesium3DTileFeature;

    const pickedEllipsoidPosition = scene.pickPositionSupported
        ? scene.pickPosition(event.position)
        : viewer.camera.pickEllipsoid(event.position, scene.globe.ellipsoid);

    if (!pickedEllipsoidPosition) {
      console.warn('Position not found on ellipsoid');
      return;
    }

    const startCartesian = pickedEllipsoidPosition;
    const cartographic = Cesium.Cartographic.fromCartesian(startCartesian);
    const centerHeight = getCenterHeight(pickedObject, startCartesian, scene);
    const startDestination = Cesium.Cartesian3.fromRadians(
        cartographic.longitude,
        cartographic.latitude,
        centerHeight + MAN_HEIGHT
    );

    const camera = viewer.camera;

    viewer.camera.flyTo({
      destination: startDestination,
      orientation: {
        direction: camera.direction,
        up: camera.up,
      },
      duration: 2.0,
    });
  };

  screenSpaceEventHandler.setInputAction(mouseLeftClickHandler, Cesium.ScreenSpaceEventType.LEFT_CLICK);
};

export const offViewPoint = () => {
  if (screenSpaceEventHandler) {
    screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
    screenSpaceEventHandler = undefined;
  }
};

export const clearEntities = (viewer: Cesium.Viewer) => {
  viewer.entities.removeAll();
};
