import {QueryClient} from '@tanstack/react-query';
import {GraphQLClient, RequestDocument} from 'graphql-request';
import {requestMiddleware, responseMiddleware} from './middleware';

export const getQueryClient = (() => {
  let client: QueryClient;
  return () => {
    client ??= new QueryClient({
      defaultOptions: {
        queries: {
          throwOnError: false,
          refetchOnMount: true,
          refetchOnWindowFocus: false,
        }
      },
    });
    console.log('getQueryClient', client)
    return client;
  };
})();

export const layersetClient = new GraphQLClient(import.meta.env.VITE_API_LAYERSET + '/graphql', {
  requestMiddleware,
  responseMiddleware,
  errorPolicy: 'all'
});

export const layersetFetcher = async (query: RequestDocument, variables = {}) => {
  return layersetClient
    .request(query, variables)
};

export const bbsGraphqlClient = new GraphQLClient(import.meta.env.VITE_API_BBS + '/graphql', {
  requestMiddleware,
  responseMiddleware,
  // errorPolicy: 'all'
});
