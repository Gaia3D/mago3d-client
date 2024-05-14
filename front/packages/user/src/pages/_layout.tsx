import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { AppLoader } from "@mnd/shared";
import ReactDOM from "react-dom";

const Layout = () => {
  return (
    <Outlet />
  );
};

export default Layout;
