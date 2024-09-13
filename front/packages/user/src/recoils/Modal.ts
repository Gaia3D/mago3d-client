import { atom } from "recoil";

export const IsNewAssetModalState = atom<boolean>({
    key: 'IsNewAssetModalState',
    default: false
})

export const IsLogModalState = atom<boolean>({
    key: 'IsLogModalState',
    default: false
})

export const LogModalContentState = atom<string>({
    key: 'LogModalContentState',
    default: ''
})