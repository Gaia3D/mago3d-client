import { StyleContextType } from "@src/types/StyleContext";
import {
  LineStyleInput,
  PointStyleInput,
  PolygonStyleInput,
  AttributeStyleInput,
  RasterStyleInput
} from "@mnd/shared/src/types/layerset/gql/graphql";

// undefined 필드 제거 후 반환
const cleanObject = <T extends object>(obj: T): Partial<T> =>
  Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => value !== undefined)
  ) as Partial<T>;

export const mapContextToPointStyleInput = (context: StyleContextType): PointStyleInput =>
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

export const mapContextToLineStyleInput = (context: StyleContextType): LineStyleInput =>
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

export const mapContextToPolygonStyleInput = (context: StyleContextType): PolygonStyleInput =>
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

export const mapContextToAttributeStyleInput = (
  context: StyleContextType
): AttributeStyleInput => {
  const { attribute, name, rules } = context;

  if (!attribute) {
    throw new Error("attribute 값은 필수입니다.");
  }

  return {
    attribute,
    ...(name !== undefined && { name }),
    ...(rules !== undefined && { rules }),
  };
};

export const mapContextToRasterStyleInput = (context: StyleContextType): RasterStyleInput =>
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
