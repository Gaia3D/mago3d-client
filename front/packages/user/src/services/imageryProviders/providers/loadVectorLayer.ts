import * as Cesium from "cesium";
import { LayerBackground, UserLayerAsset } from "@mnd/shared/src/types/layerset/gql/graphql.ts";
import { loadWmsLayer } from "@/services/imageryProviders/providers/loadWmsLayer.ts";
import { loadVectorIconLayer } from "@/services/imageryProviders/providers/loadVectorIconLayer.ts";
import { SetterOrUpdater } from "recoil";
import { LoadingStateType } from "@/recoils/Spinner.ts";

export const loadVectorLayer = async (
  layer: UserLayerAsset,
  viewer: Cesium.Viewer,
  selectedBackground: LayerBackground,
  setLoadingState: SetterOrUpdater<LoadingStateType>
) => {
  const styles = layer.styles ?? [];
  const defaultStyle = styles.find(style => style?.defaultStatus);

  // 1. defaultStyle이 있고 현재 background에 사용 가능한 경우
  const isUsableDefault = defaultStyle &&
    (!defaultStyle.backgroundId || defaultStyle.backgroundId === selectedBackground.id);

  if (isUsableDefault) {
    const isIconLayer = !!defaultStyle.context.iconStyle;
    if (isIconLayer) {
      return loadVectorIconLayer(layer, defaultStyle, viewer, setLoadingState);
    }
    return loadWmsLayer(layer, viewer, defaultStyle);
  }

  // 2. backgroundId가 일치하는 스타일 우선
  const matchedById = styles.find(style => style?.backgroundId === selectedBackground.id);
  if (matchedById) {
    const isIconLayer = !!matchedById.context.iconStyle;
    if (isIconLayer) {
      return loadVectorIconLayer(layer, matchedById, viewer, setLoadingState);
    }
    return loadWmsLayer(layer, viewer, matchedById);
  }

  // 3. backgroundId가 없는 스타일 (모든 배경 허용)
  const matchedWithoutId = styles.find(style => !style?.backgroundId);
  if (matchedWithoutId) {
    const isIconLayer = !!matchedWithoutId.context.iconStyle;
    if (isIconLayer) {
      return loadVectorIconLayer(layer, matchedWithoutId, viewer, setLoadingState);
    }
    return loadWmsLayer(layer, viewer, matchedWithoutId);
  }

  // 4. 스타일 없이 fallback
  return loadWmsLayer(layer, viewer);
};
