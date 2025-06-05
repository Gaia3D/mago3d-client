import * as Cesium from "cesium";

export const initBackground = (type: string, url: string): Cesium.ImageryLayer => {
  if (type === "osm") {
    return new Cesium.ImageryLayer(
      new Cesium.OpenStreetMapImageryProvider({ url }),
      { show: true }
    );
  }

  if (type === "vworld") {
    return new Cesium.ImageryLayer(
      new Cesium.WebMapTileServiceImageryProvider({
        url,
        layer: "Base",
        style: "default",
        maximumLevel: 19,
        tileMatrixSetID: "default028mm",
      }),
      { show: true, minimumTerrainLevel: 5 }
    );
  }

  // WMS 기본 처리
  return new Cesium.ImageryLayer(
    new Cesium.WebMapServiceImageryProvider({
      url: import.meta.env.VITE_GEOSERVER_WMS_SERVICE_URL,
      layers: url,
      minimumLevel: 0,
      parameters: {
        service: "WMS",
        version: "1.1.1",
        request: "GetMap",
        transparent: "true",
        format: "image/png",
        tiled: true,
      },
    }),
    { show: true }
  );
};
