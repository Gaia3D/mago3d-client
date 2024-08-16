import {ApolloClient, createHttpLink, InMemoryCache} from "@apollo/client";
import {setContext} from "@apollo/client/link/context";
import {MultiAPILink} from "@habx/apollo-multi-endpoint-link";
import keycloak from "@/api/keycloak.ts";

const link = new MultiAPILink({
    endpoints: {
        dataset: import.meta.env.VITE_APOLLO_DATASET,
        layerset: import.meta.env.VITE_APOLLO_LAYERSET,
        userset: import.meta.env.VITE_APOLLO_USERSET
    },
    defaultEndpoint: 'dataset',
    createHttpLink: () => createHttpLink()
})

const authLink = setContext((_, {headers}) => {
    const {token} = keycloak;
    // const token = localStorage.getItem('token');
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
        }
    }
});

const apolloClients = new ApolloClient({
    link: authLink.concat(link),
    cache: new InMemoryCache(),
    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'cache-and-network'
        }
    }
})

export default apolloClients;