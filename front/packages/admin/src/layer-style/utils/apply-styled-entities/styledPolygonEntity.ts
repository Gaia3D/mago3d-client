import * as Cesium from "cesium";
import {EditableStyleModel} from "@src/layer-style/models/EditableStyleModel";
import {getFinalAttributeColor} from "./getFinalAttributeColor";
import {DEFAULT_STYLE} from "@src/layer-style/constants/defaultStyle";
import {styledLabelGraphics} from "@src/layer-style/utils/apply-styled-entities/styledLabelGraphics";

export const styledPolygonEntity = (
  entity: Cesium.Entity,
  style: EditableStyleModel,
  now: Cesium.JulianDate,
  isAttribute = false
): Cesium.Entity.ConstructorOptions | null => {
  const {context} = style;
  const hierarchy = entity.polygon?.hierarchy?.getValue(now);
  if (!hierarchy?.positions?.length) return null;

  const color = isAttribute
    ? getFinalAttributeColor(entity, context.attribute, context.comparisonType, context.rules)
    : Cesium.Color.fromCssColorString(context.fillColor ?? DEFAULT_STYLE.fillColor)
      .withAlpha(context.fillOpacity ?? DEFAULT_STYLE.fillOpacity);

  const outlineColor = Cesium.Color.fromCssColorString(context.strokeColor ?? DEFAULT_STYLE.strokeColor)
    .withAlpha(context.strokeOpacity ?? DEFAULT_STYLE.strokeOpacity);

  const label = styledLabelGraphics(context, entity);

  return {
    position: entity.position as Cesium.PositionProperty,
    polyline: new Cesium.PolylineGraphics({
      positions: [...hierarchy.positions],
      width: context.strokeWidth,
      material: outlineColor,
    }),
    polygon: new Cesium.PolygonGraphics({
      hierarchy,
      material: color,
      outline: false,
      height: 0,
    }),
    label
  };
};
