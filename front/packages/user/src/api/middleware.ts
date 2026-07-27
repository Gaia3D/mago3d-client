import { RequestMiddleware, ResponseMiddleware } from "graphql-request";
import { alertToast } from "@mnd/shared/src/utils/toast";
import keycloak from "./keycloak";
import { GraphQLClientResponse } from "node_modules/graphql-request/build/esm/types";

//graphql-request requestMiddleware type
export const requestMiddleware: RequestMiddleware = (request) => {
    const {token} = keycloak;
    return {
        ...request,
        headers: {
            ...request.headers,
            ...(token ? {Authorization: `Bearer ${token}`} : {}),
        },
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