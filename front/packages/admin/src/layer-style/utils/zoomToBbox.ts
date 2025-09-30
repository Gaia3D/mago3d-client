import * as Cesium from "cesium";

export const zoomToBbox = (
  viewer: Cesium.Viewer,
  bbox: number[],
  options?: { duration?: number; paddingRatio?: number }
) => {
  if (!bbox || bbox.length !== 4) return;

  const [minLon, minLat, maxLon, maxLat] = bbox;
  const paddingRatio = options?.paddingRatio ?? 0.1;

  const width = maxLon - minLon;
  const height = maxLat - minLat;

  const rectangle = Cesium.Rectangle.fromDegrees(
    minLon - width * paddingRatio,
    minLat - height * paddingRatio,
    maxLon + width * paddingRatio,
    maxLat + height * paddingRatio
  );

  viewer.camera.flyTo({
    destination: rectangle,
    duration: options?.duration ?? 0.6,
  });
};
