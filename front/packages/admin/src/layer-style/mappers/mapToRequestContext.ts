import {
  EditableContextModel,
  EditableRuleStyle,
  LayerType, AttributeType,
} from "@src/layer-style/models/EditableContextModel";
import {
  StyleContextValue,
  PointStyleInput,
  LineStyleInput,
  PolygonStyleInput,
  AttributeStyleInput,
  RuleStyleInput,
  RuleStyleContextValue,
} from "@mnd/shared/src/types/layerset/gql/graphql";

export const mapToRequestContext = (editable: EditableContextModel): StyleContextValue => {

  const buildLabel = () => {
    if (!editable.isLabel) return undefined;
    return {
      attributeName: editable.labelAttributeName,
      fillColor: editable.labelFillColor,
      fillOpacity: editable.labelFillOpacity,
      fontSize: editable.labelFontSize,
      halo: editable.isHalo
        ? {
          fillColor: editable.haloFillColor,
          fillOpacity: editable.haloFillOpacity,
        }
        : undefined,
    };
  };

  const buildIcon = () => {
    if (!editable.isIcon) return undefined;
    return {
      scale: editable.iconScale,
      symbolId: editable.iconSymbolId,
    };
  };

  if (editable.type === LayerType.POINT) {
    const point: PointStyleInput = {
      fillColor: editable.fillColor,
      fillOpacity: editable.fillOpacity,
      strokeColor: editable.strokeColor,
      strokeOpacity: editable.strokeOpacity,
      strokeWidth: editable.strokeWidth,
      size: editable.size,
      labelStyle: buildLabel(),
      iconStyle: buildIcon(),
    };

    return {
      point,
    };
  } else if (editable.type === LayerType.LINE) {
    const line: LineStyleInput = {
      strokeColor: editable.strokeColor,
      strokeOpacity: editable.strokeOpacity,
      strokeWidth: editable.strokeWidth,
      labelStyle: buildLabel(),
    };

    return {
      line,
    };
  } else if (editable.type === LayerType.POLYGON) {
    const polygon: PolygonStyleInput = {
      fillColor: editable.fillColor,
      fillOpacity: editable.fillOpacity,
      strokeColor: editable.strokeColor,
      strokeOpacity: editable.strokeOpacity,
      strokeWidth: editable.strokeWidth,
      labelStyle: buildLabel(),
    };

    return {
      polygon,
    };
  } else if (editable.type === LayerType.ATTRIBUTE) {
    const rules: RuleStyleInput[] = editable.rules?.map((rule: EditableRuleStyle ) => {
      const isLine = editable.attributeType === AttributeType.LINE;
      const style: EditableContextModel = {
        ...editable,
        fillColor: isLine ? editable.fillColor : rule.attributeColor,
        fillOpacity: isLine ? editable.fillOpacity : rule.attributeOpacity,
        strokeColor: isLine ? rule.attributeColor : editable.strokeColor,
        strokeOpacity: isLine ? rule.attributeOpacity : editable.strokeOpacity,
        type: editable.attributeType as unknown as LayerType,
      };
      return {
        alias: rule.alias,
        rule: {
          eq: rule.eq,
          ge: rule.ge,
          gt: rule.gt,
          le: rule.le,
          lt: rule.lt,
        },
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
  }

  return {};
};

const mapToRuleStyleContext = (style: EditableContextModel): RuleStyleContextValue => {
  const buildLabel = () => {
    if (!style.isLabel) return undefined;
    return {
      attributeName: style.labelAttributeName,
      fillColor: style.labelFillColor,
      fillOpacity: style.labelFillOpacity,
      fontSize: style.labelFontSize,
      halo: style.isHalo
        ? {
          fillColor: style.haloFillColor,
          fillOpacity: style.haloFillOpacity,
        }
        : undefined,
    };
  };

  const buildIcon = () => {
    if (!style.isIcon) return undefined;
    return {
      scale: style.iconScale,
      symbolId: style.iconSymbolId,
    };
  };

  const raw: RuleStyleContextValue = {
    point:
      style.type === LayerType.POINT || style.type === LayerType.ATTRIBUTE
        ? {
          fillColor: style.fillColor,
          fillOpacity: style.fillOpacity,
          strokeColor: style.strokeColor,
          strokeOpacity: style.strokeOpacity,
          strokeWidth: style.strokeWidth,
          size: style.size,
          labelStyle: buildLabel(),
          iconStyle: buildIcon(),
        }
        : undefined,
    line:
      style.type === LayerType.LINE
        ? {
          strokeColor: style.strokeColor,
          strokeOpacity: style.strokeOpacity,
          strokeWidth: style.strokeWidth,
          labelStyle: buildLabel(),
        }
        : undefined,
    polygon:
      style.type === LayerType.POLYGON
        ? {
          fillColor: style.fillColor,
          fillOpacity: style.fillOpacity,
          strokeColor: style.strokeColor,
          strokeOpacity: style.strokeOpacity,
          strokeWidth: style.strokeWidth,
          labelStyle: buildLabel(),
        }
        : undefined,
  };

  // undefined 필드 제거
  return Object.fromEntries(
    Object.entries(raw).filter(([, v]) => v !== undefined)
  ) as RuleStyleContextValue;
};