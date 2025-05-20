import * as Cesium from "cesium";
import { LayerStyle, StyleType } from "@mnd/shared/src/types/layerset/gql/graphql";
import reactSvg from "@src/assets/images/react.svg";

export const createStyledEntity = (
  entity: Cesium.Entity,
  style: LayerStyle,
  now: Cesium.JulianDate,
  finalFillColor: string
): Cesium.Entity.ConstructorOptions | null => {
  const { context, type } = style;
  const strokeColor = Cesium.Color.fromCssColorString(context.strokeColor || "#000000")
    .withAlpha(context.strokeOpacity ?? 1);
  const fillColor = Cesium.Color.fromCssColorString(finalFillColor)
    .withAlpha(context.fillOpacity ?? 1);
  const strokeWidth = context.strokeWidth ?? 1;

  const labelKey = context.labelAttribute ?? "";
  const labelText = labelKey && entity.properties?.[labelKey]
    ? String(entity.properties[labelKey])
    : "속성 없음";

  const fontSize = context.labelFontSize ?? 8;
  const fontType = context.labelFontType ?? "sans-serif";
  const size = context.size ?? 1;
  const labelFontColor = Cesium.Color.fromCssColorString(context.labelFontColor || "#000000");
  const labelBorder = context.labelBorder ?? false;
  const labelBorderColor = Cesium.Color.fromCssColorString(context.strokeBorderColor || "#ffffff");

  let labelYOffset = 0;

  if (context.pointType !== "icon") {
    labelYOffset = strokeWidth + ( size / 2 ) + 8;
  } else {
    const iconSize = 20;
    const scale = context.scale ?? 1;
    labelYOffset = iconSize * scale * 1.5 + fontSize;
  }

  const label = context.isLabelEnabled
    ? {
      label: new Cesium.LabelGraphics({
        text: labelText,
        font: `${fontSize}px ${fontType}`,
        fillColor: labelFontColor,
        outlineWidth: labelBorder ? 1.5 : 0,
        outlineColor: labelBorderColor,
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        pixelOffset: new Cesium.Cartesian2(0, -labelYOffset),
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
      }),
    }
    : {};

  if ((type === StyleType.Point || ( type === StyleType.Attribute && context.innerType === StyleType.Point)) && entity.position) {
    if (context.pointType !== "icon") {
      return {
        position: entity.position,
        point: new Cesium.PointGraphics({
          pixelSize: context.size,
          color: fillColor,
          outlineColor: strokeColor,
          outlineWidth: strokeWidth,
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        }),
        ...label,
      };
    } else {
      return {
        position: entity.position,
        billboard: new Cesium.BillboardGraphics({
          image: context.symbol ?? reactSvg,
          scale: context.scale,
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
        }),
        ...label,
      };
    }
  }

  if ((type === StyleType.Line || (type === StyleType.Attribute && context.innerType === StyleType.Line)) && entity.polygon?.hierarchy) {
    const hierarchy = entity.polygon.hierarchy.getValue(now);
    if (!hierarchy?.positions?.length) return null;

    const positions = [...hierarchy.positions];
    if (!Cesium.Cartesian3.equals(positions[0], positions[positions.length - 1])) {
      positions.push(positions[0]);
    }

    return {
      polyline: new Cesium.PolylineGraphics({
        positions,
        width: strokeWidth,
        material:
          context.strokeType === "dash"
            ? new Cesium.PolylineDashMaterialProperty({ color: strokeColor })
            : strokeColor,
        clampToGround: true,
      }),
    };
  }

  if ((type === StyleType.Polygon || (type === StyleType.Attribute && context.innerType === StyleType.Polygon)) && entity.polygon?.hierarchy) {
    const hierarchy = entity.polygon.hierarchy.getValue(now);
    if (!hierarchy?.positions?.length) return null;
    const positions = [...hierarchy.positions];
    return {
      polyline: new Cesium.PolylineGraphics({
        positions,
        width: strokeWidth,
        material:
          context.strokeType === "dash"
            ? new Cesium.PolylineDashMaterialProperty({ color: strokeColor })
            : strokeColor,
        clampToGround: true,
      }),
      polygon: new Cesium.PolygonGraphics({
        hierarchy,
        material: fillColor,
        outline: false,
        height: 0,
      }),
    };
  }

  return null;
};
