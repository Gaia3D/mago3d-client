import * as Cesium from "cesium";

export function ensureEntityPosition(entity: Cesium.Entity): void {
  if (entity.position) return;

  const now = Cesium.JulianDate.now();

  if (entity.polygon?.hierarchy) {
    const hierarchy = entity.polygon.hierarchy.getValue(now);
    if (hierarchy?.positions?.length > 0) {
      const center = Cesium.BoundingSphere.fromPoints(hierarchy.positions).center;
      entity.position = new Cesium.ConstantPositionProperty(center);
    }
  }

  if (!entity.position && entity.polyline?.positions) {
    const positions = entity.polyline.positions.getValue(now);
    if (positions?.length > 0) {
      entity.position = new Cesium.ConstantPositionProperty(positions[0]);
    }
  }
}
