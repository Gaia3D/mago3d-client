import {AttributeType, ComparisonType, EditableContextModel} from "@src/layer-style/models/EditableContextModel";

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
  labelAttributeName: "",
  labelFillColor: "#000000",
  labelFillOpacity: 1,
  labelFontSize: 12,
  isIcon: false,
  iconSymbolId: "",
  iconScale: 1,
  isHalo: false,
  haloFillColor: "#000000",
  haloFillOpacity: 1,

  // 임시 사용 속성
  visible: true,
};