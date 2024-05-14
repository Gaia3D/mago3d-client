import { Suspense } from "react";
import { AppLoader } from "@mnd/shared";
import UpdateDataGroupData from "../../../components/dataset/group/UpdateData";

export function UpdateGroupData() {
    return (
        <Suspense fallback={<AppLoader/>}>
            <UpdateDataGroupData />
        </Suspense>
    )
}
