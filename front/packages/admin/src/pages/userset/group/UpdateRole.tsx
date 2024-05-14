import { Suspense } from "react";
import { AppLoader } from "@mnd/shared";
import {UpdateRole} from "@src/components/userset/group";

export function GroupUpdateRole() {
    return (
        <Suspense fallback={<AppLoader/>}>
            <UpdateRole />
        </Suspense>
    )
}

