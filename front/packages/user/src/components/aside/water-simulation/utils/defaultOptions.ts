import * as Cesium from "cesium";
import {waterSimulationOptionsType} from "@/components/aside/water-simulation/utils/types.ts";

export const waterDefaultColor = "#2465FF";

export const waterDefaultOptions: waterSimulationOptionsType = {
  lon: 0,
  lat: 0,
  gridSize: 512,
  cellSize: 2,
  waterSourceAmount: 10,
  waterMinusSourceAmount: 0.0,
  rainMaxPrecipitation: 0.1,
  waterColor: Cesium.Color.fromCssColorString(waterDefaultColor),
  colorIntensity: 2.0,
  waterBrightness: 1.0,
  evaporationRate: 0.0,
  interval: 60,
  timeStep: 0.1,
  cushionFactor: 0.995,
  waterDensity: 998.0,
  simulationConfine: true,
  heightPalette: false,
  waterSourcePositions: [],
};
