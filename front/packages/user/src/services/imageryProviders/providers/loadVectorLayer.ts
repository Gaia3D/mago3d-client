import * as Cesium from "cesium";
import {LayerBackground, UserLayerAsset} from "@mnd/shared/src/types/layerset/gql/graphql.ts";
import {loadWmsLayer} from "@/services/imageryProviders/providers/loadWmsLayer.ts";
import {loadVectorIconLayer} from "@/services/imageryProviders/providers/loadVectorIconLayer.ts";
import {SetterOrUpdater} from "recoil";
import {LoadingStateType} from "@/recoils/Spinner.ts";

export const loadVectorLayer = async (
  layer: UserLayerAsset,
  viewer: Cesium.Viewer,
  selectedBackground: LayerBackground,
  setLoadingState: SetterOrUpdater<LoadingStateType>
) => {
  const defaultStyle = layer.styles?.find(style => style?.defaultStatus);
  if (!defaultStyle) {
    loadWmsLayer(layer, viewer);
    return;
  }

  const isDefaultStyleUsable =
    !defaultStyle.backgroundId || defaultStyle.backgroundId === selectedBackground.id;

  if (isDefaultStyleUsable) {
    const isIconLayer = !!defaultStyle.context.iconStyle;
    if (isIconLayer) {
      loadVectorIconLayer(layer, defaultStyle, viewer, setLoadingState);
    } else {
      loadWmsLayer(layer, viewer);
    }
    return;
  }

  // defaultStyle은 있지만 현재 background에 적용 불가능 → backgroundId 일치하는 스타일 탐색
  const matchedStyle = layer.styles?.find(
    style => style?.backgroundId === selectedBackground.id
  );

  if (!matchedStyle) return;

  const isIconLayer = !!matchedStyle.context.iconStyle;
  if (isIconLayer) {
    loadVectorIconLayer(layer, matchedStyle, viewer, setLoadingState);
  } else {
    loadWmsLayer(layer, viewer);
  }
};
