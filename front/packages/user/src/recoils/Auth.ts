import {atom, selector} from "recoil";
import keycloak from "../api/keycloak";
import {IUserInfo} from "@mnd/shared";

export const keycloakState = atom<boolean>({
    key:'keycloakState',
    default: false
});

export const authenticateState = atom<boolean>({
    key:'authenticateState',
    default: false
});

export const currentUserProfileSelector = selector<IUserInfo | null>({
    key: 'currentUserProfile',
    get: async ({get}) => {
        const auth = get(authenticateState);
        if(!auth) return null;
        const userInfo = {
            isAdmin: keycloak.hasRealmRole('admin'),
            hasUserRole: keycloak.hasRealmRole('user'),
            hasDownloadRole: keycloak.hasRealmRole('download'),
            hasAnalyzeRole: keycloak.hasRealmRole('analyze'),
        } as IUserInfo;
        console.log('currentUserProfileSelector', userInfo);
        const keycloakProfile = await keycloak.loadUserProfile();
        
        return Object.assign(userInfo, keycloakProfile);
    },
    set: ({set}, newValue) => {
        set(authenticateState, !!newValue);
    }
});