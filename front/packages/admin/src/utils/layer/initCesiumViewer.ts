import * as Cesium from "cesium";

export const initCesiumViewer = (container: HTMLElement): Cesium.Viewer => {
  const viewer = new Cesium.Viewer(container, {
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
    terrainProvider: new Cesium.EllipsoidTerrainProvider(),
  });
  // 기본 imageryLayers 제거
  viewer.imageryLayers.removeAll();
  // 카메라 한국 설정
  viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(127.9780, 36.5665, 800000),
  });

  return viewer;
};
