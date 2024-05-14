import { Outlet } from "react-router-dom";
import UserSidebar from "@src/layout/sidebar/user/UserSidebar";

export function GroupIndex() {
    return (
        <main>
            <UserSidebar />
			<Outlet/>
		</main>
    )
}

export * from './List'
export * from './UpdateBasic'
export * from './UpdateIndex'
export * from './UpdateRole'
export * from './UpdateUser'

