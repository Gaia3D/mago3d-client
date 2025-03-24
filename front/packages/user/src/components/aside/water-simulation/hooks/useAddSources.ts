import * as Cesium from "cesium";
import { calcExtent } from "../utils/calcExtent";
import {waterSimulationOptionsType} from "@/components/aside/water-simulation/utils/types.ts";
import {BBox, Feature, Geometry, Properties} from "@turf/turf";

export const useAddSources = (
  viewer: Cesium.Viewer,
  sourceData: Feature<Geometry | Properties>[],
  options: waterSimulationOptionsType
) => {
  const extent = calcExtent(options);
  const bbox: BBox = [extent.west, extent.south, extent.east, extent.north];

  const addSources = async () => {
    for (const feature of sourceData) {
      const coordsArray = feature.geometry?.coordinates?.[0];
      if (!coordsArray || !Array.isArray(coordsArray)) continue;

      const startCoords = coordsArray[0];
      const coordsInBbox = coordsArray.find(([lon, lat]) =>
        lon >= bbox[0] && lon <= bbox[2] && lat >= bbox[1] && lat <= bbox[3]
      );

      const coords = coordsInBbox ?? startCoords;
      if (!coords) continue;

      const [lon, lat] = coords;
      const positionCartographic = Cesium.Cartographic.fromDegrees(lon, lat);
      const positions = await Cesium.sampleTerrainMostDetailed(viewer.terrainProvider, [positionCartographic]);
      const height = positions[0]?.height ?? 0;

      const position = Cesium.Cartesian3.fromDegrees(lon, lat, height);
      viewer.entities.add({
        position,
        cylinder: {
          length: 30,
          topRadius: 3,
          bottomRadius: 3,
          material: Cesium.Color.BLUE,
          heightReference: Cesium.HeightReference.NONE,
        },
      });
    }
  };

  return addSources;
};

// import * as Cesium from "cesium";
// import { calcExtent } from "../utils/calcExtent";
// import { waterSimulationOptionsType } from "@/components/aside/water-simulation/utils/types";
// import { BBox, Feature, Geometry, Properties } from "@turf/turf";
//
// export const useAddSources = (
//   viewer: Cesium.Viewer,
//   sourceData: Feature<Geometry | Properties>[],
//   options: waterSimulationOptionsType
// ) => {
//   const extent = calcExtent(options);
//   const bbox: BBox = [extent.west, extent.south, extent.east, extent.north];
//
//   const addSources = async () => {
//     for (const feature of sourceData) {
//       if (feature.geometry?.type !== "MultiLineString") continue;
//
//       const intensity = Number(feature.properties?.hack_ord);
//       if (isNaN(intensity) || intensity < 1 || intensity > 9) continue;
//
//       const multiLineCoords = feature.geometry.coordinates as number[][][];
//
//       const allCoords: number[][] = multiLineCoords.flat();
//
//       const coordsInBbox = allCoords.filter(([lon, lat]) =>
//         lon >= bbox[0] && lon <= bbox[2] && lat >= bbox[1] && lat <= bbox[3]
//       );
//
//       for (let i = 0; i < coordsInBbox.length; i += intensity) {
//         const [lon, lat] = coordsInBbox[i];
//         const positionCartographic = Cesium.Cartographic.fromDegrees(lon, lat);
//         const positions = await Cesium.sampleTerrainMostDetailed(viewer.terrainProvider, [positionCartographic]);
//         const height = positions[0]?.height ?? 0;
//         const position = Cesium.Cartesian3.fromDegrees(lon, lat, height);
//
//         viewer.entities.add({
//           position,
//           cylinder: {
//             length: 30,
//             topRadius: 3,
//             bottomRadius: 3,
//             material: Cesium.Color.BLUE,
//             heightReference: Cesium.HeightReference.NONE,
//           },
//         });
//       }
//     }
//   };
//
//   return addSources;
// };
