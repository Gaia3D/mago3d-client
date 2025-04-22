import * as Cesium from "cesium";
import {addLayerToCache} from "@/utils/layerCache.ts";
import {UserLayerAsset} from "@mnd/shared/src/types/layerset/gql/graphql.ts";

export const loadTiles3DLayer = async (layer: UserLayerAsset, tilesPrimitives: Cesium.PrimitiveCollection) => {
  if (!tilesPrimitives) return;

  const tileset = await Cesium.Cesium3DTileset.fromUrl(
    import.meta.env.VITE_API_URL + layer.properties.resource,
    {
      // maximumScreenSpaceError: 32, // 128 = 1000m
      // skipLevelOfDetail: true,
      // baseScreenSpaceError: 1024,
      // dynamicScreenSpaceError: true,
      // dynamicScreenSpaceErrorDensity: 0.01,
      // dynamicScreenSpaceErrorFactor: 4.0,
      // dynamicScreenSpaceErrorHeightFalloff: 0.25,
    }
  );

  tileset.show = !!layer.visible;
  tileset.pointCloudShading.attenuation = true;
  tileset.pointCloudShading.maximumAttenuation = 5.0;
  tileset.pointCloudShading.eyeDomeLighting = true;
  tileset.pointCloudShading.eyeDomeLightingStrength = 0.1;

  tilesPrimitives.add(tileset);
  addLayerToCache(layer.assetId, tileset);
};
