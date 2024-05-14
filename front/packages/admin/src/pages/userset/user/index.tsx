import {Outlet} from "react-router-dom";
import UserSidebar from "@src/layout/sidebar/user/UserSidebar";

export function UserIndex() {
  return (
    <main>
      <UserSidebar/>
      <Outlet/>
    </main>
  )
}

export * from './Create';
export * from './List';
export * from './Update';
