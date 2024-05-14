import { Suspense } from "react";
import { AppLoader } from "@mnd/shared";
import List from "../../../components/dataset/group/List";

export function GroupList() {
    return (
        <Suspense fallback={<AppLoader/>}>
            <List />
        </Suspense>
    )
}
