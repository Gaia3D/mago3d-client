import {
  LayerStyle,
  UpdateStyleInput,
  StyleType,
  Maybe,
  Scalars, RuleStyleInput
} from "@mnd/shared/src/types/layerset/gql/graphql";

type contextType = Maybe<Scalars['JSON']['output']>;

const extractCommonVectorStyle = (ctx: contextType) => ({
  maxScale: ctx.maxScale,
  minScale: ctx.minScale,
  strokeColor: ctx.strokeColor,
  strokeOpacity: ctx.strokeOpacity,
  strokeWidth: ctx.strokeWidth,
  labelStyle: ctx.labelStyle,
});

const createPointStyle = (ctx: contextType) => ({
  ...extractCommonVectorStyle(ctx),
  fillColor: ctx.fillColor,
  fillOpacity: ctx.fillOpacity,
  iconStyle: ctx.iconStyle,
  rotation: ctx.rotation,
  shape: ctx.shape,
  size: ctx.size,
});

const createLineStyle = (ctx: contextType) => ({
  ...extractCommonVectorStyle(ctx),
  graphicFillStyle: ctx.graphicFillStyle,
  graphicStrokeStyle: ctx.graphicStrokeStyle,
});

const createPolygonStyle = (ctx: contextType) => ({
  ...extractCommonVectorStyle(ctx),
  fillColor: ctx.fillColor,
  fillOpacity: ctx.fillOpacity,
  fillGraphic: ctx.fillGraphic,
  graphicFillStyle: ctx.graphicFillStyle,
  graphicStrokeStyle: ctx.graphicStrokeStyle,
});

const createRasterStyle = (ctx: contextType) => ({
  channels: ctx.channels,
  entries: ctx.entries,
  gamma: ctx.gamma,
  maxScale: ctx.maxScale,
  minScale: ctx.minScale,
  mode: ctx.mode,
  opacity: ctx.opacity,
  type: ctx.type,
});

const applyAttributeRules = (ctx: contextType) => {
  return ctx.rules.map((rule: RuleStyleInput) => {
    const clonedRule = { ...rule, style: { ...rule.style } };

    if (ctx.innerType === StyleType.Point) {
      clonedRule.style = {
        point: {
          ...createPointStyle(ctx),
          fillColor: clonedRule.style.polygon.fillColor
        }
      };
    } else if (ctx.innerType === StyleType.Line) {
      clonedRule.style = {
        line: createLineStyle(ctx),
      };
    } else if (ctx.innerType === StyleType.Polygon) {
      clonedRule.style = {
        polygon: {
          ...createPolygonStyle(ctx),
          fillColor: clonedRule.style.polygon.fillColor
        }
      };
    }

    return clonedRule;
  });
};

export const mapToUpdateStyleInput = (
  layerStyle: LayerStyle,
  type: StyleType
): UpdateStyleInput => {
  const ctx = layerStyle.context;
  const context: Maybe<Scalars['JSON']['output']> = {};

  if (type === "ATTRIBUTE") {
    context.attribute = {
      attribute: ctx.attribute,
      name: ctx.attributeName,
      rules: applyAttributeRules(ctx),
    };
  } else {
    if (type === StyleType.Point) context.point = createPointStyle(ctx);
    else if (type === StyleType.Line) context.line = createLineStyle(ctx);
    else if (type === StyleType.Polygon) context.polygon = createPolygonStyle(ctx);
    else if (type === StyleType.Raster) context.raster = createRasterStyle(ctx);
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
