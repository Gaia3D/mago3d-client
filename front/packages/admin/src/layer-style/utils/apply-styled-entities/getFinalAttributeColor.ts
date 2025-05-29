import * as Cesium from "cesium";
import {ComparisonType, EditableRuleStyle} from "@src/layer-style/models/EditableContextModel";
import {DEFAULT_STYLE} from "@src/layer-style/constants/defaultStyle";

export const getFinalAttributeColor = (
  entity: Cesium.Entity,
  attribute: string,
  comparisonType: ComparisonType,
  rules: EditableRuleStyle[],
): Cesium.Color => {
  const raw = entity.properties?.[attribute];
  const rawValue = typeof raw?._value !== "undefined" ? raw._value : raw;

  const matchedRule = rules.find(rule => {
    switch (comparisonType) {
      case ComparisonType.EQ:
        return rule.eq === rawValue;
      case ComparisonType.GE_LT:
        return parseFloat(rule.ge ?? "-Infinity") <= rawValue && rawValue < parseFloat(rule.lt ?? "Infinity");
      case ComparisonType.GT_LE:
        return parseFloat(rule.gt ?? "-Infinity") < rawValue && rawValue <= parseFloat(rule.le ?? "Infinity");
      default:
        return false;
    }
  });

  if (matchedRule) {
    return Cesium.Color.fromCssColorString(matchedRule.attributeColor)
      .withAlpha(matchedRule.attributeOpacity ?? 1);
  }

  return Cesium.Color.fromCssColorString(DEFAULT_STYLE.fillColor).withAlpha(DEFAULT_STYLE.fillOpacity);
};
