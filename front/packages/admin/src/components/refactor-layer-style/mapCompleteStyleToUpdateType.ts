import {
  CompleteRuleStyleContextValue,
  CompleteStyleType
} from './mapStyleToCompleteStyleType';
import {
  UpdateStyleInput,
  StyleContextValue,
  StyleType,
  RuleStyleContextValue, IconStyleInput,
} from "@mnd/shared/src/types/layerset/gql/graphql";
import {toast} from "react-toastify";

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

  const filterRuleStyle = (style: CompleteRuleStyleContextValue): RuleStyleContextValue => {
    const typeValue = style?.['@type'];

    switch (typeValue) {
      case 'PointStyle':
        return { point: style.point };
      case 'LineStyle':
        return { line: style.line };
      case 'PolygonStyle':
        return { polygon: style.polygon };
      default:
        return {}; // fallback
    }
  };

  const filteredContext: StyleContextValue = (() => {
    switch (type) {
      case StyleType.Point: {
        const iconStyle = context.point?.iconStyle;
        if (!iconStyle || !iconStyle.symbolId) {
          throw toast.warning("아이콘을 선택해주세요.");
        }

        if (!iconStyle) {
          return {
            point: {
              ...context.point,
              iconStyle: undefined,
            },
          };
        }

        const { images, ...iconStyleWithoutImages } = iconStyle as CompleteIconStyleType;

        return {
          point: {
            ...context.point,
            iconStyle: iconStyleWithoutImages,
          },
        };
      }
      case StyleType.Line:
        return { line: context.line };
      case StyleType.Polygon:
        return { polygon: context.polygon };
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
