import * as Cesium from "cesium";
import {LayerStyle, StyleType} from "@mnd/shared/src/types/layerset/gql/graphql";
import {
  createLabelGraphics
} from "@src/components/refactor-layer-style/preview-panel/applyStyledEntities/createLabelGraphics";

export const createStyledEntity = (
  entity: Cesium.Entity,
  style: LayerStyle,
  now: Cesium.JulianDate,
  finalFillColor: string
): Cesium.Entity.ConstructorOptions | null => {

  // const { context, type } = mapStyleToCompleteStyleType(style);
  const { context, type } = style;

  const label = createLabelGraphics(context?.point, entity, now);

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
        label
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
        label
      };
    }
  }

  if (type === StyleType.Line && entity.polygon?.hierarchy) {
    const line = context.line;
    const hierarchy = entity.polygon.hierarchy.getValue(now);
    const strokeColor = Cesium.Color.fromCssColorString(line.strokeColor)
      .withAlpha(line.strokeOpacity);
    if (!hierarchy?.positions?.length) return null;

    const positions = [...hierarchy.positions];
    if (!Cesium.Cartesian3.equals(positions[0], positions[positions.length - 1])) {
      positions.push(positions[0]);
    }

    return {
      polyline: new Cesium.PolylineGraphics({
        positions,
        width: line.strokeWidth,
        material: strokeColor,
        // material:
        //   context.strokeType === "dash"
        //     ? new Cesium.PolylineDashMaterialProperty({ color: strokeColor })
        //     : strokeColor,
        clampToGround: true,
      }),
    };
  }

  return null;
}