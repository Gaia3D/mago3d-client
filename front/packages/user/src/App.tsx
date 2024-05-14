import {QueryClientProvider} from "@tanstack/react-query";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {routes} from "./Routes";
import {getClient} from "./api/queryClient";
import LoadingSpinner from "./components/Spinner";
import "react-toastify/dist/ReactToastify.css";
import {ReactKeycloakProvider} from "@react-keycloak/web";
import {AppLoader, AuthClientEvent} from "@mnd/shared";
import {useSetRecoilState} from "recoil";
import {authenticateState} from "./recoils/Auth";
import keycloak from "./api/keycloak";
import {Suspense} from "react";
import UserInfoLoadableProvider from "@/components/providers/UserInfoLoadableProvider.tsx";

function App() {
  const router = createBrowserRouter(routes)
  const setAuth = useSetRecoilState(authenticateState);
  const queryClient = getClient();

  const onReady =() => {
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
            LoadingComponent={<AppLoader />}
        >
            <Suspense fallback={<AppLoader />}>
                <QueryClientProvider client={queryClient}>
                  <UserInfoLoadableProvider>
                    <RouterProvider router={router} />
                    <LoadingSpinner />
                  </UserInfoLoadableProvider>
                </QueryClientProvider>
            </Suspense>
        </ReactKeycloakProvider>  
    </>
  );
}

export default App;
