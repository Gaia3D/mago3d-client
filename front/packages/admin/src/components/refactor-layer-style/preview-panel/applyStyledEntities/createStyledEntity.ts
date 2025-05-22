import * as Cesium from "cesium";
import {LayerStyle, StyleType} from "@mnd/shared/src/types/layerset/gql/graphql";

export const createStyledEntity = (
  entity: Cesium.Entity,
  style: LayerStyle,
  now: Cesium.JulianDate,
  finalFillColor: string
): Cesium.Entity.ConstructorOptions | null => {


  const { context, type } = style;

  if (type === StyleType.Point && entity.position) {
    const point = context.point;
    const strokeColor = Cesium.Color.fromCssColorString(point.strokeColor)
      .withAlpha(point.strokeOpacity);

    const fillColor = Cesium.Color.fromCssColorString(point.fillColor)
      .withAlpha(point.fillOpacity);

    if (!point.iconStyle || !point.iconStyle?.symbolId) {
      return {
        position: entity.position,
        point: new Cesium.PointGraphics({
          pixelSize: point.size,
          color: fillColor,
          outlineColor: strokeColor,
          outlineWidth: point.strokeWidth,
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        }),
        // ...label,
      };

  }else {
      return {
        position: entity.position,
        billboard: new Cesium.BillboardGraphics({
          image: point.iconStyle.images[0],
          scale: point.iconStyle.scale,
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
        }),
        // ...label,
      };
    }
  }

  return null;
}