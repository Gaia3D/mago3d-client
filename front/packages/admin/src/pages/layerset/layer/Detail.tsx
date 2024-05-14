import { Suspense } from "react";
import { AppLoader } from "@mnd/shared";
import LayerDetailIndex from "../../../components/layerset/layer/LayerDetailIndex";
import { useParams } from "react-router-dom";

export function LayerDetail() {
    const {id} = useParams();
    return (
        <Suspense fallback={<AppLoader/>}>
            <LayerDetailIndex id={id} />
        </Suspense>
    )
}
