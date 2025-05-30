import * as Cesium from "cesium";
import {EditableStyleModel} from "@src/layer-style/models/EditableStyleModel";
import {DEFAULT_STYLE} from "@src/layer-style/constants/defaultStyle";
import {getFinalAttributeColor} from "@src/layer-style/utils/apply-styled-entities/getFinalAttributeColor";
import {styledLabelGraphics} from "@src/layer-style/utils/apply-styled-entities/styledLabelGraphics";
import {getCameraDistanceFromScale} from "@src/layer-style/utils/getCameraDistanceFromScale";

export const styledPointEntity = (
  entity: Cesium.Entity,
  style: EditableStyleModel,
  isAttribute = false,
): Cesium.Entity.ConstructorOptions => {
  const {context} = style;

  const fillColor = isAttribute
    ? getFinalAttributeColor(entity, context.attribute, context.comparisonType, context.rules)
    : Cesium.Color.fromCssColorString(context.fillColor ?? DEFAULT_STYLE.fillColor)
      .withAlpha(context.fillOpacity ?? DEFAULT_STYLE.fillOpacity);

  const outlineColor = Cesium.Color.fromCssColorString(context.strokeColor ?? DEFAULT_STYLE.strokeColor)
    .withAlpha(context.strokeOpacity ?? DEFAULT_STYLE.strokeOpacity);

  const label = styledLabelGraphics(context, entity);

  const minDistance = getCameraDistanceFromScale(context.minScale);
  const maxDistance = getCameraDistanceFromScale(context.maxScale);

  if (context.isIcon) {
    return {
      position: entity.position as Cesium.PositionProperty,
      billboard: new Cesium.BillboardGraphics({
        image: context.iconImage,
        scale: context.iconScale,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(minDistance, maxDistance),
      }),
      label
    };
  }

  return {
    position: entity.position as Cesium.PositionProperty,
    point: new Cesium.PointGraphics({
      pixelSize: context.size,
      color: fillColor,
      outlineColor,
      outlineWidth: context.strokeWidth,
      heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(minDistance, maxDistance),
    }),
    label
  };
};
