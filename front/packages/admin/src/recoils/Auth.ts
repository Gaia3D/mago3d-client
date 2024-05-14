import { IUserInfo } from "@mnd/shared";
import { atom, selector } from "recoil";
import keycloak from "../api/Keycloak";

export const authenticateState = atom<boolean>({
    key:'authenticateState',
    default: false
});

export const hasAdminRoleState = atom<boolean>({
    key:'hasAdminRoleState',
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
            hasAnalyzeRole: keycloak.hasRealmRole('analyze')
        } as IUserInfo;
        const keycloakProfile = keycloak.profile ? keycloak.profile: await keycloak.loadUserProfile();
        
        return Object.assign(userInfo, keycloakProfile);
    }
});