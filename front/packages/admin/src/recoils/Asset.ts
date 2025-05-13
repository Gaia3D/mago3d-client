import {LayerAsset} from "@src/generated/gql/layerset/graphql";
import {atom} from "recoil";

export const selectedAssetState = atom<LayerAsset | undefined>({
  key: "selectedAssetState",
  default: undefined
})