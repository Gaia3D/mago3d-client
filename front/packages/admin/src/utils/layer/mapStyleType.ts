import {Maybe, Scalars, StyleType} from "@mnd/shared/src/types/layerset/gql/graphql";
import {StyleContextType} from "@src/types/StyleContext";

export const mapStyleToContext = (
  style: Maybe<Scalars["JSON"]["output"] & { type?: StyleType }>
): StyleContextType => {
  console.log("style", style);
  if (!style || !style.type) {
    throw new Error("스타일이 없거나 타입이 지정되지 않았습니다.");
  }
  switch (style.type) {
    case StyleType.Point:
      return mapPointStyleToContext(style.context);
    case StyleType.Line:
      return mapLineStyleToContext(style.context);
    case StyleType.Polygon:
      return mapPolygonStyleToContext(style.context);
    case StyleType.Attribute:
      return mapAttributeStyleToContext(style.context);
    case StyleType.Raster:
      return mapRasterStyleToContext(style.context);
    default:
      throw new Error(`알 수 없는 스타일 타입입니다: ${style.type}`);
  }
};

// undefined 필드 제거 후 반환
const cleanObject = <T extends object>(obj: T): Partial<T> =>
  Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => value !== undefined)
  ) as Partial<T>;

export const mapPointStyleToContext = (context: Maybe<Scalars['JSON']['output']>): StyleContextType =>
  cleanObject({
    fillColor: context.fillColor,
    fillOpacity: context.fillOpacity,
    iconStyle: context.iconStyle,
    labelStyle: context.labelStyle,
    maxScale: context.maxScale,
    minScale: context.minScale,
    rotation: context.rotation,
    shape: context.shape,
    size: context.size,
    strokeColor: context.strokeColor,
    strokeDasharray: context.strokeDasharray,
    strokeDashoffset: context.strokeDashoffset,
    strokeLinecap: context.strokeLinecap,
    strokeLinejoin: context.strokeLinejoin,
    strokeOpacity: context.strokeOpacity,
    strokeWidth: context.strokeWidth,
  });

export const mapLineStyleToContext = (context: Maybe<Scalars['JSON']['output']>): StyleContextType =>
  cleanObject({
    graphicFillStyle: context.graphicFillStyle,
    graphicStrokeStyle: context.graphicStrokeStyle,
    labelStyle: context.labelStyle,
    maxScale: context.maxScale,
    minScale: context.minScale,
    strokeColor: context.strokeColor,
    strokeDasharray: context.strokeDasharray,
    strokeDashoffset: context.strokeDashoffset,
    strokeLinecap: context.strokeLinecap,
    strokeLinejoin: context.strokeLinejoin,
    strokeOpacity: context.strokeOpacity,
    strokeWidth: context.strokeWidth,
  });

export const mapPolygonStyleToContext = (context: Maybe<Scalars['JSON']['output']>): StyleContextType =>
  cleanObject({
    fillColor: context.fillColor,
    fillGraphic: context.fillGraphic,
    fillOpacity: context.fillOpacity,
    graphicFillStyle: context.graphicFillStyle,
    graphicStrokeStyle: context.graphicStrokeStyle,
    labelStyle: context.labelStyle,
    maxScale: context.maxScale,
    minScale: context.minScale,
    strokeColor: context.strokeColor,
    strokeDasharray: context.strokeDasharray,
    strokeDashoffset: context.strokeDashoffset,
    strokeLinecap: context.strokeLinecap,
    strokeLinejoin: context.strokeLinejoin,
    strokeOpacity: context.strokeOpacity,
    strokeWidth: context.strokeWidth,
  });

export const mapAttributeStyleToContext = (context: Maybe<Scalars['JSON']['output']>): StyleContextType => {
  const { attribute, name, rules } = context;

  if (!attribute) {
    throw new Error("attribute 값은 필수입니다.");
  }

  return {
    attribute,
    ...(name !== undefined && { name }),
    ...(rules !== undefined && { rules }),
  }
};

export const mapRasterStyleToContext = (context: Maybe<Scalars['JSON']['output']>): StyleContextType =>
  cleanObject({
    channels: context.channels,
    entries: context.entries,
    gamma: context.gamma,
    maxScale: context.maxScale,
    minScale: context.minScale,
    mode: context.mode,
    opacity: context.opacity,
    type: context.type,
  });
