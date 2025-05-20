import {
  ColorMapEntry, ColorMapType, ContrastMethod,
  GraphicStyleInput,
  IconStyleInput,
  LabelStyleInput, Linecap, Linejoin, LineStyle,
  LineStyleInput, PointStyleInput, PolygonStyleInput, AttributeStyleInput, RasterStyleInput,
  RuleStyleInput, Channels
} from "@mnd/shared/src/types/layerset/gql/graphql";

export interface StyleContextType {
  maxScale?: number;                       // 최대 축적 (전체)
  minScale?: number;                       // 최소 축적 (전체)
  strokeColor?: string;                    // 선 색상 (point, line, polygon)
  strokeOpacity?: number;                  // 선 투명도 (point, line, polygon)
  strokeWidth?: number;                    // 선 너비 (point, line, polygon)
  fillColor?: string                       // 채우기 색상 (point, polygon)
  fillOpacity?: number                     // 채우기 투명도 (point, polygon)
  rotation?: number                        // 회전 (point)
  shape?: string;                          // 점 모양 (point)
  size?: number;                           // 점 크기 (point)
  strokeDasharray?: LineStyle;             // ? (point, line, polygon)
  strokeDashoffset?: number                // ? (point, line, polygon)
  strokeLinecap?: Linecap;                 // ? (point, line, polygon)
  strokeLinejoin?: Linejoin;               // ? (point, line, polygon)
  graphicFillStyle?: GraphicStyleInput;    // 그래픽 채우기 스타일 (line, polygon)
  graphicStrokeStyle?: GraphicStyleInput   // 그래픽 선 스타일 (line, polygon)
  labelStyle?: LabelStyleInput;            // 라벨 스타일 (point, line, polygon)
  fillGraphic?: GraphicStyleInput          // 그래픽 면 스타일 (polygon)
  channels?: Channels;                     // ? (raster)
  entries?: ColorMapEntry[];               // ? (raster)
  gamma?: number;                          // ? (raster
  mode?: ContrastMethod;                   // ? (raster)
  opacity?: number;                        // 래스터 색상 투명도 (raster)
  type?: ColorMapType;                     // ? (raster)
  iconStyle?: IconStyleInput;              // 아이콘 스타일 (point)
  attribute?: string;                      // 선택 속성명 (attribute)
  name?: string;                           // 선택 스타일명 (attribute)
  rules?: RuleStyleInput[];                // 속성 rule (attribute)
}

export const DEFAULT_STYLE_CONTEXT: StyleContextType = {
  // maxScale: ,
  minScale: 0,
  strokeColor: "#000000",
  strokeOpacity: 1,
  strokeWidth: 1,
  fillColor: "#000000",
  fillOpacity: 1,
  rotation: 0,
  shape: "point",
  size: 10,
  // strokeDasharray: ,
  // strokeDashoffset: ,
  // strokeLinecap: ,
  // strokeLinejoin: ,
  // graphicFillStyle: ,
  // graphicStrokeStyle: ,
  // labelStyle: ,
  // fillGraphic: ,
  // channels: ,
  // entries: ,
  // gamma: ,
  // mode: ,
  // opacity: ,
  // type: ,
  // iconStyle: ,
  // attribute: ,
  // name: ,
  // rules: ,
}

// AttributeStyleInput
// LineStyleInput
// PointStyleInput
// PolygonStyleInput
// RasterStyleInput