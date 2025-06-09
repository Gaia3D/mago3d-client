import { LayerBackground, UserLayerAsset } from "@mnd/shared/src/types/layerset/gql/graphql.ts";
import * as Cesium from "cesium";
import { loadWmsLayer } from "@/services/imageryProviders/providers/loadWmsLayer.ts";

export const loadRasterLayer = (
  layer: UserLayerAsset,
  viewer: Cesium.Viewer,
  selectedBackground: LayerBackground,
) => {
  const styles = layer.styles ?? [];
  const defaultStyle = styles.find(style => style?.defaultStatus);

  // 1. defaultStyle이 현재 background에 맞는 경우
  const isUsableDefault = defaultStyle &&
    (!defaultStyle.backgroundId || defaultStyle.backgroundId === selectedBackground.id);

  if (isUsableDefault) {
    return loadWmsLayer(layer, viewer, defaultStyle);
  }

  // 2. backgroundId가 일치하는 스타일 우선
  const matchedById = styles.find(style => style?.backgroundId === selectedBackground.id);
  if (matchedById) {
    return loadWmsLayer(layer, viewer, matchedById);
  }

  // 3. backgroundId가 없는 (모든 background 허용) 스타일
  const matchedWithoutId = styles.find(style => !style?.backgroundId);
  if (matchedWithoutId) {
    return loadWmsLayer(layer, viewer, matchedWithoutId);
  }

  // 4. 스타일 없이 fallback
  return loadWmsLayer(layer, viewer);
};
