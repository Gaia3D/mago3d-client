// 기존 파일 그대로 유지
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from "@apollo/client/link/context";
import { MultiAPILink } from "@habx/apollo-multi-endpoint-link";
import keycloak from "@src/api/Keycloak";

const link = new MultiAPILink({
  endpoints: {
    bbs: import.meta.env.VITE_API_BBS,
    layerset: import.meta.env.VITE_API_LAYERSET,
    dataset: import.meta.env.VITE_API_DATASET,
    userset: import.meta.env.VITE_API_USERSET
  },
  defaultEndpoint: 'bbs',
  createHttpLink: () => createHttpLink()
});

const authLink = setContext((_, { headers }) => {
  const { token } = keycloak;
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  };
});

const apolloClient = new ApolloClient({
  link: authLink.concat(link),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    }
  }
});

export default apolloClient;
