import {atom} from "recoil";
import {LayerAsset, LayerStyle} from "@mnd/shared/src/types/layerset/gql/graphql";
import {EditableStyleModel} from "@src/layer-style/models/EditableStyleModel";

// 선택된 에셋
export const selectedAssetState = atom<LayerAsset | undefined>({
  key: "selectedAssetState",
  default: undefined
})

// 선택된 에셋의 원본 데이터
export const remoteAssetDataState = atom<any>({
  key: "remoteAssetDataState",
  default: undefined
})

// 스타일 모드
export const styleModeState = atom<"list" | "edit">({
  key: "styleModeState",
  default: "list"
});

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
