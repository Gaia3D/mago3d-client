import * as Cesium from "cesium";
import {addLayerToCache} from "@/utils/layerCache.ts";
import {UserLayerAsset} from "@mnd/shared/src/types/layerset/gql/graphql.ts";

export const loadTiles3DLayer = async (layer: UserLayerAsset, tilesPrimitives: Cesium.PrimitiveCollection) => {
    if(!tilesPrimitives) return;
    Cesium.Cesium3DTileset.fromUrl(import.meta.env.VITE_API_URL + layer.properties.resource)
        .then(model => {
            model.show = !!layer.visible;
            model.pointCloudShading.attenuation = true;
            model.pointCloudShading.maximumAttenuation = 5.0;
            model.pointCloudShading.eyeDomeLighting = true;
            model.pointCloudShading.eyeDomeLightingStrength = 0.1;
            tilesPrimitives.add(model);
            addLayerToCache(layer.assetId, model);
        });
}