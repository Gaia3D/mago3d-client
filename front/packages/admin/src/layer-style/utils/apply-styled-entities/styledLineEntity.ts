import * as Cesium from "cesium";
import {EditableStyleModel} from "@src/layer-style/models/EditableStyleModel";
import {getFinalAttributeColor} from "./getFinalAttributeColor";
import {DEFAULT_STYLE} from "@src/layer-style/constants/defaultStyle";
import {styledLabelGraphics} from "@src/layer-style/utils/apply-styled-entities/styledLabelGraphics";
import {getCameraDistanceFromScale} from "@src/layer-style/utils/getCameraDistanceFromScale";

export const styledLineEntity = (
  entity: Cesium.Entity,
  style: EditableStyleModel,
  now: Cesium.JulianDate,
  isAttribute = false
): Cesium.Entity.ConstructorOptions | null => {
  const {context} = style;
  const hierarchy = entity.polygon?.hierarchy?.getValue(now);
  if (!hierarchy?.positions?.length) return null;

  const positions = [...hierarchy.positions];
  if (!Cesium.Cartesian3.equals(positions[0], positions[positions.length - 1])) {
    positions.push(positions[0]);
  }

  const color = isAttribute
    ? getFinalAttributeColor(entity, context.attribute, context.comparisonType, context.rules)
    : Cesium.Color.fromCssColorString(context.strokeColor ?? DEFAULT_STYLE.strokeColor)
      .withAlpha(context.strokeOpacity ?? DEFAULT_STYLE.strokeOpacity);

  const label = styledLabelGraphics(context, entity);

  const minDistance = getCameraDistanceFromScale(context.minScale);
  const maxDistance = getCameraDistanceFromScale(context.maxScale);

  return {
    position: entity.position as Cesium.PositionProperty,
    polyline: new Cesium.PolylineGraphics({
      positions,
      width: context.strokeWidth,
      material: color,
      clampToGround: true,
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(minDistance, maxDistance),
    }),
    label
  };
};
