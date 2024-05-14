import { Suspense } from "react";
import { AppLoader } from "@mnd/shared";
import UpdateDataGroupData from "../../../components/layerset/group/UpdateLayer";

export function UpdateLayerGroupData() {
    return (
        <Suspense fallback={<AppLoader/>}>
            <UpdateDataGroupData />
        </Suspense>
    )
}
