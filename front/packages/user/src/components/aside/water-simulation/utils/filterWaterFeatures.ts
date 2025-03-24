import booleanIntersects from "@turf/boolean-intersects";
import { bboxPolygon, BBox } from "@turf/turf";

export const filterWaterFeatures = (geojson: GeoJSON.FeatureCollection, bbox: BBox) => {
  const polygon = bboxPolygon(bbox);
  return geojson.features.filter((feature) => booleanIntersects(feature, polygon));
};
