import * as Cesium from "cesium";

export const setGeometryToEntity = (entity: Cesium.Entity, feature: GeoJSON.Feature) => {
  if (!feature.geometry) return;

  const { type } = feature.geometry;

  switch (type) {
    case "Point": {
      const [lon, lat] = (feature.geometry as GeoJSON.Point).coordinates;
      entity.position = new Cesium.ConstantPositionProperty(Cesium.Cartesian3.fromDegrees(lon, lat));
      break;
    }

    case "MultiPoint": {
      const first = (feature.geometry as GeoJSON.MultiPoint).coordinates[0];
      if (first) {
        const [lon, lat] = first;
        entity.position = new Cesium.ConstantPositionProperty(Cesium.Cartesian3.fromDegrees(lon, lat));
      }
      break;
    }

    case "LineString": {
      const coords = (feature.geometry as GeoJSON.LineString).coordinates;
      const positions = coords.map(([lon, lat]) => Cesium.Cartesian3.fromDegrees(lon, lat));
      entity.polyline = new Cesium.PolylineGraphics({ positions, width: 1.0 });
      break;
    }

    case "MultiLineString": {
      const lines = (feature.geometry as GeoJSON.MultiLineString).coordinates;
      const firstLine = lines[0];
      if (firstLine) {
        const positions = firstLine.map(([lon, lat]) => Cesium.Cartesian3.fromDegrees(lon, lat));
        entity.polyline = new Cesium.PolylineGraphics({ positions, width: 1.0 });
      }
      break;
    }

    case "Polygon": {
      const outer = (feature.geometry as GeoJSON.Polygon).coordinates[0];
      const positions = outer.map(([lon, lat]) => Cesium.Cartesian3.fromDegrees(lon, lat));
      entity.polygon = new Cesium.PolygonGraphics({
        hierarchy: new Cesium.PolygonHierarchy(positions),
      });
      break;
    }

    case "MultiPolygon": {
      const firstPoly = (feature.geometry as GeoJSON.MultiPolygon).coordinates[0];
      if (firstPoly) {
        const outer = firstPoly[0];
        const positions = outer.map(([lon, lat]) => Cesium.Cartesian3.fromDegrees(lon, lat));
        entity.polygon = new Cesium.PolygonGraphics({
          hierarchy: new Cesium.PolygonHierarchy(positions),
        });
      }
      break;
    }

    case "GeometryCollection": {
      const geometries = (feature.geometry as GeoJSON.GeometryCollection).geometries;
      if (geometries.length > 0) {
        const dummyFeature: GeoJSON.Feature = {
          ...feature,
          geometry: geometries[0],
        };
        setGeometryToEntity(entity, dummyFeature);
      }
      break;
    }
  }
};
