import * as Cesium from "cesium";

export type waterSimulationOptionsType = {
  lon: number,
  lat: number,
  cellSize: 1 | 2 | 4 | 8;
  gridSize: 16 | 32 | 64 | 128 | 256 | 512 | 1024 ;
  colorIntensity?: number;
  cushionFactor?: number;
  evaporationRate?: number;
  gravity?: number;
  heightPalette?: boolean;
  interval?: number;
  maxFlux?: number;
  maxHeight?: number;
  rainAmount?: number;
  rainMaxPrecipitation?: number;
  simulationConfine?: boolean;
  timeStep?: number;
  waterBrightness?: number;
  waterColor?: Cesium.Color;
  waterDensity?: number;
  waterMinusSourceAmount?: number;
  waterMinusSourceArea?: number;
  waterMinusSourcePositions?: Cesium.PositionProperty[];
  waterSeawallArea?: number;
  waterSeawallHeight?: number;
  waterSeawallPositions?: Cesium.PositionProperty[];
  waterSkirt?: boolean;
  waterSourceAmount?: number;
  waterSourceArea?: number;
  waterSourcePositions?: Cesium.PositionProperty[];
}

export type BBoxExtent = {
  west: number;
  south: number;
  east: number;
  north: number;
};
