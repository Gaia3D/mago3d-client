import { atom } from "recoil";
import { LoadingStateType } from "../types/Common";


export const loadingState = atom<LoadingStateType>({
    key: 'loadingState',
    default: {
        loading: false,
        msg: '작업이 진행중입니다.'
    },
});