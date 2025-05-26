import * as Cesium from "cesium";
import {PointStyleInput} from "@mnd/shared/src/types/layerset/gql/graphql";

export const createLabelGraphics = (
  pointStyle: PointStyleInput | undefined,
  entity: Cesium.Entity,
  now: Cesium.JulianDate
): Cesium.LabelGraphics | undefined => {
  const labelStyle = pointStyle?.labelStyle;
  if (!labelStyle || !labelStyle.attributeName || !pointStyle) return;

  let yOffset = 0;
  const iconStyle = pointStyle.iconStyle;

  if (iconStyle && labelStyle) {
    const iconSize = 10;
    const scale = iconStyle.scale ?? 1;
    yOffset = iconSize * scale * 1.5 + 8;
  } else {
    yOffset = pointStyle.strokeWidth + (pointStyle.size / 2) + 8;
  }

  const labelKey = labelStyle.attributeName;
  const rawValue = entity.properties?.[labelKey]?.getValue(now);
  const halo = labelStyle.halo;
  const labelText = rawValue !== undefined && rawValue !== null
    ? String(rawValue)
    : "속성 없음";

  return new Cesium.LabelGraphics({
    text: new Cesium.ConstantProperty(labelText),
    font: `${labelStyle.fontSize}px sans-serif`,
    fillColor: Cesium.Color.fromCssColorString(labelStyle.fillColor),
    pixelOffset: new Cesium.Cartesian2(0, -yOffset),
    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
    disableDepthTestDistance: Number.POSITIVE_INFINITY,
    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
    show: new Cesium.ConstantProperty(true),
    outlineWidth: halo.fillOpacity ? 10 : 0,
    outlineColor: Cesium.Color.fromCssColorString(halo.fillColor),
  });
};
