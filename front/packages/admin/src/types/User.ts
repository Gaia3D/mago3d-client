import { KeycloakPaginationQuery } from "./Common";
import { UserQuery } from "@keycloak/keycloak-admin-client/lib/resources/users";

export type UserSearchConditionDivision = 'army' | 'navy' | 'airforce' | 'marines' | 'personnel';
export type UserSearchConditionTarget = 'username' | 'name' | 'unit';

export type UserSearchCondition = KeycloakPaginationQuery & {
    currentPage: number;
    keyword?: string;
    target?: UserSearchConditionTarget;
    division?: UserSearchConditionDivision
    enabled?: boolean;
    representationCount: number;
    exact?: boolean;
}

export type UserQueryWithAdditionalPageInfo = UserQuery & Pick<UserSearchCondition, 'currentPage' | 'representationCount'>;