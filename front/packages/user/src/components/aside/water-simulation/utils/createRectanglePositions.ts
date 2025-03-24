import * as Cesium from "cesium";
import { BBoxExtent } from "./types";

export const createRectanglePositions = ({ west, south, east, north }: BBoxExtent) =>
  Cesium.Cartesian3.fromDegreesArray([
    west, north,
    east, north,
    east, south,
    west, south,
    west, north,
  ]);
