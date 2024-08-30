import {Suspense} from "react";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {QueryClientProvider} from '@tanstack/react-query';
import {ReactQueryDevtools} from '@tanstack/react-query-devtools'
import {useSetRecoilState} from "recoil";
import {ReactKeycloakProvider} from '@react-keycloak/web';
import {getQueryClient} from "./api/QueryClient";
import {AppLoader, AuthClientEvent} from "@mnd/shared";
import {routes} from "./routes";
import {authenticateState} from "./recoils/Auth";
import keycloak from "./api/Keycloak";
import KeycloakAdminClientProvider from "./provider/KeycloakAdminClientProvider";
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {ApolloProvider} from "@apollo/client";
import apolloClient from "./api/ApolloClients";

function App() {
  const router = createBrowserRouter(routes, {
    basename: '/admin',
  })
  const setAuth = useSetRecoilState(authenticateState);
  const queryClient = getQueryClient();

  const onReady = () => {
    setAuth(keycloak.authenticated ?? false);
  }

  const authEventHandler = (event: AuthClientEvent, /*error: AuthClientError | undefined*/) => {
    if (event === 'onReady') onReady();
    if (event === 'onAuthSuccess') onReady();
  };

  return (
    <>
      <ReactKeycloakProvider
        authClient={keycloak}
        onEvent={authEventHandler}
        /* onTokens={tokenChangeHandler} */
        initOptions={{
          onLoad: 'login-required',
          responseMode: 'query',
          silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html'
        }}
        LoadingComponent={<AppLoader/>}
      >
        <Suspense fallback={<AppLoader/>}>
          <QueryClientProvider client={queryClient}>
            <ApolloProvider client={apolloClient}>
            <KeycloakAdminClientProvider>
              <RouterProvider router={router}/>
              <ReactQueryDevtools initialIsOpen={false} styleNonce="background-color:rgb(177, 177, 177)"/>
            </KeycloakAdminClientProvider>
            </ApolloProvider>
          </QueryClientProvider>
        </Suspense>
      </ReactKeycloakProvider>
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        theme={'light'}
        pauseOnFocusLoss
        draggable
        pauseOnHover/>
    </>
  )
}

export default App
