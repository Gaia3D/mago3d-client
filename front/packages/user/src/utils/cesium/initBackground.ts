import * as Cesium from "cesium";

const createOsmProvider = (url: string) => {
  const queryIndex = url.indexOf("?");
  if (queryIndex === -1) {
    return new Cesium.OpenStreetMapImageryProvider({ url });
  }

  const baseUrl = url.slice(0, queryIndex).replace(/\/?$/, "/");
  const queryString = url.slice(queryIndex + 1);

  return new Cesium.UrlTemplateImageryProvider({
    url: `${baseUrl}{z}/{x}/{y}.png?${queryString}`,
    tilingScheme: new Cesium.WebMercatorTilingScheme(),
    tileWidth: 256,
    tileHeight: 256,
    minimumLevel: 0,
    credit: new Cesium.Credit("MapQuest, Open Street Map and contributors, CC-BY-SA"),
  });
};

export const initBackground = (type: string, url: string): Cesium.ImageryLayer => {
  if (type === "osm") {
    return new Cesium.ImageryLayer(createOsmProvider(url), { show: true });
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
