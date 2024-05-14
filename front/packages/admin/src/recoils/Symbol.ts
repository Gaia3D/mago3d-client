import {atom} from "recoil";

export const symbolPageState = atom<number>({
    key: 'symbolPageState',
    default: 0,
})