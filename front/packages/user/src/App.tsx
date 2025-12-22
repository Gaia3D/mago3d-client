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

function App() {
  const router = createBrowserRouter(routes, {
    basename: '/user',
  })
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
