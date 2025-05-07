import * as Cesium from "cesium";
import {LayerStyle, StyleType} from "@mnd/shared/src/types/layerset/gql/graphql";
import {PreviewMode} from "@src/types/Layer";

export function applyStyledEntities(
  viewer: Cesium.Viewer,
  entities: Cesium.Entity[],
  styles: LayerStyle[],
  previewMode: PreviewMode
) {
  viewer.entities.removeAll();

  const now = Cesium.JulianDate.now();
  let targets;

  if (previewMode === PreviewMode.Single) {
    targets = [entities[0]];
  } else if (previewMode === PreviewMode.All) {
    targets = entities;
  }

  targets.forEach(entity => {
    ensureEntityPosition(entity);

    for (const style of styles) {
      const { context, type } = style;
      const strokeColor = Cesium.Color.fromCssColorString(context.strokeColor || "#000000")
        .withAlpha(context.strokeOpacity ?? 1);
      const fillColor = Cesium.Color.fromCssColorString(context.fillColor || "#ffffff")
        .withAlpha(context.fillOpacity ?? 1);
      const strokeWidth = context.strokeWidth ?? 1;

      if (type === StyleType.Point && entity.position) {
        viewer.entities.add({
          position: entity.position,
          point: new Cesium.PointGraphics({
            pixelSize: context.size ?? 20,
            color: fillColor,
            outlineColor: strokeColor,
            outlineWidth: strokeWidth,
          }),
        });
        break;
      }

      if (type === StyleType.Line && entity.polyline?.positions) {
        const positions = entity.polyline.positions.getValue(now);
        if (!positions) continue;

        viewer.entities.add({
          polyline: new Cesium.PolylineGraphics({
            positions,
            width: strokeWidth,
            material: strokeColor,
            clampToGround: true,
          }),
        });
        break;
      }

      if (type === StyleType.Polygon && entity.polygon?.hierarchy) {
        const hierarchy = entity.polygon.hierarchy.getValue(now);
        if (!hierarchy?.positions?.length) continue;

        viewer.entities.add({
          polygon: new Cesium.PolygonGraphics({
            hierarchy,
            material: fillColor,
            outline: true,
            outlineColor: strokeColor,
            outlineWidth: strokeWidth,
            height: 0,
          }),
        });
        break;
      }
    }
  });
}

function ensureEntityPosition(entity: Cesium.Entity): void {
  if (entity.position) return; // 이미 있으면 패스

  const now = Cesium.JulianDate.now();

  // 폴리곤 중심
  if (entity.polygon?.hierarchy) {
    const hierarchy = entity.polygon.hierarchy.getValue(now);
    if (hierarchy?.positions?.length > 0) {
      const center = Cesium.BoundingSphere.fromPoints(hierarchy.positions).center;
      entity.position = new Cesium.ConstantPositionProperty(center);
    }
  }

  // 폴리라인 시작점
  if (!entity.position && entity.polyline?.positions) {
    const positions = entity.polyline.positions.getValue(now);
    if (positions?.length > 0) {
      entity.position = new Cesium.ConstantPositionProperty(positions[0]);
    }
  }
}
