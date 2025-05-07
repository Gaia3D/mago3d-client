import * as Cesium from "cesium";

export const initCesiumViewer = (container: HTMLElement): Cesium.Viewer => {

  const baseLayer = new Cesium.ImageryLayer(
    new Cesium.SingleTileImageryProvider({
      url: "",
      tileWidth: 0,
      tileHeight: 0,
    })
  );

  const viewer = new Cesium.Viewer(container, {
    baseLayer,
    terrainProvider: new Cesium.EllipsoidTerrainProvider(),
    geocoder: false,
    homeButton: false,
    baseLayerPicker: false,
    sceneModePicker: false,
    navigationHelpButton: false,
    animation: false,
    timeline: false,
    fullscreenButton: false,
    shouldAnimate: true,
    infoBox: false,
    selectionIndicator: false,
  });

  viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(127.9780, 36.5665, 800000),
  });

  return viewer;
};
