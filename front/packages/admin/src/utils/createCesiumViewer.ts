import * as Cesium from "cesium";
import {getWmsLayerImageProvider} from "@src/components/layerset/utils/utils";

export const createCesiumViewer = (containerId: string): Cesium.Viewer => {
  const viewer = new Cesium.Viewer(containerId, {
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

  viewer.imageryLayers.removeAll();

  if (import.meta.env.MODE === 'production' && import.meta.env.VITE_BASE_LAYER_NAME) {
    // 운영환경에서는 배경지도를 WMS로 설정
    const baseImageryProvider = getWmsLayerImageProvider(import.meta.env.VITE_BASE_LAYER_NAME);
    viewer.imageryLayers.addImageryProvider(baseImageryProvider);
  } else {
    // 개발환경에서는 OSM으로 설정
    const osmImageryProvider = new Cesium.OpenStreetMapImageryProvider({ url: 'https://a.tile.openstreetmap.org/' });
    viewer.imageryLayers.addImageryProvider(osmImageryProvider);
  }

  return viewer;
};
