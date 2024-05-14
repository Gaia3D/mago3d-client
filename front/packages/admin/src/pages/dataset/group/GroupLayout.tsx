import {Outlet} from "react-router-dom";
import DataSidebar from "../../../layout/sidebar/dataset/DataSideBar";
import {AppLoader} from "@mnd/shared";
import {Suspense} from "react";

export function GroupLayout() {
  return (
    <main>
      <DataSidebar/>
      <Suspense fallback={<AppLoader/>}>
        <Outlet/>
      </Suspense>
    </main>
  )
}
