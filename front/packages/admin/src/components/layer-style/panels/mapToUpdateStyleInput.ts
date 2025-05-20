import {LayerStyle, UpdateStyleInput, StyleType, Maybe, Scalars} from "@mnd/shared/src/types/layerset/gql/graphql";

const extractCommonVectorStyle = (context: Maybe<Scalars['JSON']['output']>) => ({
  maxScale: context.maxScale,
  minScale: context.minScale,
  strokeColor: context.strokeColor,
  strokeOpacity: context.strokeOpacity,
  strokeWidth: context.strokeWidth,
  labelStyle: context.labelStyle,
  // strokeDasharray: context.strokeDasharray,
  // strokeDashoffset: context.strokeDashoffset,
  // strokeLinecap: context.strokeLinecap,
  // strokeLinejoin: context.strokeLinejoin,
});

export const mapToUpdateStyleInput = (
  layerStyle: LayerStyle,
  type: StyleType
): UpdateStyleInput => {
  const ctx = layerStyle.context;

  const context: Maybe<Scalars['JSON']['output']> = {};

  if (type === "POINT") {
    context.point = {
      ...extractCommonVectorStyle(ctx),
      fillColor: ctx.fillColor,
      fillOpacity: ctx.fillOpacity,
      iconStyle: ctx.iconStyle,
      rotation: ctx.rotation,
      shape: ctx.shape,
      size: ctx.size,
    };
  }

  if (type === "LINE") {
    context.line = {
      ...extractCommonVectorStyle(ctx),
      graphicFillStyle: ctx.graphicFillStyle,
      graphicStrokeStyle: ctx.graphicStrokeStyle,
    };
  }

  if (type === "POLYGON") {
    context.polygon = {
      ...extractCommonVectorStyle(ctx),
      fillColor: ctx.fillColor,
      fillOpacity: ctx.fillOpacity,
      fillGraphic: ctx.fillGraphic,
      graphicFillStyle: ctx.graphicFillStyle,
      graphicStrokeStyle: ctx.graphicStrokeStyle,
    };
  }

  if (type === "RASTER") {
    context.raster = {
      channels: ctx.channels,
      entries: ctx.entries,
      gamma: ctx.gamma,
      maxScale: ctx.maxScale,
      minScale: ctx.minScale,
      mode: ctx.mode,
      opacity: ctx.opacity,
      type: ctx.type,
    };
  }

  if (ctx.isAttributeEnabled) {
    context.attribute = {
      attribute: ctx.attribute,
      name: ctx.attributeName,
      rules: ctx.rules,
    };
  }

  return {
    access: layerStyle.access,
    backgroundId: layerStyle.backgroundId,
    defaultStatus: layerStyle.defaultStatus,
    description: layerStyle.description,
    enabled: layerStyle.enabled,
    format: layerStyle.format,
    name: layerStyle.name,
    context,
  };
};
