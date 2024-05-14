import { Suspense } from "react";
import { AppLoader } from "@mnd/shared";
import List from "../../../components/layerset/map/MapList";

export function MapList() {
    return (
        <Suspense fallback={<AppLoader/>}>
            <List />
        </Suspense>
    )
}
