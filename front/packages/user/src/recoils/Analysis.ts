import { FeatureCollection } from "@turf/turf";
import { atom } from "recoil";
import * as Cesium from "cesium";

export const hasFeatureInfoState = atom<boolean>({
    key: 'hasFeatureInfoState',
    default: false
});

export type AnalysisLayer = {
    name: string;
    lowerCorner?: string;
    upperCorner?: string;
}
export const analysisLayersState = atom<AnalysisLayer[]>({
    key: 'analysisLayersState',
    default: [
        {
            name:'경사도래스터10M',
        },
        {
            name:'경사도래스터30M',
        },
        {
            name:'속도래스터',
        },
    ]
});

export type RasterProfileResult = {
    id: string;
    value: number;
    index: number;
}
export const rasterProfileResultsState = atom<RasterProfileResult[]>({
    key: 'rasterProfileResultsState',
    default: []
});

export const OpenResultState = atom<boolean>({
  key: 'OpenResultState',
  default: false
});

export type FilterLayerProps = {
  fieldName: string;
  layerName: string;
  defaultFilter: string | null;
  setFilter: React.Dispatch<React.SetStateAction<string | null>>
}

export const FilterLayerState = atom<FilterLayerProps | null>({
  key: 'FilterLayerState',
  default: null
});

export enum ResultLayerStepType {
  SIMPLIFY = 0,
  CLASSIFY = 1,
  STAGE = 2,
}

export enum ResultLayerDataType {
  Entity = 'Entity',
  Imagery = 'Imagery',
}

/* export type ValueAndColor = {
  value: string;
  color: string;
} */
export type ValueAndColor = Record<string, string>;
export type ResultStepType = {
  classify: Record<string, ValueAndColor>
  stage: Record<string, number[]>
}

export type ResultLayerType = {
  layerName: string;
  changable: boolean;
  data?: FeatureCollection;
  step?: ResultLayerStepType;
  stepResult?: ResultStepType;
  type?: ResultLayerDataType;
  isCustom: boolean;
  customFunction?: (data: FeatureCollection, dataSource:Cesium.CustomDataSource) => number;
  fillColor?: string;
  fillOpacity?: number;
  lineColor?: string;
  lineOpacity?: number;
  lineWidth?: number;
}

export const ResultLayersState = atom<Record<string, ResultLayerType>>({
  key: 'ResultLayersState',
  default: {}
});

export const StyleTypeState = atom<string>({
  key: 'StyleType',
  default: 'simple'
});

export const SelectedCategoryState = atom<string>({
  key: 'SelectedCategoryState',
  default: ''
});

export const SelectedColorLampState = atom<string>({
  key: 'SelectedColorLampState',
  default: '빨강계열 색상램프'
});

export const DefaultVegetationFeaturesLayer = '토지피복도';
export const DefaultVegetationFeaturesFilter = `l2_code IN ('210', '220', '240', '410', '420') OR l3_code IN ('252', '622', '623')`;

export const DefaultForestFeaturesLayer = '식생도';
export const DefaultForestFeaturesFilter = `dmcls_cd = '0'`;

export const DefaultSoilFeaturesLayer = '토질도';
export const DefaultSoilFeaturesFilter = `tpgrp_tpcd IN ('01', '02', '03', '04', '05')`;

export const DefaultTownFeaturesLayer = '토지피복도';
export const DefaultTownFeaturesFilter = `l2_code IN ('110', '120', '130', '160')`;

export const DefaultDrainageFeaturesLayer = '토지피복도';
export const DefaultDrainageFeaturesFilter = `l2_code = '710'`;