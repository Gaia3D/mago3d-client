import {QueryClientProvider} from "@tanstack/react-query";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {routes} from "./Routes";
import {getClient} from "./api/queryClient";
import LoadingSpinner from "./components/Spinner";
import "react-toastify/dist/ReactToastify.css";
import {AppLoader} from "@mnd/shared";
import {Suspense} from "react";
import UserInfoLoadableProvider from "@/components/providers/UserInfoLoadableProvider.tsx";
import {ApolloProvider} from "@apollo/client";
import apolloClients from "@/api/ApolloClients.ts";
import {ToastContainer} from "react-toastify";

// 라우터는 모듈 스코프에서 단 한 번만 생성한다.
// (렌더 함수 안에서 만들면 App이 리렌더될 때마다 새 라우터가 생겨 라우트 트리 전체가
//  리마운트되고, 그 안의 ReactKeycloakProvider가 keycloak.init()을 재호출 →
//  정리된 URL로 login-required 재실행 → /auth 무한 리다이렉트 루프가 발생한다.)
const router = createBrowserRouter(routes, {
  basename: '/user',
})

function App() {
  const queryClient = getClient();

  return (
    <>
        <Suspense fallback={<AppLoader />}>
            <QueryClientProvider client={queryClient}>
                <ApolloProvider client={apolloClients}>
                  <UserInfoLoadableProvider>
                    <RouterProvider router={router} />
                    <LoadingSpinner />
                    <ToastContainer hideProgressBar={true} pauseOnFocusLoss={false} limit={3} autoClose={2000}  className="custom-toast-container" toastClassName="custom-toast" bodyClassName="custom-toast-body"/>
                  </UserInfoLoadableProvider>
                </ApolloProvider>
            </QueryClientProvider>
        </Suspense>
    </>
  );
}

export default App;
