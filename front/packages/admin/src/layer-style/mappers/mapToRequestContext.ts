import {
  AttributeType,
  ComparisonType,
  EditableContextModel,
  EditableRuleStyle,
  LayerType,
} from "@src/layer-style/models/EditableContextModel";
import {
  AttributeStyleInput,
  LineStyleInput,
  PointStyleInput,
  PolygonStyleInput,
  RuleStyleContextValue,
  RuleStyleInput,
  StyleContextValue,
} from "@mnd/shared/src/types/layerset/gql/graphql";

export const mapToRequestContext = (editable: EditableContextModel): StyleContextValue => {

  const buildLabel = () => {
    if (!editable.isLabel) return undefined;
    return {
      attributeName: editable.labelAttribute,
      fillColor: editable.labelFillColor,
      fillOpacity: editable.labelFillOpacity,
      fontSize: editable.labelFontSize,
      halo: editable.isHalo
        ? {
          fillColor: editable.haloFillColor,
          fillOpacity: editable.haloFillOpacity,
          radius: 2,
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
      minScale: editable.minScale,
      maxScale: editable.maxScale,
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
      minScale: editable.minScale,
      maxScale: editable.maxScale,
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
      minScale: editable.minScale,
      maxScale: editable.maxScale,
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
    return {
      raster: {
        channels: editable.raster.channels,
        entries: editable.raster.entries,
        gamma: editable.raster.gamma,
        maxScale: editable.raster.maxScale,
        minScale: editable.raster.minScale,
        mode: editable.raster.mode,
        opacity: editable.raster.opacity,
        type: editable.raster.type,
      },
    }
  }

  return {};
};

const mapToRuleStyleContext = (style: EditableContextModel): RuleStyleContextValue => {
  const buildLabel = () => {
    if (!style.isLabel) return undefined;
    return {
      attributeName: style.labelAttribute,
      fillColor: style.labelFillColor,
      fillOpacity: style.labelFillOpacity,
      fontSize: style.labelFontSize,
      halo: style.isHalo
        ? {
          fillColor: style.haloFillColor,
          fillOpacity: style.haloFillOpacity,
          radius: 2,
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
          minScale: style.minScale,
          maxScale: style.maxScale,
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
          minScale: style.minScale,
          maxScale: style.maxScale,
          strokeColor: style.strokeColor,
          strokeOpacity: style.strokeOpacity,
          strokeWidth: style.strokeWidth,
          labelStyle: buildLabel(),
        }
        : undefined,
    polygon:
      style.type === LayerType.POLYGON
        ? {
          minScale: style.minScale,
          maxScale: style.maxScale,
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