import {LayerBackground, UserLayerAsset} from "@mnd/shared/src/types/layerset/gql/graphql.ts";
import * as Cesium from "cesium";
import {loadWmsLayer} from "@/services/imageryProviders/providers/loadWmsLayer.ts";

export const loadRasterLayer = (
  layer: UserLayerAsset,
  viewer: Cesium.Viewer,
  selectedBackground: LayerBackground,
) => {
  const defaultStyle = layer.styles?.find(style => style?.defaultStatus);

  if (!defaultStyle) {
    return loadWmsLayer(layer, viewer);
  }

  const matchesBackground =
    !defaultStyle.backgroundId || defaultStyle.backgroundId === selectedBackground.id;

  if (matchesBackground) {
    return loadWmsLayer(layer, viewer, defaultStyle);
  }

  return loadWmsLayer(layer, viewer);
};