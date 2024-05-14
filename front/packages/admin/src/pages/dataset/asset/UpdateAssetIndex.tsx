import {Outlet, useParams} from "react-router-dom"
import {useSuspenseQuery} from "@apollo/client";
import {DatasetAssetForUpdateDocument} from "@src/generated/gql/dataset/graphql";
import {useNotFindId} from "@src/hooks/common";
import {AssetOutletContext} from "@src/components/dataset/asset/AssetOutletContext";

export const UpdateAssetIndex = () => {
  useNotFindId('/datagroup/list');
  // const {data, refetch} = useDataGroupsQuery({});
  const {id} = useParams();

  const {data} = useSuspenseQuery(DatasetAssetForUpdateDocument, {
    variables: {
      id
    }
  });

  const context: AssetOutletContext = {
    id,
    data
  };

  return (
    <div className="contents">
      <h2>데이터 수정</h2>
      <Outlet context={context}/>
    </div>
  )
}

