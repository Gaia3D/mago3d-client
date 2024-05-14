import {ErrorInfo, Suspense} from 'react';
import {Outlet} from 'react-router-dom';
import {AppLoader, IUserInfo} from '@mnd/shared';
import {useChangeUserProfileEvent} from '../hooks/UserInfo';
import {NotAuthorizedError} from '../api/Error/NotAuthorizedError';
import {QueryErrorResetBoundary} from "@tanstack/react-query";
import {ErrorBoundary} from "react-error-boundary";
import ErrorFallback from "../ErrorFallback";
import {Nav} from "./Nav";

export const RootLayout = () => {
  useChangeUserProfileEvent((contents: IUserInfo) => {
    if (!contents.isAdmin) {
      throw new NotAuthorizedError();
    }
  });

  const logError = (error: Error, info: ErrorInfo) => {
    console.error(error, info);
  };

  return (
    // <QueryErrorResetBoundary>
    //   {({reset}) => (
    //     <ErrorBoundary FallbackComponent={ErrorFallback} onReset={reset} onError={logError}>
          <Suspense fallback={<AppLoader/>}>
            <Nav/>
            <Outlet/>
          </Suspense>
    //     </ErrorBoundary>
    //   )}
    // </QueryErrorResetBoundary>
  )
}
