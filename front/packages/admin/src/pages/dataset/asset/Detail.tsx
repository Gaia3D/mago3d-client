import { Suspense } from "react";
import { AppLoader } from "@mnd/shared";
import Detail from "../../../components/dataset/asset/Detail";
import { useParams } from "react-router-dom";

export function DatasetAssetDetail() {
    const {id} = useParams();
    return (
        <Suspense fallback={<AppLoader/>}>
            <div className="contents">
                <h2>데이터 변환</h2>
                <Detail id={id}/>
            </div>
        </Suspense>
    )
}

export default DatasetAssetDetail;