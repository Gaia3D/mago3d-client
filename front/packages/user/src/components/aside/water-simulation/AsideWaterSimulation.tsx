import React, {useEffect, useRef, useState} from 'react';
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
import SelectInput from "@/components/aside/water-simulation/components/SelectInput.tsx";
import {useWaterSelectPosition} from "@/components/aside/water-simulation/hooks/useWaterSelectPosition.ts";

const AsideWaterSimulation: React.FC<AsideDisplayProps> = ({ display }) => {
  const { globeController } = useGlobeController();
  const { viewer, waterDataSource } = globeController;

  const [options, setOptions] = useState<waterSimulationOptionsType>(waterDefaultOptions);
  const [sourceData, setSourceData] = useState<Feature<Geometry | Properties>[]>([]);
  const [selectingPosition, setSelectingPosition] = useState(false);

  const waterGeojson = useLoadWaterGeojson();

  const cancelSourcesRef = useRef<() => void>(() => {});

  const setLonLat = (lon: number, lat: number) => {
    setOptions((prev) => ({
      ...prev,
      lon,
      lat,
    }));
    setSelectingPosition(false); // 선택 종료
  };
  useWaterSelectPosition(selectingPosition, setLonLat);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;

    setOptions((prev) => ({
      ...prev,
      [name]: parseFloat(value), // gridSize, cellSize는 number 타입
    }));
  };

  const resetSimulation = () => {
    cancelSourcesRef.current();
    waterDataSource.entities.removeAll();
    setOptions((prev) => ({
      ...prev,
      lon: 0,
      lat: 0,
    }));
  };

  useEffect(() => {
    if (!viewer) return;

    const { lon, lat } = waterDefaultOptions;
    if (!lon || !lat) return;
    const cameraTarget = Cesium.Cartesian3.fromDegrees(lon, lat, 2000);
    viewer.camera.flyTo({ destination: cameraTarget, duration: 0 });
  }, [viewer]);

  useEffect(() => {
    if (!viewer || !waterGeojson || !options.lon || !options.lat) return;

    waterDataSource.entities.removeAll();

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

    waterDataSource.entities.add({
      polyline: {
        positions,
        width: 2.0,
        material: Cesium.Color.fromCssColorString("#0011ff"),
        clampToGround: true,
      },
    });
  }, [viewer, waterGeojson, options.lon, options.lat, options.gridSize, options.cellSize]);

  useEffect(() => {
    if (!viewer || !sourceData.length) return;

    const { addSources, cancelSources } = useAddSources(viewer, waterDataSource, sourceData, options);
    cancelSourcesRef.current = cancelSources;
    addSources();

    return () => cancelSources();
  }, [sourceData]);
  return (
    <div className={`side-bar-wrapper ${display ? "on" : "off"}`}>
      <div className="side-bar water-simulation">
        <div>
          <button onClick={() => setSelectingPosition(true)}>Select Position</button>
        </div>
        <div>
          <button>start</button>
          <button>stop</button>
          <button onClick={resetSimulation}>reset</button>
        </div>
        <SelectInput label={"Grid Size"} name={"gridSize"} value={options.gridSize}
                     options={[16, 32, 64, 128, 256, 512, 1024]} onChange={handleSelectChange}/>
        <SelectInput label={"Cell Size"} name={"cellSize"} value={options.cellSize} options={[1, 2, 4, 8]}
                     onChange={handleSelectChange}/>
      </div>
    </div>
  );
};

export default AsideWaterSimulation;
