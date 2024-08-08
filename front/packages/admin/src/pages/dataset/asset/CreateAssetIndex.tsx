import {Outlet} from "react-router-dom"
import DataCreateTab from "../../../layout/sidebar/dataset/DataCreateTab";
import {useSuspenseQuery} from "@apollo/client";
import {DatasetGroupListDocument} from "@src/generated/gql/dataset/graphql";
import {CreateAssetOutletContext} from "@src/components/dataset/asset/AssetOutletContext";
import {useTranslation} from "react-i18next";


export const CreateAssetIndex = () => {
    const {t} = useTranslation();
    const {data} = useSuspenseQuery(DatasetGroupListDocument);

  const context: CreateAssetOutletContext = {
    data
  };

  return (
    <div className="contents">
      <h2>{t("upload-data")}</h2>
      <DataCreateTab/>
      <Outlet context={context}/>
    </div>
  )
}
