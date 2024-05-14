import { KeycloakProfile } from "keycloak-js";

export type UserInfo = KeycloakProfile & {
    isAdmin: boolean,
}

export interface IUserInfo extends KeycloakProfile {
    isAdmin?: boolean,
    hasUserRole: boolean, // 접속 권한(일반사용자)
    hasDownloadRole: boolean, // 다운로드 권한
    hasAnalyzeRole: boolean, // 분석 권한
    isEqualUserId?: (id: string) => boolean
}