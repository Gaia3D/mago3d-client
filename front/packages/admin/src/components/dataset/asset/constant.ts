import {AssetType, ProcessTaskStatus} from "@src/generated/gql/dataset/graphql";

export const asset3dTypeOptions = [
  {value: AssetType.Terrain, label: 'Terrain'},
  {value: AssetType.Tiles3D, label: 'Tiles3D'},
  {value: AssetType.Czml, label: 'Czml'},
];

export const assetRasterTypeOptions = [
  {value: AssetType.Imagery, label: 'Imagery'},
  {value: AssetType.Cog, label: 'COG'},
];

export const assetVectorTypeOptions = [
  {value: AssetType.GeoJson, label: 'GeoJson'},
  {value: AssetType.Kml, label: 'Kml'},
  {value: AssetType.Shp, label: 'Shp'},
];

export const assetTypeOptions = [
  {value: AssetType.Terrain, label: 'Terrain'},
  {value: AssetType.Tiles3D, label: 'Tiles3D'},
  {value: AssetType.Czml, label: 'Czml'},
  {value: AssetType.Imagery, label: 'Imagery'},
  {value: AssetType.Cog, label: 'Cog'},
  {value: AssetType.GeoJson, label: 'GeoJson'},
  {value: AssetType.Kml, label: 'Kml'},
  {value: AssetType.Shp, label: 'Shp'},
];

export const heightReferenceOptions = [
  {value: 'none', label: '기본'},
  {value: 'clamp', label: 'clamp'},
  {value: 'relative', label: 'relative'},
];

export enum ProcessRequestStatus {
  Ready = 'Ready',
  Processing = 'Processing',
  Complete = 'Complete',
  Error = 'Error',
}

export const processTaskStatusOptions: Record<ProcessTaskStatus, string> = {
  [ProcessTaskStatus.None]: 'None',
  [ProcessTaskStatus.Ready]: 'Ready',
  [ProcessTaskStatus.Running]: 'Running',
  [ProcessTaskStatus.Terminating]: 'Terminating',
  [ProcessTaskStatus.Terminated]: 'Terminated',
  [ProcessTaskStatus.Done]: 'Done',
  [ProcessTaskStatus.Error]: 'Error',
};
