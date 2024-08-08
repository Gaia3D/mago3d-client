import { Suspense } from "react";
import { AppLoader } from "@mnd/shared";
import Detail from "../../../components/dataset/asset/Detail";
import { useParams } from "react-router-dom";
import {useTranslation} from "react-i18next";

export function DatasetAssetDetail() {
    const {t} = useTranslation();
    const {id} = useParams();
    return (
        <Suspense fallback={<AppLoader/>}>
            <div className="contents">
                <h2>{t("data-transform")}</h2>
                <Detail id={id}/>
            </div>
        </Suspense>
    )
}

export default DatasetAssetDetail;