import { Geometry } from "geojson";
import * as Cesium from "cesium";

const POINT_SIZE = 10;
const LINE_WIDTH = 4;
const LINE_COLOR = Cesium.Color.LIME;
const FILL_COLOR = Cesium.Color.WHITE.withAlpha(0.1);

export function createEntityFromGeometry(geom: Geometry): Cesium.Entity | undefined {
  const toCartesian = (coords: number[][]) =>
    coords.map(([lon, lat]) => Cesium.Cartesian3.fromDegrees(lon, lat));

  switch (geom.type) {
    case "Polygon": {
      const positions = toCartesian(geom.coordinates[0]);
      return new Cesium.Entity({
        polyline: {
          positions,
          width: LINE_WIDTH,
          material: LINE_COLOR,
          clampToGround: true,
        },
        polygon: {
          hierarchy: new Cesium.PolygonHierarchy(positions),
          material: FILL_COLOR,
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        },
      });
    }

    case "MultiPolygon": {
      const positions = toCartesian(geom.coordinates[0][0]);
      return new Cesium.Entity({
        polyline: {
          positions,
          width: LINE_WIDTH,
          material: LINE_COLOR,
          clampToGround: true,
        },
        polygon: {
          hierarchy: new Cesium.PolygonHierarchy(positions),
          material: FILL_COLOR,
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        },
      });
    }

    case "LineString":
      return new Cesium.Entity({
        polyline: {
          positions: toCartesian(geom.coordinates),
          width: LINE_WIDTH,
          material: LINE_COLOR,
        },
      });

    case "MultiLineString":
      return new Cesium.Entity({
        polyline: {
          positions: toCartesian(geom.coordinates.flat()),
          width: LINE_WIDTH,
          material: LINE_COLOR,
        },
      });

    case "Point":
      return new Cesium.Entity({
        position: Cesium.Cartesian3.fromDegrees(geom.coordinates[0], geom.coordinates[1]),
        point: {
          pixelSize: POINT_SIZE,
          color: FILL_COLOR,
          outlineColor: LINE_COLOR,
          outlineWidth: LINE_WIDTH,
        },
      });

    case "MultiPoint":
      return new Cesium.Entity({
        position: Cesium.Cartesian3.fromDegrees(geom.coordinates[0][0], geom.coordinates[0][1]),
        point: {
          pixelSize: POINT_SIZE,
          color: FILL_COLOR,
          outlineColor: LINE_COLOR,
          outlineWidth: LINE_WIDTH,
        },
      });

    default:
      return undefined;
  }
}
