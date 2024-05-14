import {Outlet} from "react-router-dom"
import DataCreateTab from "../../../layout/sidebar/dataset/DataCreateTab";
import {useSuspenseQuery} from "@apollo/client";
import {DatasetGroupListDocument} from "@src/generated/gql/dataset/graphql";
import {CreateAssetOutletContext} from "@src/components/dataset/asset/AssetOutletContext";


export const CreateAssetIndex = () => {
  const {data} = useSuspenseQuery(DatasetGroupListDocument);

  const context: CreateAssetOutletContext = {
    data
  };

  return (
    <div className="contents">
      <h2>데이터 업로드</h2>
      <DataCreateTab/>
      <Outlet context={context}/>
    </div>
  )
}
