import { NodeModel } from "@minoru/react-dnd-treeview";
import {
  LayerBackground,
  Maybe,
  TerrainAsset,
  UserLayerAsset,
  UserLayerGroup
} from "@mnd/shared/src/types/layerset/gql/graphql";
import { atom } from "recoil";

export const layerMenuState = atom<string>({
  key: 'layerMenuState',
  default: 'tileset'
})

export const layersState = atom<UserLayerAsset[]>({
  key:'layers',
  default: []
});

export const terrainState = atom<Maybe<TerrainAsset>[]>({
  key:"terrainState",
  default: []
})

export const NodeModelsState = atom<NodeModel[]>({
  key: 'NodeModelsState',
  default: []
});

export const UserLayerGroupState = atom<Maybe<UserLayerGroup>[]>({
  key: 'UserLayerGroupState',
  default: []
});

export const backgroundsState = atom<LayerBackground[]>({
  key:"backgroundsState",
  default: []
})

export const SelectedBackgroundState = atom<LayerBackground>({
  key: 'SelectedBackgroundState',
  default: {
    id: "0",
    type: 'osm',
    url : ["https://tile.openstreetmap.org/"],
    color : "#edebe5",
    name : "OSM Basic",
    image : "osm_basic",
  }
});