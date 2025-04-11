import * as Cesium from "cesium";
import { GlobeController } from "@/api/GlobeController.ts";
import { waterSimulationOptionsType } from "@/components/aside/water-simulation/utils/types.ts";

export const createGuidePolygonEntity = (
  globeController: GlobeController,
  mousePositionRef: React.MutableRefObject<Cesium.Cartesian2 | null>,
  optionsRef: React.MutableRefObject<waterSimulationOptionsType>
): Cesium.Entity | null => {
  const { viewer } = globeController;
  if (!viewer) return null;

  return viewer.entities.add({
    polygon: {
      hierarchy: new Cesium.CallbackProperty(() => {
        const mousePosition = mousePositionRef.current;
        const options = optionsRef.current;
        if (!mousePosition) return undefined;

        const centerCartesian = globeController.pickPosition(mousePosition);
        if (!centerCartesian) return undefined;

        const carto = Cesium.Cartographic.fromCartesian(centerCartesian);
        const lon = Cesium.Math.toDegrees(carto.longitude);
        const lat = Cesium.Math.toDegrees(carto.latitude);

        const sizeMeters = options.gridSize * options.cellSize;
        const halfSize = sizeMeters / 2;

        const metersPerDegreeLat = 111000;
        const metersPerDegreeLon = 111000 * Math.cos(Cesium.Math.toRadians(lat));

        const deltaLat = halfSize / metersPerDegreeLat;
        const deltaLon = halfSize / metersPerDegreeLon;

        return new Cesium.PolygonHierarchy(
          Cesium.Cartesian3.fromDegreesArray([
            lon - deltaLon, lat - deltaLat,
            lon + deltaLon, lat - deltaLat,
            lon + deltaLon, lat + deltaLat,
            lon - deltaLon, lat + deltaLat
          ])
        );
      }, false),
      material: Cesium.Color.RED.withAlpha(0.4),
      heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
    }
  });
};
