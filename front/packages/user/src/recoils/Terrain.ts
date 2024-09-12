import {atom} from "recoil";

export const TerrainUrlState = atom<string>({
    key: 'TerrainUrlState',
    default: localStorage.getItem('TERRAIN_URL') ?? '',
});