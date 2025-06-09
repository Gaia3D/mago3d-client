import {LayerStyle, UserLayerAsset} from "@mnd/shared/src/types/layerset/gql/graphql.ts";
import * as Cesium from "cesium";
import {addLayerToCache} from "@/utils/layerCache.ts";

export const loadWmsLayer = async (layer: UserLayerAsset, viewer: Cesium.Viewer, style?: LayerStyle) => {
  const layerName = layer.properties?.layer?.resource?.name;

  const defaultStyle = style ? style : layer.styles?.find(style => style?.defaultStatus);
  const styleName = defaultStyle?.context?.layerName ?? "";

  if (!layerName) {
    console.warn("유효하지 않은 layer name");
    return;
  }

  const imageryLayer = new Cesium.ImageryLayer(
    new Cesium.WebMapServiceImageryProvider({
      url: import.meta.env.VITE_GEOSERVER_WMS_SERVICE_URL,
      layers: layerName,
      parameters: {
        service: "WMS",
        request: "GetMap",
        version: "1.1.1",
        format: "image/png",
        transparent: "true",
        styles: styleName,
        tiled: true,
      },
    }),
    { show: !!layer.visible }
  );

  viewer.scene.imageryLayers.add(imageryLayer);
  addLayerToCache(layer.assetId, imageryLayer);
}