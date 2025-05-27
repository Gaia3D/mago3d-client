import {AttributeType, CompleteRuleStyleContextValue, CompleteStyleType} from './mapStyleToCompleteStyleType';
import {
  IconStyleInput,
  LabelStyleInput,
  RuleStyleContextValue,
  StyleContextValue,
  StyleType,
  UpdateStyleInput,
} from "@mnd/shared/src/types/layerset/gql/graphql";

export type CompleteIconStyleType = IconStyleInput & {
  images?: string[];
};

export const mapCompleteStyleToUpdateType = (
  complete: CompleteStyleType
): UpdateStyleInput => {

  const {
    access,
    backgroundId,
    defaultStatus,
    description,
    enabled,
    format,
    name,
    context,
    type,
  } = complete;

  const sanitizeIconStyle = (iconStyle?: IconStyleInput): IconStyleInput | undefined => {
    if (!iconStyle?.symbolId) return undefined;
    const { images, ...iconStyleWithoutImages } = iconStyle as CompleteIconStyleType;
    return iconStyleWithoutImages;
  };

  const sanitizeLabelStyle = (labelStyle?: LabelStyleInput): typeof labelStyle | undefined => {
    if (!labelStyle?.attributeName?.trim()) return undefined;
    return labelStyle;
  };

  const filterRuleStyle = (style: CompleteRuleStyleContextValue): RuleStyleContextValue => {
    const typeValue = style?.["@type"];

    const baseStyle = {
      point: style?.point
        ? {
          ...style.point,
          iconStyle: sanitizeIconStyle(style.point.iconStyle),
          labelStyle: sanitizeLabelStyle(style.point.labelStyle),
        }
        : undefined,
      line: style?.line
        ? {
          ...style.line,
          labelStyle: sanitizeLabelStyle(style.line.labelStyle),
        }
        : undefined,
      polygon: style?.polygon
        ? {
          ...style.polygon,
          labelStyle: sanitizeLabelStyle(style.polygon.labelStyle),
        }
        : undefined,
    };

    switch (typeValue) {
      case AttributeType.PointStyle:
        return { point: baseStyle.point };
      case AttributeType.LineStyle:
        return { line: baseStyle.line };
      case AttributeType.PolygonStyle:
        return { polygon: baseStyle.polygon };
      default:
        return {};
    }
  };

  const filteredContext: StyleContextValue = (() => {
    const cleanPoint = context.point
      ? {
        ...context.point,
        iconStyle: sanitizeIconStyle(context.point.iconStyle),
        labelStyle: sanitizeLabelStyle(context.point.labelStyle),
      }
      : undefined;

    const cleanLine = context.line
      ? {
        ...context.line,
        labelStyle: sanitizeLabelStyle(context.line.labelStyle),
      }
      : undefined;

    const cleanPolygon = context.polygon
      ? {
        ...context.polygon,
        labelStyle: sanitizeLabelStyle(context.polygon.labelStyle),
      }
      : undefined;

    switch (type) {
      case StyleType.Point:
        return { point: cleanPoint };
      case StyleType.Line:
        return { line: cleanLine };
      case StyleType.Polygon:
        return { polygon: cleanPolygon };
      case StyleType.Attribute:
        return {
          attribute: {
            attribute: context.attribute?.attribute ?? '',
            name: context.attribute?.name,
            rules: context.attribute?.rules?.map(rule => ({
              alias: rule?.alias,
              rule: rule.rule,
              style: filterRuleStyle(rule.style as CompleteRuleStyleContextValue),
            })),
          },
        };
      case StyleType.Raster:
        return { raster: context.raster };
      default:
        return {};
    }
  })();

  return {
    access,
    backgroundId,
    defaultStatus,
    description,
    enabled,
    format,
    name,
    context: filteredContext,
  };
};
