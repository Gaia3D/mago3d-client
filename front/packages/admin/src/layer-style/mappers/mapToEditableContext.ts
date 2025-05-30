import {
  EditableRuleStyle,
  EditableContextModel,
  LayerType,
  AttributeType,
  ComparisonType,
} from "@src/layer-style/models/EditableContextModel";
import { Maybe, RuleInput, Scalars } from "@mnd/shared/src/types/layerset/gql/graphql";
import { DEFAULT_STYLE } from "@src/layer-style/constants/defaultStyle";

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
  return ComparisonType.EQ;
};

export const mapToEditableContext = (
  style: Maybe<Scalars["JSON"]["output"]>
): EditableContextModel => {
  const type = style?.type ?? LayerType.POINT;
  const rawContext = style?.context ?? {};
  const rule0 = rawContext?.rules?.[0]?.style ?? {};

  const label = {
    ...(rule0.labelStyle ?? {}),
    ...(rawContext.labelStyle ?? {}),
  };

  const icon = {
    ...(rule0.iconStyle ?? {}),
    ...(rawContext.iconStyle ?? {}),
  };

  const halo = {
    ...(rule0.labelStyle?.halo ?? {}),
    ...(rawContext.labelStyle?.halo ?? {}),
  };

  const finalContext = {
    ...(rawContext),
    ...(rule0)
  };

  const rules: EditableRuleStyle[] = (rawContext.rules ?? []).map((r: Maybe<Scalars["JSON"]["output"]>) => {
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
  });

  const resolvedAttrType = resolveAttributeTypeFromAtType(rule0?.["@type"]);
  const resolvedComparisonType = resolveComparisonTypeFromRule(rule0);


  return {
    type,
    name: style?.name ?? DEFAULT_STYLE.name,
    backgroundId: style?.backgroundId ?? DEFAULT_STYLE.backgroundId,
    minScale: finalContext.minScale ?? DEFAULT_STYLE.minScale,
    maxScale: finalContext.maxScale,
    fillColor: finalContext.fillColor ?? DEFAULT_STYLE.fillColor,
    fillOpacity: finalContext.fillOpacity ?? DEFAULT_STYLE.fillOpacity,
    strokeColor: finalContext.strokeColor ?? DEFAULT_STYLE.strokeColor,
    strokeOpacity: finalContext.strokeOpacity ?? DEFAULT_STYLE.strokeOpacity,
    strokeWidth: finalContext.strokeWidth ?? DEFAULT_STYLE.strokeWidth,
    size: finalContext.size ?? DEFAULT_STYLE.size,
    attribute: finalContext.attribute ?? DEFAULT_STYLE.attribute,
    attributeType: resolvedAttrType,
    comparisonType: resolvedComparisonType,
    rules,
    isLabel: !!(finalContext.labelStyle || rule0.labelStyle),
    labelAttributeName: label.attributeName ?? DEFAULT_STYLE.labelAttributeName,
    labelFillColor: label.fillColor ?? DEFAULT_STYLE.labelFillColor,
    labelFillOpacity: label.fillOpacity ?? DEFAULT_STYLE.labelFillOpacity,
    labelFontSize: label.fontSize ?? DEFAULT_STYLE.labelFontSize,
    isIcon: !!(finalContext.iconStyle || rule0.iconStyle),
    iconSymbolId: icon.symbolId ?? DEFAULT_STYLE.iconSymbolId,
    iconScale: icon.scale ?? DEFAULT_STYLE.iconScale,
    isHalo: !!(label.halo ?? rule0.labelStyle?.halo),
    haloFillColor: halo.fillColor ?? DEFAULT_STYLE.haloFillColor,
    haloFillOpacity: halo.haloFillOpacity ?? DEFAULT_STYLE.haloFillOpacity,

    // 임시 사용 속성
    visible: true,
    iconImage: "",
  };
};
