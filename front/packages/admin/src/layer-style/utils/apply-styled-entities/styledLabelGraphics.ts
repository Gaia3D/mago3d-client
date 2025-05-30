import * as Cesium from "cesium";
import {EditableContextModel} from "@src/layer-style/models/EditableContextModel";
import {getCameraDistanceFromScale} from "@src/layer-style/utils/getCameraDistanceFromScale";

export const styledLabelGraphics = (
  context: EditableContextModel,
  entity: Cesium.Entity,
): Cesium.LabelGraphics | undefined => {

  if (!context.isLabel) return undefined;

  const raw = entity.properties?.[context.labelAttribute];
  const rawValue = raw?._value ?? raw;
  const labelText = rawValue != null ? String(rawValue) : "속성 없음";

  const iconSize = 10;
  const yOffset = context.isIcon
    ? iconSize * (context.iconScale ?? 1) * 1.5 + 8
    : context.strokeWidth + context.size / 2 + 8;

  const minDistance = getCameraDistanceFromScale(context.minScale);
  const maxDistance = context.maxScale ? getCameraDistanceFromScale(context.maxScale) : Number.MAX_VALUE;

  return new Cesium.LabelGraphics({
    text: new Cesium.ConstantProperty(labelText),
    font: `${context.labelFontSize}px sans-serif`,
    fillColor: Cesium.Color.fromCssColorString(context.labelFillColor),
    pixelOffset: new Cesium.Cartesian2(0, -yOffset),
    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
    disableDepthTestDistance: Number.POSITIVE_INFINITY,
    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
    show: new Cesium.ConstantProperty(true),
    outlineWidth: context.isHalo ? 10 : 0,
    outlineColor: Cesium.Color.fromCssColorString(context.haloFillColor)
      .withAlpha(context.haloFillOpacity),
    distanceDisplayCondition: new Cesium.DistanceDisplayCondition(minDistance, maxDistance),
  });
};
