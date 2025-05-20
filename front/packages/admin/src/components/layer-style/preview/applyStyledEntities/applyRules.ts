import * as Cesium from "cesium";
import {LayerStyle, RuleStyleInput, StyleType} from "@mnd/shared/src/types/layerset/gql/graphql";

export const applyRules = (
  entity: Cesium.Entity,
  style: LayerStyle
): string => {
  const { context } = style;
  const attributeKey = context.attribute ?? "";
  const rules = context.rules as RuleStyleInput[] | undefined;

  if (!rules || !attributeKey || !entity.properties?.[attributeKey]) {
    return context.fillColor ?? "#ffffff";
  }

  const attributeText = String(entity.properties[attributeKey]);
  if (style.type === StyleType.Attribute && context.attributeType === "String") {
    const matched = rules.find(r => r.rule.eq === attributeText);
    return matched?.style?.point?.fillColor ?? context.fillColor ?? "#ffffff";
  }

  if (style.type === StyleType.Attribute && context.attributeType === "Number") {
    const numeric = parseFloat(attributeText);
    const matched = rules.find(r => {
      const ge = parseFloat(r.rule.ge ?? r.rule.gt ?? "-Infinity");
      const lt = parseFloat(r.rule.lt ?? r.rule.le ?? "Infinity");
      return !isNaN(numeric) && numeric >= ge && numeric < lt;
    });
    return matched?.style?.point?.fillColor ?? context.fillColor ?? "#ffffff";
  }

  return context.fillColor ?? "#ffffff";
};
