// TODO: 후에 back에서 받아오기
export type BackgroundMapType = {
  id: string;
  type: "osm" | "vworld";
  url: string;
  background: string;
  name: string;
  image: string;
}

export const BackgroundMaps: BackgroundMapType[] = [
  {
    id: "1",
    type: 'osm',
    url : "https://a.basemaps.cartocdn.com/light_all/",
    background : "#d2d8dd",
    name : "OSM White",
    image : "osm_white",
  },
  {
    id: "2",
    type: 'osm',
    url : "https://a.basemaps.cartocdn.com/dark_all/",
    background : "#090909",
    name : "OSM Dark",
    image : "osm_dark",
  },
  {
    id: "3",
    type: 'osm',
    url : "https://tile.openstreetmap.org/",
    background : "#edebe5",
    name : "OSM Basic",
    image : "osm_basic",
  },
  {
    id: "4",
    type: 'vworld',
    url : `https://api.vworld.kr/req/wmts/1.0.0/${import.meta.env.VITE_VWORLD_TOKEN}/Hybrid/{TileMatrix}/{TileRow}/{TileCol}.png`,
    background : "#686b61",
    name : "VW Hybrid",
    image : "vw_hybrid",
  },
  {
    id: "5",
    type: 'vworld',
    url : `https://api.vworld.kr/req/wmts/1.0.0/${import.meta.env.VITE_VWORLD_TOKEN}/Base/{TileMatrix}/{TileRow}/{TileCol}.png`,
    background : "#f0eee9",
    name : "VW Basic",
    image : "vw_basic",
  },
  {
    id: "6",
    type: 'vworld',
    url : `https://api.vworld.kr/req/wmts/1.0.0/${import.meta.env.VITE_VWORLD_TOKEN}/Satellite/{TileMatrix}/{TileRow}/{TileCol}.jpeg`,
    background : "#686b61",
    name : "VW Satellite",
    image : "vw_sate",
  }
]