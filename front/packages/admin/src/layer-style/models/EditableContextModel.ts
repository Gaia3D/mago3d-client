import {LineStyle, RasterStyleInput, ShapeType} from "@mnd/shared/src/types/layerset/gql/graphql";

export type EditableContextModel = {
  type: LayerType;
  name: string;
  backgroundId: string;

  // 공통 스타일 속성
  minScale: number;
  maxScale?: number | undefined;
  fillColor: string;
  fillOpacity: number;
  strokeColor: string;
  strokeOpacity: number;
  strokeWidth: number;

  // point 전용
  size: number;

  // Attribute 스타일용
  attribute: string;
  attributeType: AttributeType;
  rules: EditableRuleStyle[];
  comparisonType: ComparisonType;

  // 라벨 관련
  isLabel: boolean;
  labelAttribute: string;
  labelFillColor: string;
  labelFillOpacity: number;
  labelFontSize: number;

  // 아이콘 관련
  isIcon: boolean;
  iconSymbolId?: string;
  iconScale?: number;

  // 패턴 관련
  isShape: boolean;
  strokeDasharray: LineStyle;
  shape: ShapeType;

  // 헬로
  isHalo: boolean;
  haloFillColor: string;
  haloFillOpacity: number;

  // 임시 사용 속성
  visible: boolean;
  iconImage: string;

  // 레스터
  raster: RasterStyleInput
};


export type EditableRuleStyle = {
  alias: string;
  eq?: string | undefined;
  ge?: string | undefined;
  gt?: string | undefined;
  le?: string | undefined;
  lt?: string | undefined;
  attributeColor: string;
  attributeOpacity: number;
}

export enum LayerType {
  POINT = "POINT",
  LINE = "LINE",
  POLYGON = "POLYGON",
  ATTRIBUTE = "ATTRIBUTE",
  RASTER = "RASTER",
}

export enum AttributeType {
  POINT = "POINT",
  LINE = "LINE",
  POLYGON = "POLYGON",
}

export enum ComparisonType {
  EQ = "EQ",
  GE_LT = "GE_LT",
  GT_LE = "GT_LE",
}
