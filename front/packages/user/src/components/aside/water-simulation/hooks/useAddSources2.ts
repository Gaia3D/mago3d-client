// 물줄기를 따라 water source 생성 물 강도에 따라 water source 간격 조절
import * as Cesium from "cesium";
import { calcExtent } from "../utils/calcExtent";
import { waterSimulationOptionsType } from "@/components/aside/water-simulation/utils/types";
import { BBox, Feature, Geometry, Properties } from "@turf/turf";
// @ts-expect-error: no ts lib
import { MagoFluid } from "mago-cesium-tools";

export const useAddSources2 = (
  viewer: Cesium.Viewer,
  dataSource: Cesium.DataSource,
  sourceData: Feature<Geometry | Properties>[],
  options: waterSimulationOptionsType,
  magoFluid: MagoFluid
) => {
  const extent = calcExtent(options);
  const bbox: BBox = [extent.west, extent.south, extent.east, extent.north];

  let isCancelled = false;

  const addSources = async () => {
    isCancelled = false; // 초기화

    for (const feature of sourceData) {
      if (isCancelled) break;
      if (feature.geometry?.type !== "MultiLineString") continue;

      const intensity = Number(feature.properties?.hack_ord);
      if (isNaN(intensity) || intensity < 1 || intensity > 9) continue;

      const multiLineCoords = feature.geometry.coordinates as number[][][];

      const allCoords: number[][] = multiLineCoords.flat();

      const coordsInBbox = allCoords.filter(([lon, lat]) =>
        lon >= bbox[0] && lon <= bbox[2] && lat >= bbox[1] && lat <= bbox[3]
      );

      for (let i = 0; i < coordsInBbox.length; i += 1) {
        const [lon, lat] = coordsInBbox[i];
        const positionCartographic = Cesium.Cartographic.fromDegrees(lon, lat);
        const positions = await Cesium.sampleTerrainMostDetailed(viewer.terrainProvider, [positionCartographic]);

        if (isCancelled) break;

        const height = positions[0]?.height ?? 0;
        const position = Cesium.Cartesian3.fromDegrees(lon, lat, height);
        magoFluid.addWaterSourcePosition(lon, lat);
      }
    }
  };

  const cancelSources = () => {
    isCancelled = true;
  };

  return {addSources, cancelSources};
};
