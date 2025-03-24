import * as turf from "@turf/turf";
import {BBoxExtent, waterSimulationOptionsType} from "./types";

export const calcExtent = ({ lon, lat, gridSize, cellSize }: waterSimulationOptionsType): BBoxExtent => {
  const radiusKm = (gridSize * cellSize) / 2000;
  const buffered = turf.buffer(turf.point([lon, lat]), radiusKm, { units: "kilometers" });
  const [minX, minY, maxX, maxY] = turf.bbox(buffered);
  return { west: minX, south: minY, east: maxX, north: maxY };
};
