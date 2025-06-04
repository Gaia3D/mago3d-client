import * as Cesium from "cesium";
import {LayerBackground} from "@mnd/shared/src/types/layerset/gql/graphql";

export const updateImageryProvider = (
  viewer: Cesium.Viewer,
  currentLayers: Cesium.ImageryLayer[] | null,
  backgroundMap: LayerBackground
): Cesium.ImageryLayer[] => {
  const urls = Array.isArray(backgroundMap.url) ? backgroundMap.url : [backgroundMap.url];

  // 기존 레이어 제거
  if (currentLayers) {
    currentLayers.forEach(layer => viewer.imageryLayers.remove(layer, true));
  }

  const newLayers: Cesium.ImageryLayer[] = [];

  for (const url of urls) {
    let imageryProvider: Cesium.ImageryProvider;

    if (backgroundMap.type === "osm") {
      imageryProvider = new Cesium.OpenStreetMapImageryProvider({ url });
    } else {
      imageryProvider = new Cesium.WebMapTileServiceImageryProvider({
        url,
        layer: "Base",
        style: "default",
        maximumLevel: 19,
        tileMatrixSetID: "default028mm",
      });
    }

    const layer = viewer.imageryLayers.addImageryProvider(imageryProvider);
    newLayers.push(layer);
  }

  return newLayers;
};
