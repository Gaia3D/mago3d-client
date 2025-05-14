import {LayerAsset, LayerStyle} from "@mnd/shared/src/types/layerset/gql/graphql";
import {atom} from "recoil";

export const selectedAssetState = atom<LayerAsset | undefined>({
  key: "selectedAssetState",
  default: undefined
})

export const layerStylesState = atom<LayerStyle[]>({
  key: "layerStylesState",
  default: []
})

export const selectedLayerStyleState = atom<LayerStyle | undefined>({
  key: "selectedLayerStyleState",
  default: undefined
})