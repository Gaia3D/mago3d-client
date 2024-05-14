import { Suspense } from "react";
import { AppLoader } from "@mnd/shared";
import {Create} from "@src/components/userset/user";

export function UserCreate() {
    return (
        <Suspense fallback={<AppLoader/>}>
            <Create />
        </Suspense>
    )
}
