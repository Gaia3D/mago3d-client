import { NodeModel } from "@minoru/react-dnd-treeview";
import { Maybe, UserLayerAsset, UserLayerGroup } from "@mnd/shared/src/types/layerset/gql/graphql";
import { atom } from "recoil";

export const layerMenuState = atom<string>({
  key: 'layerMenuState',
  default: 'tileset'
})

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

export type LayerMapType = {
  type: string;
  url: string;
  background: string;
  name: string;
  image: string;
};

export const LayerMapArrState = atom<LayerMapType[]>({
  key: 'LayerMapArrState',
  default: [
    {
      type: 'osm',
      url : "https://a.basemaps.cartocdn.com/light_all/",
      background : "#d2d8dd",
      name : "OSM White",
      image : "osm_white.png",
    },
    {
      type: 'osm',
      url : "https://a.basemaps.cartocdn.com/dark_all/",
      background : "#090909",
      name : "OSM Dark",
      image : "osm_dark.png",
    },
    {
      type: 'osm',
      url : "https://tile.openstreetmap.org/",
      background : "#edebe5",
      name : "OSM Basic",
      image : "osm_basic.png",
    },
    {
      type: 'vworld',
      url : `https://api.vworld.kr/req/wmts/1.0.0/${import.meta.env.VITE_VWORLD_TOKEN}/Satellite/{TileMatrix}/{TileRow}/{TileCol}.jpeg`,
      background : "#686b61",
      name : "VW Satellite",
      image : "vw_sate.png",
    },
    {
      type: 'vworld',
      url : `https://api.vworld.kr/req/wmts/1.0.0/${import.meta.env.VITE_VWORLD_TOKEN}/Base/{TileMatrix}/{TileRow}/{TileCol}.png`,
      background : "#f0eee9",
      name : "VW Basic",
      image : "vw_basic.png",
    }
  ]
});

export const CurrentLayerMapState = atom<LayerMapType>({
  key: 'CurrentLayerMapState',
  default: {
    type: 'osm',
    url: "https://a.tile.openstreetmap.org/",
    background : "#edebe5",
    name: "default",
    image : "osm_basic.png",
  }
});