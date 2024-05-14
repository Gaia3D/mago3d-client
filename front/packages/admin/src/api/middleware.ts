import {RequestMiddleware, ResponseMiddleware} from "graphql-request";
import keycloak from "./Keycloak";
import {alertToast} from "@mnd/shared/src/utils/toast";
import {GraphQLClientResponse} from "graphql-request/build/esm/types";

//graphql-request requestMiddleware type
export const requestMiddleware: RequestMiddleware = (request) => {
    const {token} = keycloak;
    return {
        ...request,
        headers: {
            ...request.headers,
            ...(token ? {authorization: `Bearer ${token}`} : {}),
        } as any,
    };
}

export const responseMiddleware: ResponseMiddleware = (res: GraphQLClientResponse<unknown> | Error) => {
    if(res instanceof Error) {
        handleResponseError(res);
    }
}

const handleResponseError = (error: Error) => {
    const { message } = error;
    console.error(message)
    alertToast('에러가 발생했습니다');
}