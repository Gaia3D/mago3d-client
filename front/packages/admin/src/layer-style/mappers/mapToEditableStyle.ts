import {
  EditableRuleStyle,
  EditableStyleModel,
  LayerType,
  AttributeType, ComparisonType,
} from "@src/layer-style/models/EditableStyleModel";
import {Maybe, RuleInput, Scalars} from "@mnd/shared/src/types/layerset/gql/graphql";
import { DEFAULT_STYLE } from "@src/layer-style/constants/defaultStyle";

// 병합 유틸
const merge = <T extends object>(defaults: T, overrides?: Partial<T>): T => ({
  ...defaults,
  ...(overrides || {}),
});

// @type 값을 기반으로 attributeType 결정
const resolveAttributeTypeFromAtType = (atType?: string): AttributeType => {
  switch (atType) {
    case "PointStyle":
      return AttributeType.POINT;
    case "LineStyle":
      return AttributeType.LINE;
    case "PolygonStyle":
      return AttributeType.POLYGON;
    default:
      return AttributeType.POINT;
  }
};

const resolveComparisonTypeFromRule = (rule?: RuleInput): ComparisonType => {
  if (rule?.eq !== undefined) return ComparisonType.EQ;
  if (rule?.gt !== undefined || rule?.le !== undefined) return ComparisonType.GT_LE;
  if (rule?.ge !== undefined || rule?.lt !== undefined) return ComparisonType.GE_LT;
  return ComparisonType.EQ; // fallback
};

export const mapToEditableStyle = (
  style: Maybe<Scalars["JSON"]["output"]>
): EditableStyleModel => {
  const type = (style?.type ?? LayerType.POINT);
  const rawContext = style?.context ?? {};
  const rule0 = rawContext?.rules?.[0]?.style ?? {};

  const context = merge(rule0, rawContext);

  const label = merge(context.labelStyle ?? {}, rule0.labelStyle ?? {});
  const icon = merge(context.iconStyle ?? {}, rule0.iconStyle ?? {});
  const halo = merge(label.halo ?? {}, rule0.labelStyle?.halo ?? {});

  const rules: EditableRuleStyle[] = (rawContext.rules ?? []).map(
    (r: Maybe<Scalars["JSON"]["output"]>): EditableRuleStyle => {
      const rType = resolveAttributeTypeFromAtType(r.style["@type"]);
      const isLine = rType === AttributeType.LINE;

      const ruleInput = r.rule ?? {};
      return {
        alias: r.alias ?? "",
        eq: ruleInput.eq,
        ge: ruleInput.ge,
        gt: ruleInput.gt,
        le: ruleInput.le,
        lt: ruleInput.lt,
        attributeColor: (isLine ? r.style?.strokeColor : r.style?.fillColor) ?? DEFAULT_STYLE.fillColor,
        attributeOpacity: (isLine ? r.style?.strokeOpacity : r.style?.fillOpacity) ?? DEFAULT_STYLE.fillOpacity,
      };
    }
  );

  const resolvedAttrType = resolveAttributeTypeFromAtType(rule0?.["@type"]);

  const resolvedComparisonType = resolveComparisonTypeFromRule(rule0)

  return {
    type,
    ...merge(DEFAULT_STYLE, {
      name: style?.name,
      minScale: context.minScale,
      maxScale: context.maxScale,
      fillColor: context.fillColor,
      fillOpacity: context.fillOpacity,
      strokeColor: context.strokeColor,
      strokeOpacity: context.strokeOpacity,
      strokeWidth: context.strokeWidth,
      size: context.size,
      attribute: context.attribute,
      attributeType: resolvedAttrType,
      comparisonType: resolvedComparisonType,
      rules,
      isLabel: !!(context.labelStyle || rule0.labelStyle),
      labelAttributeName: label.attributeName,
      labelFillColor: label.fillColor,
      labelFillOpacity: label.fillOpacity,
      labelFontSize: label.fontSize,
      isIcon: !!(context.iconStyle || rule0.iconStyle),
      iconSymbolId: icon.symbolId,
      iconScale: icon.scale,
      isHalo: !!(label.halo ?? rule0.labelStyle?.halo),
      haloFillColor: halo.fillColor,
      haloFillOpacity: halo.fillOpacity,
    }),
  };
};
