import {Suspense} from "react";
import LayerPublish3dTile from "./LayerPublish3dTile";
import LayerPublishCog from "./LayerPublishCog";
import LayerPublishShp from "./LayerPublishShp";
import {AssetType, DatasetAssetForLayerDocument} from "@src/generated/gql/dataset/graphql";
import {LayersetGroupListDocument} from "@src/generated/gql/layerset/graphql";
import {useSuspenseQuery} from "@apollo/client";
import LayerPublishCoverage from "./LayerPublishCoverage";

const PublishIndex = ({id}: { id: string }) => {
  // 데이터 Asset 조회
  const {data:dataAsset} = useSuspenseQuery(DatasetAssetForLayerDocument, {
    variables: {
      id
    }
  });

  // 레이어 그룹 조회
  const {data: groups} = useSuspenseQuery(LayersetGroupListDocument);

  let publishComponent = null;

  const {asset} = dataAsset;

  if (asset.assetType === AssetType.Shp || asset.assetType === AssetType.GeoJson) {
    publishComponent = <LayerPublishShp dataAsset={dataAsset} groupsQuery={groups}/>
  } else if (asset.assetType === AssetType.Tiles3D) {
    publishComponent = <LayerPublish3dTile dataAsset={dataAsset} groupsQuery={groups}/>
  } else if (asset.assetType === AssetType.Cog) {
    publishComponent = <LayerPublishCog dataAsset={dataAsset} groupsQuery={groups}/>
  } else if (asset.assetType === AssetType.Imagery) {
    publishComponent = <LayerPublishCoverage dataAsset={dataAsset} groupsQuery={groups}/>
  }
  return (
    <Suspense>
      {publishComponent}
    </Suspense>
  )
}

export default PublishIndex;
