export const getCameraDistanceFromScale = (
  scaleDenominator: number,
  screenWidthInPixels = 1920,
  dpi = 96,
  fovDegrees = 60
): number => {
  const inchesPerPixel = 1 / dpi;
  const metersPerInch = 0.0254;
  const metersPerPixel = inchesPerPixel * metersPerInch;

  const visibleGroundWidthMeters = scaleDenominator * metersPerPixel * screenWidthInPixels;

  const halfFovRadians = (fovDegrees * Math.PI) / 180 / 2;
  const cameraDistance = (visibleGroundWidthMeters / 2) / Math.tan(halfFovRadians);

  return cameraDistance;
};