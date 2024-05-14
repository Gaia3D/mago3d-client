import { Suspense } from "react";
import { AppLoader } from "@mnd/shared";
import {List} from "@src/components/userset/group";

export function GroupList() {
    return (
        <Suspense fallback={<AppLoader/>}>
            <List />
        </Suspense>
    )
}
