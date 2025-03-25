import React, {useEffect, useRef, useState} from 'react';
import { AsideDisplayProps } from "@/components/aside/AsidePanel";
import { useGlobeController } from "@/components/providers/GlobeControllerProvider";
import * as Cesium from "cesium";
import { calcExtent } from "./utils/calcExtent";
import { createRectanglePositions } from "./utils/createRectanglePositions";
import { filterWaterFeatures } from "./utils/filterWaterFeatures";
import { useAddSources } from "./hooks/useAddSources";
import {waterSimulationOptionsType} from "@/components/aside/water-simulation/utils/types.ts";
import {waterDefaultColor, waterDefaultOptions} from "@/components/aside/water-simulation/utils/defaultOptions.ts";
import {Feature, Geometry, Properties} from "@turf/turf";
import {useLoadWaterGeojson} from "@/components/aside/water-simulation/hooks/useLoadWaterGeojson.ts";
import SelectInput from "@/components/aside/water-simulation/components/SelectInput.tsx";
import {useWaterSelectPosition} from "@/components/aside/water-simulation/hooks/useWaterSelectPosition.ts";
import LabeledSlider from "@/components/aside/water-simulation/components/LabeledSlider.tsx";
import ColorPicker from "@/components/aside/water-simulation/components/ColorPicker.tsx";
import CheckboxInput from "@/components/aside/water-simulation/components/CheckboxInput.tsx";
// @ts-expect-error: no ts lib
import { MagoFluid } from "mago-cesium-tools";

const AsideWaterSimulation: React.FC<AsideDisplayProps> = ({ display }) => {
  const { globeController } = useGlobeController();
  const { viewer, waterDataSource } = globeController;
  const [magoFluid, setMagoFluid] = useState<MagoFluid | null>(null);

  const [options, setOptions] = useState<waterSimulationOptionsType>(waterDefaultOptions);
  const [sourceData, setSourceData] = useState<Feature<Geometry | Properties>[]>([]);
  const [selectingPosition, setSelectingPosition] = useState(false);
  const [colorHex, setColorHex] = useState(waterDefaultColor);

  const waterGeojson = useLoadWaterGeojson();

  const cancelSourcesRef = useRef<() => void>(
    /* eslint-disable @typescript-eslint/no-empty-function */
    () => {}
  );

  const init = async () => {
    const fluid = new MagoFluid(viewer);
    setMagoFluid(fluid)
    await fluid.initBase(options);

  }

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, value, checked } = e.target;
    let parsedValue: string | number | boolean = value;

    if (type === "number" || type === "range") parsedValue = parseFloat(value);
    if (type === "checkbox") parsedValue = checked;

    setOptions((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hex = e.target.value;
    setColorHex(hex);
    const color = Cesium.Color.fromCssColorString(hex);
    setOptions((prev) => ({ ...prev, waterColor: color }));
  };

  const resetSimulation = async () => {
    cancelSourcesRef.current();
    waterDataSource.entities.removeAll();
    await magoFluid.initializeWater();
    await magoFluid.stop();
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
    init();

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
        material: Cesium.Color.fromCssColorString(waterDefaultColor),
        clampToGround: true,
      },
    });
  }, [viewer, waterGeojson, options.lon, options.lat, options.gridSize, options.cellSize]);

  useEffect(() => {
    if (!viewer || !sourceData.length || !magoFluid) return;
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { addSources, cancelSources } = useAddSources(viewer, waterDataSource, sourceData, options, magoFluid);
    cancelSourcesRef.current = cancelSources;
    addSources();

    return () => cancelSources();
  }, [sourceData, magoFluid]);

  useEffect(() => {
    if (!magoFluid) return;

    Object.assign(magoFluid.options, options);
  }, [magoFluid, options]);
  return (
    <div className={`side-bar-wrapper ${display ? "on" : "off"}`}>
      <div className="side-bar water-simulation">
        <div>
          <button onClick={() => setSelectingPosition(true)}>Select Position</button>
        </div>
        <div>
          <button onClick={() => magoFluid?.start()}>start</button>
          <button onClick={() => magoFluid?.stop()}>stop</button>
          <button onClick={resetSimulation}>reset</button>
          <button onClick={() => magoFluid.gridPrimitive.debugWireframe = !magoFluid?.gridPrimitive?.debugWireframe}>wire</button>
        </div>
        <SelectInput label={"그리드 크기"} name={"gridSize"} value={options.gridSize}
                     options={[16, 32, 64, 128, 256, 512, 1024]} onChange={handleSelectChange}/>
        <SelectInput label={"셀 크기"} name={"cellSize"} value={options.cellSize}
                     options={[1, 2, 4, 8]} onChange={handleSelectChange}/>
        <LabeledSlider label="발생량" name="waterSourceAmount" value={options.waterSourceAmount} min={0} max={100} step={0.01} onChange={handleChange} />
        <LabeledSlider label="강수량" name="rainMaxPrecipitation" value={options.rainMaxPrecipitation} min={0} max={10} step={0.01} onChange={handleChange} />
        <LabeledSlider label="간격" name="interval" value={options.interval} min={1} max={120} step={1} onChange={handleChange} />
        <LabeledSlider label="시간 배속" name="timeStep" value={options.timeStep} min={0.0} max={0.2} step={0.001} onChange={handleChange} />
        <LabeledSlider label="밀도" name="waterDensity" value={options.waterDensity} min={1.0} max={1000.0} step={1.0} onChange={handleChange} />
        <LabeledSlider label="완충 계수" name="cushionFactor" value={options.cushionFactor} min={0.5} max={1.0} step={0.001} onChange={handleChange} />
        <LabeledSlider label="증발률" name="evaporationRate" value={options.evaporationRate} min={0.0} max={1} step={0.0001} onChange={handleChange} />
        <LabeledSlider label="색상 강도" name="colorIntensity" value={options.colorIntensity} min={0} max={2.0} step={0.1} onChange={handleChange} />
        <LabeledSlider label="색상 밝기" name="waterBrightness" value={options.waterBrightness} min={0} max={2.0} step={0.1} onChange={handleChange} />
        <ColorPicker label="색상" value={colorHex} onChange={handleColorChange} />
        <CheckboxInput label="배수" name="simulationConfine" checked={options.simulationConfine} onChange={handleChange} />
        <CheckboxInput label="높이 팔레트" name="heightPalette" checked={options.heightPalette} onChange={handleChange} />
      </div>
    </div>
  );
};

export default AsideWaterSimulation;
