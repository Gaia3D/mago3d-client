import { Suspense } from "react";
import { AppLoader } from "@mnd/shared";
import PublishIndex from "../../../components/layerset/publish/PublishIndex";
import { useParams } from "react-router-dom";

export function LayerPublish() {
    const {id} = useParams();
    return (
        <Suspense fallback={<AppLoader/>}>
            <PublishIndex id={id} />
        </Suspense>
    )
}
