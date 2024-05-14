import {Suspense} from "react";
import {AppLoader} from "@mnd/shared";
import List from "../../../components/dataset/asset/List";

export function DataList() {
    return (
        <Suspense fallback={<AppLoader/>}>
            <List />
        </Suspense>
    )
}
