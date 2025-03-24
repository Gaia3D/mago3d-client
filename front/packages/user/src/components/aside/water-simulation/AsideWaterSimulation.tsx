import React, { useEffect, useState } from 'react';
import { AsideDisplayProps } from "@/components/aside/AsidePanel";
import { useGlobeController } from "@/components/providers/GlobeControllerProvider";
import * as Cesium from "cesium";
import { calcExtent } from "./utils/calcExtent";
import { createRectanglePositions } from "./utils/createRectanglePositions";
import { filterWaterFeatures } from "./utils/filterWaterFeatures";
import { useAddSources } from "./hooks/useAddSources";
import {waterSimulationOptionsType} from "@/components/aside/water-simulation/utils/types.ts";
import {waterDefaultOptions} from "@/components/aside/water-simulation/utils/defaultOptions.ts";
import {Feature, Geometry, Properties} from "@turf/turf";
import {useLoadWaterGeojson} from "@/components/aside/water-simulation/hooks/useLoadWaterGeojson.ts";

const AsideWaterSimulation: React.FC<AsideDisplayProps> = ({ display }) => {
  const { globeController } = useGlobeController();
  const { viewer } = globeController;

  const [options, setOptions] = useState<waterSimulationOptionsType>(waterDefaultOptions);
  const [sourceData, setSourceData] = useState<Feature<Geometry | Properties>[]>([]);

  const waterGeojson = useLoadWaterGeojson();

  useEffect(() => {
    if (!viewer) return;

    const { lon, lat } = waterDefaultOptions;
    const cameraTarget = Cesium.Cartesian3.fromDegrees(lon, lat, 2000);
    viewer.camera.flyTo({ destination: cameraTarget, duration: 0 });
  }, [viewer]);

  useEffect(() => {
    if (!viewer || !waterGeojson) return;

    const extent = calcExtent(options);
    const positions = createRectanglePositions(extent);
    const bbox: [number, number, number, number] = [
      extent.west,
      extent.south,
      extent.east,
      extent.north,
    ];

    const filteredFeatures = filterWaterFeatures(waterGeojson, bbox);
    setSourceData(filteredFeatures);

    viewer.entities.add({
      polyline: {
        positions,
        width: 2.0,
        material: Cesium.Color.fromCssColorString("#0011ff"),
        clampToGround: true,
      },
    });
  }, [viewer, waterGeojson, options]);

  useEffect(() => {
    if (!viewer || !sourceData.length) return;
    const addSources = useAddSources(viewer, sourceData, options);
    addSources();
  }, [sourceData]);

  return (
    <div className={`side-bar-wrapper ${display ? "on" : "off"}`}>
      <div className="side-bar water-simulation">
      </div>
    </div>
  );
};

export default AsideWaterSimulation;
