import {LayerAsset, LayerStyle, UpdateStyleInput} from "@mnd/shared/src/types/layerset/gql/graphql";
import {atom} from "recoil";
import {DEFAULT_STYLE_CONTEXT, StyleContextType} from "@src/types/StyleContext";
import {CompleteStyleType} from "@src/components/refactor-layer-style/mapStyleToCompleteStyleType";

// 선택된 에셋
export const selectedAssetState = atom<LayerAsset | undefined>({
  key: "selectedAssetState",
  default: undefined
})

// 전체스타일
export const layerStylesState = atom<LayerStyle[]>({
  key: "layerStylesState",
  default: []
})

// 선택한 스타일
export const selectedLayerStyleState = atom<LayerStyle | undefined>({
  key: "selectedLayerStyleState",
  default: undefined
})

// 선택한 asset의 remote
export const remoteAssetDataState = atom<any>({
  key: "remoteAssetDataState",
  default: undefined
})

// globalContext
export const globalStyleContextState = atom<StyleContextType>({
  key: "globalStyleContextState",
  default: DEFAULT_STYLE_CONTEXT
})

export const completeStylesState = atom<CompleteStyleType[]>({
  key: "completeStylesState",
  default: []
})

export const editingStyleState = atom<CompleteStyleType | undefined>({
  key: "editingStyleState",
  default: undefined
})

// 기본 스타일
// 라벨 스타일
// 속성 스타일
// 배경지도
// entity 표출 개수 or 범례
