import * as Cesium from 'cesium';

let screenSpaceEventHandler: Cesium.ScreenSpaceEventHandler | undefined = undefined;

let pickedObject: any = undefined;

export const onViewPoint = (viewer: Cesium.Viewer) => {
  const scene = viewer.scene;

  if (!screenSpaceEventHandler) {
    screenSpaceEventHandler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
  }

  const mouseLeftClickHandler = (event: { position: Cesium.Cartesian2 }) => {
    pickedObject = scene.pick(event.position);

    const pickedEllipsoidPosition = scene.pickPositionSupported
        ? scene.pickPosition(event.position)
        : viewer.camera.pickEllipsoid(event.position, scene.globe.ellipsoid);

    if (!pickedEllipsoidPosition) {
      console.warn('Position not found on ellipsoid');
      return;
    }

    let startCartesian = pickedEllipsoidPosition;
    let centerHeight = 0;

    if (pickedObject instanceof Cesium.Cesium3DTileFeature) {
      /* @ts-expect-error: null */
      startCartesian = pickedObject.content.tile.boundingSphere.center;
      centerHeight = Cesium.Cartographic.fromCartesian(startCartesian).height;
    } else if (pickedObject?.primitive instanceof Cesium.Primitive) {
      startCartesian = pickedObject.primitive.boundingSphere.center;
      centerHeight = pickedObject.id.polygon.height.getValue();
    } else {
      const cartographic = Cesium.Cartographic.fromCartesian(startCartesian);
      centerHeight = scene.globe.getHeight(cartographic) || 0;
    }

    const manHeight = 1.5;

    const cartographic = Cesium.Cartographic.fromCartesian(startCartesian);
    const startDestination = Cesium.Cartesian3.fromRadians(
        cartographic.longitude,
        cartographic.latitude,
        cartographic.height + manHeight
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
  }
};

export const clearEntities = (viewer: Cesium.Viewer) => {
  viewer.entities.removeAll();
};
