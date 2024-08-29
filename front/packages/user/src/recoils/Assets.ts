import { atom } from 'recoil';

export const assetsRefetchTriggerState = atom({
    key: 'assetsRefetchTriggerState',
    default: 0,
});

export const assetsConvertingListState = atom<string[]>({
    key: 'assetsConvertingListState',
    default: [],
});