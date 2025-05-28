import {atom} from "recoil";
import {LayerAsset} from "@mnd/shared/src/types/layerset/gql/graphql";

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