import { QueryClient } from '@tanstack/react-query';
import { GraphQLClient, RequestDocument } from 'graphql-request';
import { requestMiddleware, responseMiddleware } from './middleware';
import { Query } from "@mnd/shared/src/types/layerset/gql/graphql";

export const getClient = (() => {
    let client: QueryClient | null = null;
    return () => {
        if (!client) client = new QueryClient({
            defaultOptions: {
                queries: {
                    refetchOnMount: true,
                    refetchOnWindowFocus: false,
                }
            },
        },);
        return client;
    }
})();

const layersetGraphqlClient = new GraphQLClient(import.meta.env.VITE_GRAPHQL_LAYERSET_URL+'/graphql', {
    requestMiddleware,
    responseMiddleware,
    errorPolicy: 'all'
});

export const layersetGraphqlFetcher = async <T>(query: RequestDocument, variables = {}) => {
    return layersetGraphqlClient
        .request<T>(query, variables)
};

const bbsGraphqlClient = new GraphQLClient(import.meta.env.VITE_GRAPHQL_BBS_URL, {
    requestMiddleware,
    responseMiddleware,
    errorPolicy: 'all'
});

export const bbsGraphqlFetcher = async <T>(query: RequestDocument, variables = {}) => {
    return bbsGraphqlClient
        .request<T>(query, variables)
};

const searchGraphqlClient = new GraphQLClient(import.meta.env.VITE_GRAPHQL_SEARCH_URL, {
    requestMiddleware,
    responseMiddleware,
    errorPolicy: 'all'
});

export const searchGraphqlFetcher = async <T>(query: RequestDocument, variables = {}) => {
    return searchGraphqlClient
        .request<T>(query, variables)
};

const timeseriesGraphqlClient = new GraphQLClient(import.meta.env.VITE_GRAPHQL_TIME_SERIES_URL, {
    requestMiddleware,
    responseMiddleware,
    errorPolicy: 'all'
});

export const timeseriesGraphqlFetcher = async <T>(query: RequestDocument, variables = {}) => {
    return timeseriesGraphqlClient
        .request<T>(query, variables)
};