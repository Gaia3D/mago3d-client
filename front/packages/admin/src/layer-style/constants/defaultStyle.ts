import {AttributeType, ComparisonType, EditableContextModel} from "@src/layer-style/models/EditableContextModel";
import {ColorMapType, LineStyle, ShapeType} from "@mnd/shared/src/types/layerset/gql/graphql";

export const DEFAULT_STYLE: Omit<EditableContextModel, "type"> = {
  name: "",
  backgroundId: "",
  minScale: 0,
  maxScale: undefined,
  fillColor: "#000000",
  fillOpacity: 1,
  strokeColor: "#000000",
  strokeOpacity: 1,
  strokeWidth: 1,
  size: 10,
  isLabel: false,
  attribute: "",
  attributeType: AttributeType.POINT,
  comparisonType: ComparisonType.EQ,
  rules: [],
  labelAttribute: "",
  labelFillColor: "#000000",
  labelFillOpacity: 1,
  labelFontSize: 12,
  isIcon: false,
  iconSymbolId: "",
  iconScale: 1,
  isHalo: false,
  haloFillColor: "#000000",
  haloFillOpacity: 1,

  isShape: false,
  shape: ShapeType.NormalX,
  strokeDasharray: LineStyle.Solid,

  // 임시 사용 속성
  visible: true,
  iconImage: "",
  raster: {
    entries: [
      {
        color: "#000000",
        entryOpacity: 1,
        bandValue: 0,
        textLabel: "Min"
      },
      {
        color: "#ffffff",
        entryOpacity: 1,
        bandValue: 10,
        textLabel: "Max"
      }
    ],
    type: ColorMapType.Ramp,
    opacity: 1.0,
    minScale: 0,
    maxScale: undefined,
    gamma: 1.0,
  }
};