import { RequestMiddleware, ResponseMiddleware } from "graphql-request";
import { alertToast } from "@mnd/shared/src/utils/toast";
import keycloak from "./keycloak";
import { GraphQLClientResponse } from "node_modules/graphql-request/build/esm/types";

//graphql-request requestMiddleware type
export const requestMiddleware: RequestMiddleware = (request: RequestInit) => {
    const {token} = keycloak;
    const returnRequest = {
        url: 'https://mdtp.gaia3d.com/app/api/layerset/graphql',
        ...request,
        headers: {
            ...request.headers
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any
    }
    if(token) {
        returnRequest.headers.Authorization = `Bearer ${token}`;
    }
    
    return returnRequest;
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