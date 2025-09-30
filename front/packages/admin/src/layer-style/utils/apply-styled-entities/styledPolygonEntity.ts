import * as Cesium from "cesium";
import {EditableStyleModel} from "@src/layer-style/models/EditableStyleModel";
import {getFinalAttributeColor} from "./getFinalAttributeColor";
import {DEFAULT_STYLE} from "@src/layer-style/constants/defaultStyle";
import {styledLabelGraphics} from "@src/layer-style/utils/apply-styled-entities/styledLabelGraphics";
import {getCameraDistanceFromScale} from "@src/layer-style/utils/getCameraDistanceFromScale";

export const styledPolygonEntity = (
  entity: Cesium.Entity,
  style: EditableStyleModel,
  now: Cesium.JulianDate,
  isAttribute = false,
): Cesium.Entity.ConstructorOptions | null => {
  const { context } = style;
  let hierarchy = entity.polygon?.hierarchy?.getValue(now);

  // polygon이 없을 경우 polyline → polygon 시도
  if (!hierarchy?.positions?.length) {
    const linePositions = entity.polyline?.positions?.getValue(now);
    if (linePositions?.length > 2) {
      const closed = Cesium.Cartesian3.equals(linePositions[0], linePositions[linePositions.length - 1]);
      const looped = closed ? [...linePositions] : [...linePositions, linePositions[0]];
      hierarchy = new Cesium.PolygonHierarchy(looped);
    }
  }

  if (!hierarchy?.positions?.length) return null;

  const color = isAttribute
    ? getFinalAttributeColor(entity, context.attribute, context.comparisonType, context.rules)
    : Cesium.Color.fromCssColorString(context.fillColor ?? DEFAULT_STYLE.fillColor)
      .withAlpha(context.fillOpacity ?? DEFAULT_STYLE.fillOpacity);

  const outlineColor = Cesium.Color.fromCssColorString(context.strokeColor ?? DEFAULT_STYLE.strokeColor)
    .withAlpha(context.strokeOpacity ?? DEFAULT_STYLE.strokeOpacity);

  const label = styledLabelGraphics(context, entity);

  const minDistance = getCameraDistanceFromScale(context.minScale);
  const maxDistance = getCameraDistanceFromScale(context.maxScale);

  return {
    position: entity.position as Cesium.PositionProperty,
    polyline: new Cesium.PolylineGraphics({
      positions: [...hierarchy.positions],
      width: context.strokeWidth,
      material: outlineColor,
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(minDistance, maxDistance),
    }),
    polygon: new Cesium.PolygonGraphics({
      hierarchy,
      material: color,
      outline: false,
      height: 0,
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(minDistance, maxDistance),
    }),
    label
  };
};
