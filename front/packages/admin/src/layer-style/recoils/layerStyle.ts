import {atom} from "recoil";
import {LayerAsset, RemoteLayerAsset} from "@mnd/shared/src/types/layerset/gql/graphql";
import {EditableStyleModel} from "@src/layer-style/models/EditableStyleModel";
import {BackgroundMaps, BackgroundMapType} from "@src/constants/backgroundMap";

// 선택된 에셋
export const selectedAssetState = atom<LayerAsset | undefined>({
  key: "selectedAssetState",
  default: undefined
})

// 선택된 에셋의 원본 데이터
export const remoteAssetDataState = atom<RemoteLayerAsset>({
  key: "remoteAssetDataState",
  default: undefined
})

// 선택된 배경지도
export const selectedBackgroundState = atom<BackgroundMapType>({
  key: "selectedBackgroundState",
  default: BackgroundMaps[0]
})

// 전체 스타일
export const editableStylesState = atom<EditableStyleModel[]>({
  key: "editableStylesState",
  default: []
})

// 수정 중인 스타일
export const editingStyleState = atom<EditableStyleModel | undefined>({
  key: "editingStyleState",
  default: undefined
})
