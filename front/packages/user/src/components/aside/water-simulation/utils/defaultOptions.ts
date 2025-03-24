import * as Cesium from "cesium";
import {waterSimulationOptionsType} from "@/components/aside/water-simulation/utils/types.ts";

export const waterDefaultOptions: waterSimulationOptionsType = {
  lon: 0,
  lat: 0,
  gridSize: 256,
  cellSize: 4,
  waterSourceAmount: 10,
  waterMinusSourceAmount: 0.0,
  rainMaxPrecipitation: 0,
  waterColor: Cesium.Color.fromCssColorString("#0011ff"),
  colorIntensity: 1.0,
  waterBrightness: 1.0,
  evaporationRate: 0.0,
  interval: 60,
  timeStep: 0.1,
  cushionFactor: 0.995,
  waterDensity: 998.0,
  simulationConfine: false,
  heightPalette: false,
  waterSourcePositions: [],
};
