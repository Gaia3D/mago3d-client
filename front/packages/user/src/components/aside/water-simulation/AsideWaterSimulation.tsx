import React, {useEffect, useRef, useState} from 'react';
import { AsideDisplayProps } from "@/components/aside/AsidePanel";
import { useGlobeController } from "@/components/providers/GlobeControllerProvider";
import * as Cesium from "cesium";
import { calcExtent } from "./utils/calcExtent";
import { createRectanglePositions } from "./utils/createRectanglePositions";
import { filterWaterFeatures } from "./utils/filterWaterFeatures";
import {waterSimulationOptionsType} from "@/components/aside/water-simulation/utils/types.ts";
import {waterDefaultColor, waterDefaultOptions} from "@/components/aside/water-simulation/utils/defaultOptions.ts";
import {Feature, Geometry, Properties} from "@turf/turf";
import {useLoadWaterGeojson} from "@/components/aside/water-simulation/hooks/useLoadWaterGeojson.ts";
import SelectInput from "@/components/aside/water-simulation/components/SelectInput.tsx";
import LabeledSlider from "@/components/aside/water-simulation/components/LabeledSlider.tsx";
import ColorPicker from "@/components/aside/water-simulation/components/ColorPicker.tsx";
import CheckboxInput from "@/components/aside/water-simulation/components/CheckboxInput.tsx";
// @ts-expect-error: no ts lib
import { MagoFluid } from "mago-cesium-tools";
import SideCloseButton from "@/components/SideCloseButton.tsx";
import {useWaterSelectPosition} from "@/components/aside/water-simulation/hooks/useWaterSelectPosition.ts";
import {useWaterSources} from "@/components/aside/water-simulation/hooks/useWaterSource.ts";

const amountByCell = {
  1: { min: 0.2, max: 0.5, default: 0.37},
  2: { min: 0.5, max: 1.5, default: 1},
  4: { min: 2.5, max: 5, default: 3.5},
  8: { min: 9, max: 15, default: 10},
}

const AsideWaterSimulation: React.FC<AsideDisplayProps> = ({ display }) => {
  const { globeController } = useGlobeController();
  const { viewer, waterDataSource } = globeController;
  const [magoFluid, setMagoFluid] = useState<MagoFluid | null>(null);
  const [options, setOptions] = useState<waterSimulationOptionsType>(waterDefaultOptions);
  const [positionSelecting, setPositionSelecting] = useState(false);
  const [sourceData, setSourceData] = useState<Feature<Geometry | Properties>[]>([]);

  const [colorHex, setColorHex] = useState(waterDefaultColor);
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);

  const waterGeojson = useLoadWaterGeojson();
  useWaterSelectPosition(positionSelecting, setPositionSelecting, options, setOptions);

  // 처음 사이드바 열때
  useEffect(() => {
    if (!viewer || !display) return;
    console.log("viewer ready");
    if (magoFluid) return;
    init();
  }, [viewer, display]);

  useEffect(() => {
    if (!magoFluid || display) return;
    stop();
    reload();
    setPositionSelecting(false);
  }, [display, magoFluid]);

  // 위치 수정시
  useEffect(() => {
    if (!options.lon || !options.lat) return;
    createExtentLine();
    findSourcesWithinExtent();
  }, [options.lon, options.lat]);

  // waterSource 데이터 얻었을때
  useEffect(() => {
    if (!viewer || !sourceData.length) return;
    // initBase();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { addSources, cancelSources } = useWaterSources(viewer, sourceData, options, magoFluid);
    addSources();

    return () => cancelSources();
  }, [viewer, sourceData]);

  // options 값 변경됐을때
  useEffect(() => {
    if (!magoFluid) return;
    Object.assign(magoFluid.options, options);
  }, [magoFluid, options]);

  const init = async () => {
    console.log("setMagoFluid");
    setMagoFluid(new MagoFluid(viewer));
  }

  const start = () => {
    console.log("start, magoFluid", magoFluid);
    setIsSimulationRunning(true);
    magoFluid?.start();
  }

  const stop = () => {
    setIsSimulationRunning(false);
    magoFluid.stop();
  }

  const reload = async() => {
    await magoFluid.init(viewer);
    await magoFluid.initBase(options);
    await magoFluid.clearWaterSourcePositions();
    waterDataSource.entities.removeAll();
  }

  const reloadPositionSelecting = async () => {
    stop();
    await reload();
    setPositionSelecting(!positionSelecting);
  }

  const createExtentLine = () => {
    waterDataSource.entities.removeAll();
    const extent = calcExtent(options);
    const positions = createRectanglePositions(extent);
    waterDataSource.entities.add({
      polyline: {
        positions,
        width: 2.0,
        material: Cesium.Color.RED,
        clampToGround: true,
      },
    });
  }
  const findSourcesWithinExtent = () => {
    if (!waterGeojson) return;
    const extent = calcExtent(options);
    const bbox: [number, number, number, number] = [
      extent.west,
      extent.south,
      extent.east,
      extent.north,
    ];
    const filtered = filterWaterFeatures(waterGeojson, bbox);
    setSourceData(filtered);
  }

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;

    setOptions((prev) => ({
      ...prev,
      [name]: parseFloat(value),
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

  useEffect(() => {
    if (!magoFluid) return;
    magoFluid.options.waterSourceAmount = amountByCell[options.cellSize].default;
    setOptions((prev) => ({
      ...prev,
      ["waterSourceAmount"]: amountByCell[options.cellSize].default,
    }));
  }, [magoFluid, options.cellSize]);

  return (
    <div className={`side-bar-wrapper ${display ? "on" : "off"}`}>
      <div className="side-bar water-simulation">
          <div className="side-bar-header">
            <SideCloseButton/>
          </div>
        <div className="content--wrapper">
          <div className="water-setup mar-top-10 flex">
            <SelectInput label={"그리드 크기"} name={"gridSize"} value={options.gridSize}
                         options={[16, 32, 64, 128, 256, 512, 1024]} onChange={handleSelectChange}/>
            <SelectInput label={"셀 크기"} name={"cellSize"} value={options.cellSize}
                         options={[1, 2, 4, 8]} onChange={handleSelectChange}/>
          </div>
          <div className="water-setup mar-top-10"></div>

          <LabeledSlider label="물줄기 두께" name="waterSourceAmount" value={options.waterSourceAmount} min={amountByCell[options.cellSize].min} max={amountByCell[options.cellSize].max}
                         step={0.01} onChange={handleChange}/>
          <LabeledSlider label="강수량" name="rainMaxPrecipitation" value={options.rainMaxPrecipitation} min={0} max={5}
                         step={0.01} onChange={handleChange}/>


          {/*<LabeledSlider label="물줄기 두께" name="waterSourceAmount" value={options.waterSourceAmount} min={0.2} max={20}*/}
          {/*               step={0.01} onChange={handleChange}/>*/}
          {/*<LabeledSlider label="강수량" name="rainMaxPrecipitation" value={options.rainMaxPrecipitation} min={0} max={5}*/}
          {/*               step={0.01} onChange={handleChange}/>*/}
          {/*<LabeledSlider label="발생범위" name="waterSourceArea" value={options.waterSourceArea} min={0} max={20} step={1}*/}
          {/*               onChange={handleChange}/>*/}
          {/*<LabeledSlider label="강수물양" name="rainAmount" value={options.rainAmount} min={0} max={10} step={0.01}*/}
          {/*               onChange={handleChange}/>*/}
          {/*<LabeledSlider label="간격" name="interval" value={options.interval} min={1} max={120} step={1}*/}
          {/*               onChange={handleChange}/>*/}
          {/*<LabeledSlider label="시간 배속" name="timeStep" value={options.timeStep} min={0.0} max={0.2} step={0.001}*/}
          {/*               onChange={handleChange}/>*/}
          {/*<LabeledSlider label="밀도" name="waterDensity" value={options.waterDensity} min={0.001} max={1} step={0.001}*/}
          {/*               onChange={handleChange}/>*/}
          {/*<LabeledSlider label="완충 계수" name="cushionFactor" value={options.cushionFactor} min={0.5} max={1.0}*/}
          {/*               step={0.001} onChange={handleChange}/>*/}
          {/*<LabeledSlider label="증발률" name="evaporationRate" value={options.evaporationRate} min={0.0} max={1}*/}
          {/*               step={0.0001} onChange={handleChange}/>*/}
          {/*<LabeledSlider label="색상 강도" name="colorIntensity" value={options.colorIntensity} min={0} max={100} step={0.1}*/}
          {/*               onChange={handleChange}/>*/}
          {/*<LabeledSlider label="색상 밝기" name="waterBrightness" value={options.waterBrightness} min={0} max={10}*/}
          {/*               step={0.1} onChange={handleChange}/>*/}

          <div className="water-setup">
            <ColorPicker label="색상" value={colorHex} onChange={handleColorChange}/>
            {/*<CheckboxInput label="높이 팔레트" name="heightPalette" checked={options.heightPalette} onChange={handleChange}/>*/}
            {/*<CheckboxInput label="배수" name="simulationConfine" checked={options.simulationConfine} onChange={handleChange} />*/}
          </div>
          <div className="water-setup first-item">
            <div className="stitle">위치 설정</div>
            <button
              onClick={reloadPositionSelecting}
              type="button"
              className={`positon-select ${positionSelecting ? "selected" : ""}`}
            >선택
            </button>
          </div>
          <div className="water-setup first-item">
            <div className="stitle"></div>
            {
              !options.lat ?
                <button
                  type="button"
                  className="button-simulation disabled"
                >
                  시뮬레이션 시작
                </button>
                : !isSimulationRunning ?
                  <button
                    type="button"
                    className="button-simulation play"
                    onClick={start}
                  >
                    시뮬레이션 시작
                  </button>
                  :
                  <button type="button" className="button-simulation end" onClick={stop}>
                    시뮬레이션 중지
                  </button>

            }
            {/*  <button onClick={resetSimulation}>reset</button>*/}
            {/*  <button*/}
            {/*    onClick={() => magoFluid.gridPrimitive.debugWireframe = !magoFluid?.gridPrimitive?.debugWireframe}>wire*/}
            {/*  </button>*/}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AsideWaterSimulation;
