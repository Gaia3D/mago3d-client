import * as Cesium from "cesium";
import {addLayerToCache} from "@/utils/layerCache.ts";
import {UserLayerAsset} from "@mnd/shared/src/types/layerset/gql/graphql.ts";

export const loadWmsLayer = async (layer: UserLayerAsset, viewer: Cesium.Viewer) => {
    const imageryLayer = new Cesium.ImageryLayer(
        new Cesium.WebMapServiceImageryProvider({
            url: import.meta.env.VITE_GEOSERVER_WMS_SERVICE_URL,
            layers: layer.properties.layer.resource.name,
            parameters: {
              service: "WMS",
              request: "GetMap",
              version: "1.1.1",
              format: "image/png",
              transparent: "true",
              tiled: true,
            },
        }),
        {show: !!layer.visible}
    );
    viewer.scene.imageryLayers.add(imageryLayer);
    addLayerToCache(layer.assetId, imageryLayer);
}