import { Suspense } from "react";
import { AppLoader } from "@mnd/shared";
import {List} from "@src/components/userset/user";

export function UserList() {
    return (
        <Suspense fallback={<AppLoader/>}>
            <List />
        </Suspense>
    )
}
