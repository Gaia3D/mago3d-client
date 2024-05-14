import { Suspense } from "react";
import { AppLoader } from "@mnd/shared";
import List from "../../../components/layerset/layer/LayerList";

export function LayerList() {
    return (
        <Suspense fallback={<AppLoader/>}>
            <List />
        </Suspense>
    )
}
