import {
  AttributeType,
  ComparisonType,
  EditableContextModel,
  EditableRuleStyle,
  LayerType,
} from "@src/layer-style/models/EditableContextModel";
import {
  AttributeStyleInput,
  RuleStyleInput,
  StyleContextValue,
} from "@mnd/shared/src/types/layerset/gql/graphql";
import { buildPointStyle, buildLineStyle, buildPolygonStyle } from "@src/layer-style/mappers/mapToStyleInput";
import {mapToRasterContext} from "@src/layer-style/mappers/mapToRasterContext";

export const mapToRequestContext = (editable: EditableContextModel): StyleContextValue => {
  if (editable.type === LayerType.POINT) {
    return {point: buildPointStyle(editable)};
  } else if (editable.type === LayerType.LINE) {
      return { line: buildLineStyle(editable) };
  } else if (editable.type === LayerType.POLYGON) {
      return { polygon: buildPolygonStyle(editable) };
  } else if (editable.type === LayerType.ATTRIBUTE) {
    const rules: RuleStyleInput[] = editable.rules?.map((rule: EditableRuleStyle ) => {
      const isLine = editable.attributeType === AttributeType.LINE;
      const comparisonType = editable.comparisonType;

      const style: EditableContextModel = {
        ...editable,
        fillColor: isLine ? editable.fillColor : rule.attributeColor,
        fillOpacity: isLine ? editable.fillOpacity : rule.attributeOpacity,
        strokeColor: isLine ? rule.attributeColor : editable.strokeColor,
        strokeOpacity: isLine ? rule.attributeOpacity : editable.strokeOpacity,
        type: editable.attributeType as unknown as LayerType,
      };

      const ruleCondition = {
        ...(comparisonType === ComparisonType.EQ && { eq: rule.eq }),
        ...(comparisonType === ComparisonType.GT_LE && { gt: rule.gt, le: rule.le }),
        ...(comparisonType === ComparisonType.GE_LT && { ge: rule.ge, lt: rule.lt }),
      };

      return {
        alias: rule.alias,
        rule: ruleCondition,
        style: mapToRuleStyleContext(style),
      };
    }) ?? [];

    const attribute: AttributeStyleInput = {
      attribute: editable.attribute,
      name: editable.name,
      rules,
    };

    return {
      attribute,
    };
  } else if (editable.type === LayerType.RASTER) {
    return mapToRasterContext(editable);
  }
};

const mapToRuleStyleContext = (style: EditableContextModel) => {
  const raw = {
    point: style.type === LayerType.POINT || style.type === LayerType.ATTRIBUTE
      ? buildPointStyle(style)
      : undefined,
    line: style.type === LayerType.LINE
      ? buildLineStyle(style)
      : undefined,
    polygon: style.type === LayerType.POLYGON
      ? buildPolygonStyle(style)
      : undefined,
  };

  return Object.fromEntries(
    Object.entries(raw).filter(([, v]) => v !== undefined)
  );
};
