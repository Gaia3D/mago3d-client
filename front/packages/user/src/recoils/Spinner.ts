import { atom } from "recoil";

export type LoadingStateType= {
    loading: boolean,
    msg: string
}

export const loadingState = atom<LoadingStateType>({
    key: 'loadingState',
    default: {
        loading: false,
        msg: '작업이 진행중입니다.'
    },
});

export type AssetLoadingStateType = {
    loading: boolean,
    msg: string
}

export const assetLoadingState = atom<AssetLoadingStateType>({
    key: 'assetLoadingState',
    default: {
        loading: false,
        msg: 'asset loading...'
    }
})