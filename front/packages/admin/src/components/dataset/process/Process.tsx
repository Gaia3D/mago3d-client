import ProcessShp from "./ProcessShp";
import Process3dTile from "./Process3dTile";
import ProcessCog from "./ProcessCog";
import ProcessTiff from "./ProcessTiff";
import ProcessTerrain from "./ProcessTerrain";
import {AssetType, DatasetAssetForDetailQuery, Process} from "@src/generated/gql/dataset/graphql";

const ProcessComponent = (props: {
  data: DatasetAssetForDetailQuery
  process: Process
  resetProcess?: () => void
}) => {
  const {asset} = props.data;

  if (asset.assetType === AssetType.Shp || asset.assetType === AssetType.GeoJson) {
    return <ProcessShp data={props.data} process={props.process} resetProcess={props.resetProcess}/>
  } else if (asset.assetType === AssetType.Tiles3D) {
    return <Process3dTile data={props.data} process={props.process} resetProcess={props.resetProcess}/>
  } else if (asset.assetType === AssetType.Cog) {
    return <ProcessCog data={props.data} process={props.process} resetProcess={props.resetProcess}/>
  } else if (asset.assetType === AssetType.Imagery) {
    return <ProcessTiff data={props.data} process={props.process} resetProcess={props.resetProcess}/>
  } else if (asset.assetType === AssetType.Terrain) {
    return <ProcessTerrain data={props.data} process={props.process} resetProcess={props.resetProcess}/>
  } else {
    return null;
  }
}

export default ProcessComponent;
