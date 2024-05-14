import { NodeModel } from "@minoru/react-dnd-treeview";
import { Maybe, UserLayerAsset, UserLayerGroup } from "@mnd/shared/src/types/layerset/gql/graphql";
import { atom } from "recoil";

export const layersState = atom<UserLayerAsset[]>({
  key:'layers',
  default: []
});

export const visibleToggledLayerIdState = atom<string | null>({
  key:'visibleToggledLayerIdState',
  default: ''
});

export const visibleToggledLayerIdsState = atom<{ids:string[], visible:boolean} | null>({
  key:'visibleToggledLayerIdsState',
  default: null
});

export const NodeModelsState = atom<NodeModel[]>({
  key: 'NodeModelsState',
  default: []
});

export const UserLayerGroupState = atom<Maybe<UserLayerGroup>[]>({
  key: 'UserLayerGroupState',
  default: []
});

export const InitialOpenState = atom<number[]>({
  key: 'InitialOpenState',
  default: []
});