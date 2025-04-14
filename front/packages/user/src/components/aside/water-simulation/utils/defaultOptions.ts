import * as Cesium from "cesium";
import {waterSimulationOptionsType} from "@/components/aside/water-simulation/utils/types.ts";

export const waterDefaultColor = "#112C46";

export const waterDefaultOptions: waterSimulationOptionsType = {
  lon: 0,
  lat: 0,
  gridSize: 256,
  cellSize: 1,
  waterSourceAmount: 0.37,
  waterSourceArea: 2,
  waterMinusSourceAmount: 0.0,
  rainMaxPrecipitation: 0.1,
  rainAmount: 2,
  waterColor: Cesium.Color.fromCssColorString(waterDefaultColor),
  colorIntensity: 10,
  waterBrightness: 1.0,
  evaporationRate: 0.0961,
  interval: 60,
  timeStep: 0.1,
  cushionFactor: 0.995,
  waterDensity: 998.0,
  simulationConfine: true,
  heightPalette: false,
};
