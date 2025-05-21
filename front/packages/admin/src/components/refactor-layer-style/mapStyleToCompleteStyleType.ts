import {
  LayerStyle,
  UpdateStyleInput,
  StyleContextValue,
  PointStyleInput,
  LineStyleInput,
  PolygonStyleInput,
  AttributeStyleInput,
  RasterStyleInput, StyleType, RuleStyleContextValue, Maybe, Scalars,
} from "@mnd/shared/src/types/layerset/gql/graphql";

const DEFAULT_STYLE_CONTEXT = {
  fillColor: '#000000',
  fillOpacity: 1,
  strokeColor: '#000000',
  strokeOpacity: 1,
  strokeWidth: 1,
  opacity: 1,
};

// undefined 필드 제거 유틸
const clean = <T extends object>(obj: T): Partial<T> =>
  Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== undefined)) as Partial<T>;

export type CompleteStyleType = UpdateStyleInput & {
  id: string;
  type: StyleType;
};

export const mapStyleToCompleteStyleType = (style: LayerStyle): CompleteStyleType => {
  const { id, type, access, backgroundId, defaultStatus, description, enabled, format, name, context } = style;

  const styleContext: StyleContextValue = {
    point: clean({
      fillColor: context?.fillColor ?? DEFAULT_STYLE_CONTEXT.fillColor,
      fillOpacity: context?.fillOpacity ?? DEFAULT_STYLE_CONTEXT.fillOpacity,
      iconStyle: context?.iconStyle,
      labelStyle: context?.labelStyle,
      maxScale: context?.maxScale,
      minScale: context?.minScale,
      rotation: context?.rotation,
      shape: context?.shape,
      size: context?.size,
      strokeColor: context?.strokeColor ?? DEFAULT_STYLE_CONTEXT.strokeColor,
      strokeDasharray: context?.strokeDasharray,
      strokeDashoffset: context?.strokeDashoffset,
      strokeLinecap: context?.strokeLinecap,
      strokeLinejoin: context?.strokeLinejoin,
      strokeOpacity: context?.strokeOpacity ?? DEFAULT_STYLE_CONTEXT.strokeOpacity,
      strokeWidth: context?.strokeWidth ?? DEFAULT_STYLE_CONTEXT.strokeWidth,
    }) as PointStyleInput,

    line: clean({
      graphicFillStyle: context?.graphicFillStyle,
      graphicStrokeStyle: context?.graphicStrokeStyle,
      labelStyle: context?.labelStyle,
      maxScale: context?.maxScale,
      minScale: context?.minScale,
      strokeColor: context?.strokeColor ?? DEFAULT_STYLE_CONTEXT.strokeColor,
      strokeDasharray: context?.strokeDasharray,
      strokeDashoffset: context?.strokeDashoffset,
      strokeLinecap: context?.strokeLinecap,
      strokeLinejoin: context?.strokeLinejoin,
      strokeOpacity: context?.strokeOpacity ?? DEFAULT_STYLE_CONTEXT.strokeOpacity,
      strokeWidth: context?.strokeWidth ?? DEFAULT_STYLE_CONTEXT.strokeWidth,
    }) as LineStyleInput,

    polygon: clean({
      fillColor: context?.fillColor ?? DEFAULT_STYLE_CONTEXT.fillColor,
      fillGraphic: context?.fillGraphic,
      fillOpacity: context?.fillOpacity ?? DEFAULT_STYLE_CONTEXT.fillOpacity,
      graphicFillStyle: context?.graphicFillStyle,
      graphicStrokeStyle: context?.graphicStrokeStyle,
      labelStyle: context?.labelStyle,
      maxScale: context?.maxScale,
      minScale: context?.minScale,
      strokeColor: context?.strokeColor ?? DEFAULT_STYLE_CONTEXT.strokeColor,
      strokeDasharray: context?.strokeDasharray,
      strokeDashoffset: context?.strokeDashoffset,
      strokeLinecap: context?.strokeLinecap,
      strokeLinejoin: context?.strokeLinejoin,
      strokeOpacity: context?.strokeOpacity ?? DEFAULT_STYLE_CONTEXT.strokeOpacity,
      strokeWidth: context?.strokeWidth ?? DEFAULT_STYLE_CONTEXT.strokeWidth,
    }) as PolygonStyleInput,

    attribute: clean({
      attribute: context?.attribute,
      name: context?.name,
      rules: context.rules?.map(rule => ({
        alias: rule?.alias,
        rule: rule!.rule,
        style: normalizeRuleStyleContext(rule!.style),
      })),
    }) as AttributeStyleInput,

    raster: clean({
      channels: context?.channels,
      entries: context?.entries,
      gamma: context?.gamma,
      maxScale: context?.maxScale,
      minScale: context?.minScale,
      mode: context?.mode,
      opacity: context?.opacity ?? DEFAULT_STYLE_CONTEXT.opacity,
      type: context?.type,
    }) as RasterStyleInput,
  };

  return {
    id,
    type,
    access,
    backgroundId,
    defaultStatus,
    description,
    enabled,
    format,
    name,
    context: styleContext,
  };
};

export type CompleteRuleStyleContextValue = RuleStyleContextValue & {
  '@type': 'PointStyle' | 'LineStyle' | 'PolygonStyle';
};

const normalizeRuleStyleContext = (rawStyle: Maybe<Scalars['JSON']['output']>): CompleteRuleStyleContextValue  => {
  const type = rawStyle?.['@type'] || 'PointStyle';

  return {
    '@type': type,
    point: clean({
      fillColor: rawStyle?.fillColor ?? DEFAULT_STYLE_CONTEXT.fillColor,
      fillOpacity: rawStyle?.fillOpacity ?? DEFAULT_STYLE_CONTEXT.fillOpacity,
      strokeColor: rawStyle?.strokeColor ?? DEFAULT_STYLE_CONTEXT.strokeColor,
      strokeOpacity: rawStyle?.strokeOpacity ?? DEFAULT_STYLE_CONTEXT.strokeOpacity,
      strokeWidth: rawStyle?.strokeWidth ?? DEFAULT_STYLE_CONTEXT.strokeWidth,
      size: rawStyle?.size,
      shape: rawStyle?.shape,
      rotation: rawStyle?.rotation,
    }),
    line: clean({
      strokeColor: rawStyle?.strokeColor ?? DEFAULT_STYLE_CONTEXT.strokeColor,
      strokeOpacity: rawStyle?.strokeOpacity ?? DEFAULT_STYLE_CONTEXT.strokeOpacity,
      strokeWidth: rawStyle?.strokeWidth ?? DEFAULT_STYLE_CONTEXT.strokeWidth,
    }),
    polygon: clean({
      fillColor: rawStyle?.fillColor ?? DEFAULT_STYLE_CONTEXT.fillColor,
      fillOpacity: rawStyle?.fillOpacity ?? DEFAULT_STYLE_CONTEXT.fillOpacity,
      strokeColor: rawStyle?.strokeColor ?? DEFAULT_STYLE_CONTEXT.strokeColor,
      strokeOpacity: rawStyle?.strokeOpacity ?? DEFAULT_STYLE_CONTEXT.strokeOpacity,
      strokeWidth: rawStyle?.strokeWidth ?? DEFAULT_STYLE_CONTEXT.strokeWidth,
    }),
  }
};