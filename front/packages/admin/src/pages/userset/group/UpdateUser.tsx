import { Suspense } from "react";
import { AppLoader } from "@mnd/shared";
import {UpdateUser} from "@src/components/userset/group";

export function GroupUpdateUser() {
    return (
        <Suspense fallback={<AppLoader/>}>
            <UpdateUser />
        </Suspense>
    )
}

