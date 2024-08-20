import { atom } from "recoil";

export const IsNewAssetModalState = atom<boolean>({
    key: 'IsNewAssetModalState',
    default: false
})