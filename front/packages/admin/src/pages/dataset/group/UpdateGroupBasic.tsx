import { Suspense } from "react";
import { AppLoader } from "@mnd/shared";
import UpdateBasic from "../../../components/dataset/group/UpdateBasic";

export function UpdateGroupBasic() {
    return (
        <Suspense fallback={<AppLoader/>}>
            <UpdateBasic />
        </Suspense>
    )
}
