import * as Cesium from "cesium";
import { BackgroundMapType } from "@src/constants/backgroundMap";

export const updateImageryProvider = (
  viewer: Cesium.Viewer,
  currentLayer: Cesium.ImageryLayer | null,
  backgroundMap: BackgroundMapType
): Cesium.ImageryLayer => {
  let imageryProvider: Cesium.ImageryProvider;

  if (backgroundMap.type === "osm") {
    imageryProvider = new Cesium.OpenStreetMapImageryProvider({ url: backgroundMap.url });
  } else {
    imageryProvider = new Cesium.WebMapTileServiceImageryProvider({
      url: backgroundMap.url,
      layer: "Base",
      style: "default",
      maximumLevel: 19,
      tileMatrixSetID: "default028mm",
    });
  }

  if (currentLayer) {
    viewer.imageryLayers.remove(currentLayer, true);
  }

  return viewer.imageryLayers.addImageryProvider(imageryProvider);
};
