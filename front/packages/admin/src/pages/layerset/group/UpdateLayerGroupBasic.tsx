import { Suspense } from "react";
import { AppLoader } from "@mnd/shared";
import UpdateBasic from "../../../components/layerset/group/UpdateBasic";

export function UpdateLayerGroupBasic() {
    return (
        <Suspense fallback={<AppLoader/>}>
            <UpdateBasic />
        </Suspense>
    )
}
