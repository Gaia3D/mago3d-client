import * as Cesium from "cesium";
import {LayerStyle, RuleStyleInput} from "@mnd/shared/src/types/layerset/gql/graphql";

export const applyRules = (
  entity: Cesium.Entity,
  style: LayerStyle
): string => {
  const { context } = style;
  const point = context.point;
  const line = context.line;
  const polygon = context.polygon;
  const attribute = context.attribute;
  const attributeKey = context.attribute?.attribute ?? "";
  const rules = context.attribute?.rules as RuleStyleInput[] | undefined;

  const rawValue = entity.properties?.[attributeKey]?._value ?? entity.properties?.[attributeKey];

  console.log("rules", rules);
  console.log("!attributeKey", attributeKey);
  console.log("!entity.properties?.[attributeKey]", entity.properties?.[attributeKey]);
  if (!rules || !attributeKey || !entity.properties?.[attributeKey]) {
    // type: point인 경우
    return point.fillColor ?? "#ffffff";
  }

  const isEqualType = !!attribute?.rules[1]?.rule?.eq;
  const isGeLtType = !!attribute?.rules[1]?.rule?.ge;

  if (isEqualType) {
    const matched = rules.find(r => r.rule.eq === rawValue);
    return matched?.style?.point?.fillColor ?? "#ffffff";

  } else if (isGeLtType) {
    const numeric = parseFloat(rawValue);
    const matched = rules.find(r => {
      const ge = parseFloat(r.rule.ge ?? "-Infinity");
      const lt = parseFloat(r.rule.lt ?? "Infinity");
      return !isNaN(numeric) && numeric >= ge && numeric < lt;
    });
    return matched?.style?.point?.fillColor ?? "#ffffff";

  } else {
    const numeric = parseFloat(rawValue);
    const matched = rules.find(r => {
      const gt = parseFloat(r.rule.gt ?? "-Infinity");
      const le = parseFloat(r.rule.le ?? "Infinity");
      return !isNaN(numeric) && numeric > gt && numeric <= le;
    });
    return matched?.style?.point?.fillColor ?? "#ffffff";

  }
}