import axios from "axios";
import { SubmitHandler, useForm } from "react-hook-form";
import { useSetRecoilState } from "recoil";
import { DrawType } from "@/hooks/useAnalGeometryDraw";
import { AnalLayerInputProps, AnalReqXmlProps, AnalValueInputProps, useAnalSpace } from "@/hooks/useAnalSpace";
import { DefaultDrainageFeaturesFilter, DefaultDrainageFeaturesLayer, DefaultSoilFeaturesLayer, DefaultVegetationFeaturesFilter, DefaultVegetationFeaturesLayer, FilterLayerProps, FilterLayerState, ResultLayerDataType, ResultLayerStepType } from "@/recoils/Analysis";
import { useEffect, useState } from "react";
import FilterButton from "../FilterButton";
import { useAnalResult } from "@/hooks/useAnalResult";
import AnalHelp from "../AnalInfo";

type Payload = {
  slopeCoverage: string;
  vegetationFeatures: string;
  vegetationFeaturesFilter?: string;
  soilFeatures: string;
  soilFeaturesFilter?: string;
  roadFeatures: string;
  roadFeaturesFilter?: string;
  drainageFeatures: string;
  drainageFeaturesFilter?: string;
  drainageExFeatures: string;
  drainageExFeaturesFilter?: string;
  bboxLowerCorner: string;
  bboxUpperCorner: string;
  roadBuffer: number;
  drainageBuffer: number;
  bufferUnit: number;
  areaUnit: number;
  minimumArea: number;
  maskArea: string;
}
/**
 * 
 * 주둔최적지 분석
 */
const DefaultRoadFeaturesLayer = '수송도도로링크';
const DefaultRoadFeaturesFilter = null;
const DefaultSoilFeaturesFilter  = `tpgrp_tpcd IN ('01', '02', '03', '04', '05') OR slant_typ_cd IN ('1', '2', '3')`;
const OptimalStation = () => {
  const analName = 'statistics:OptimalStation';
  const setFilterLayer = useSetRecoilState<FilterLayerProps | null>(FilterLayerState);
  const { register, handleSubmit, formState: { errors, }, setValue, getValues, watch} = useForm<Payload>();
  const {clearCropShape, cropShape, drawType, toggleDrawType, craeteXml, retFilterXml, LIKE_RASTER_LAYER, LIKE_POLYGON_LAYER, LIKE_LINE_LAYER, getConner} = useAnalSpace(analName);
  const {analysisFeatureCollection} = useAnalResult();

  const [vegetationFeaturesFilter, setVegetationFeaturesFilter] = useState<string | null>(DefaultVegetationFeaturesFilter);
  const [soilFeaturesFilter, setSoilFeaturesFilter] = useState<string | null>(DefaultSoilFeaturesFilter);
  const [roadFeaturesFilter, setRoadFeaturesFilter] = useState<string | null>(DefaultRoadFeaturesFilter);
  const [drainageFeaturesFilter, setDrainageFeaturesFilter] = useState<string | null>(DefaultDrainageFeaturesFilter);
  const [drainageExFeaturesFilter, setDrainageExFeaturesFilter] = useState<string | null>(DefaultDrainageFeaturesFilter);
  
  useEffect(() => {
    setValue('slopeCoverage', '경사도래스터');
    setValue('vegetationFeatures', DefaultVegetationFeaturesLayer);
    setValue('soilFeatures', DefaultSoilFeaturesLayer);
    setValue('roadFeatures', DefaultRoadFeaturesLayer);
    setValue('drainageFeatures', DefaultDrainageFeaturesLayer);
    setValue('drainageExFeatures', DefaultDrainageFeaturesLayer);
    setValue('roadBuffer', 300.0);
    setValue('drainageBuffer', 3000.0);
    setValue('minimumArea', 30000.0);
    return () => {
      setFilterLayer(null);
    }
  }, []); 

  const onSubmit: SubmitHandler<Payload> = async () => {
    if (cropShape === null) {
      alert('영역을 그려주주세요.');
      return;
    }

    try {
      const {bboxLowerCorner, bboxUpperCorner} = getConner();
      const layers:AnalLayerInputProps[] = [
        {
          name: 'slopeCoverage',
          type: 'coverage',
          layerName: getValues('slopeCoverage'),
        },
        {
          name: 'vegetationFeatures',
          type: 'feature',
          layerName: getValues('vegetationFeatures'),
          filter: await retFilterXml(vegetationFeaturesFilter,'vegetationFeaturesFilter')
        },
        {
          name: 'soilFeatures',
          type: 'feature',
          layerName: getValues('soilFeatures'),
          filter: await retFilterXml(soilFeaturesFilter,'soilFeatures')
        },
        {
          name: 'roadFeatures',
          type: 'feature',
          layerName: getValues('roadFeatures'),
          filter: await retFilterXml(roadFeaturesFilter,'roadFeaturesFilter')
        },
        {
          name: 'drainageFeatures',
          type: 'feature',
          layerName: getValues('drainageFeatures'),
          filter: await retFilterXml(drainageFeaturesFilter,'drainageFeaturesFilter')
        },
        {
          name: 'drainageExFeatures',
          type: 'feature',
          layerName: getValues('drainageExFeatures'),
          filter: await retFilterXml(drainageExFeaturesFilter,'drainageExFeaturesFilter')
        }
      ];

      const values:AnalValueInputProps[] = [
        {
          name: 'roadBuffer',
          value: getValues('roadBuffer').toString()
        },
        {
          name: 'drainageBuffer',
          value: getValues('drainageBuffer').toString()
        },
        {
          name: 'bufferUnit',
          value: getValues('bufferUnit').toString()
        },
        {
          name: 'areaUnit',
          value: getValues('areaUnit').toString()
        },
        {
          name: 'minimumArea',
          value: getValues('minimumArea').toString()
        }
      ];

      const analReqXml:AnalReqXmlProps = {
        analName,
        maskWkt: cropShape,
        responseType: 'json',
        lowerCorner: bboxLowerCorner,
        upperCorner: bboxUpperCorner,
        layers,
        values
      };
      analysisFeatureCollection({
        xml: craeteXml(analReqXml),
        result: {
          layerName: '주둔최적지 분석',
          changable: true,
          step: ResultLayerStepType.SIMPLIFY,
          type: ResultLayerDataType.Entity,
          fillColor: '#CEA68A',
          fillOpacity: 0.7,
          lineColor: '#FFFFFF',
          lineOpacity: 0,
          isCustom: false
        }
      });
    } catch (e) {
      console.error(e);
    }
      
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="analysisContent width-88">
        <label htmlFor="slopeCoverage">경사도 
          <span className="bullet-essential">*</span>
          <AnalHelp analName="OptimalStation" propName="slopeCoverage"/>
        </label>
        <select 
          id="slopeCoverage" 
          {...register("slopeCoverage")} 
        >
        {
          LIKE_RASTER_LAYER.map((name, idx) => {
            return (
              <option value={name} key={idx}>{name}</option>
            )
          })
        }
        </select>
        <label htmlFor="vegetationFeatures">식생도 
          <span className="bullet-essential">*</span>
          <AnalHelp analName="OptimalStation" propName="vegetationFeatures"/>
        </label>
        <select 
          id="vegetationFeatures" 
          {...register("vegetationFeatures")} 
          onChange={(e) => {
            setFilterLayer(null);
            setValue('vegetationFeatures', e.target.value);
            setVegetationFeaturesFilter(e.target.value === DefaultVegetationFeaturesLayer ? DefaultVegetationFeaturesFilter : null);
          }}
        >
        {
          LIKE_POLYGON_LAYER.map((name, idx) => {
            return (
              <option value={name} key={idx}>{name}</option>
            )
          })
        }
        </select>
        <FilterButton fieldName="식생도" filter={vegetationFeaturesFilter} layerName={watch('vegetationFeatures')} setFilter={setVegetationFeaturesFilter}/>
        <label htmlFor="soilFeatures">토질도 
          <span className="bullet-essential">*</span>
          <AnalHelp analName="OptimalStation" propName="soilFeatures"/>
        </label>
        <select 
          id="soilFeatures" 
          {...register("soilFeatures")} 
          onChange={(e) => {
            setFilterLayer(null);
            setValue('soilFeatures', e.target.value);
            setSoilFeaturesFilter(e.target.value === DefaultSoilFeaturesLayer ? DefaultSoilFeaturesFilter : null);
          }}
        >
        {
          LIKE_POLYGON_LAYER.map((name, idx) => {
            return (
              <option value={name} key={idx}>{name}</option>
            )
          })
        }
        </select>
        <FilterButton fieldName="토질도" filter={soilFeaturesFilter} layerName={watch('soilFeatures')} setFilter={setSoilFeaturesFilter}/>
        <label htmlFor="roadFeatures">수송도 
          <span className="bullet-essential">*</span>
          <AnalHelp analName="OptimalStation" propName="roadFeatures"/>
        </label>
        <select 
          id="roadFeatures" 
          {...register("roadFeatures")} 
          onChange={(e) => {
            setFilterLayer(null);
            setValue('roadFeatures', e.target.value);
            setRoadFeaturesFilter(e.target.value === DefaultRoadFeaturesLayer ? DefaultRoadFeaturesFilter : null);
          }}
        >
        {
          LIKE_LINE_LAYER.map((name, idx) => {
            return (
              <option value={name} key={idx}>{name}</option>
            )
          })
        }
        </select>
        <FilterButton fieldName="수송도" filter={roadFeaturesFilter} layerName={watch('roadFeatures')} setFilter={setRoadFeaturesFilter}/>
        <label htmlFor="roadBuffer">수송도 분석거리 
          <span className="bullet-essential">*</span>
          <AnalHelp analName="OptimalStation" propName="roadBuffer"/>
        </label>
        <input type="number" id="roadBuffer"
            {...register("roadBuffer", {required: '분석반경을 입력해주세요.'})} 
            onChange={(e) => {
              setValue('roadBuffer', Number(e.target.value));
            }}
        />
        <label htmlFor="drainageFeatures">배수도(적합지) 
          <span className="bullet-essential">*</span>
          <AnalHelp analName="OptimalStation" propName="drainageFeatures"/>
        </label>
        <select 
          id="drainageFeatures"
          {...register("drainageFeatures")} 
          onChange={(e) => {
            setFilterLayer(null);
            setValue('drainageFeatures', e.target.value);
            setDrainageFeaturesFilter(e.target.value === DefaultDrainageFeaturesLayer ? DefaultDrainageFeaturesFilter : null);
          }}
        >
        {
          LIKE_POLYGON_LAYER.map((name, idx) => {
            return (
              <option value={name} key={idx}>{name}</option>
            )
          })
        }
        </select>
        <FilterButton fieldName="배수도" filter={drainageFeaturesFilter} layerName={watch('drainageFeatures')} setFilter={setDrainageFeaturesFilter}/>
        <label htmlFor="drainageBuffer">배수도 분석거리
          <span className="bullet-essential">*</span>
          <AnalHelp analName="OptimalStation" propName="drainageBuffer"/>
        </label>
        <input type="number" id="drainageBuffer"
          {...register("drainageBuffer", {required: '분석반경을 입력해주세요.'})} 
          onChange={(e) => {
            setValue('drainageBuffer', Number(e.target.value));
          }}
        />
        <label htmlFor="bufferUnit">분석거리 단위 <AnalHelp analName="OptimalStation" propName="bufferUnit"/></label>
        <select 
          id="bufferUnit" 
          {...register("bufferUnit")} 
        >
          <option value="Meters">Meters</option>
          <option value="Kilometers">Kilometers</option>
          <option value="Inches">Inches</option>
          <option value="Feet">Feet</option>
          <option value="Yards">Yards</option>
          <option value="Miles">Miles</option>
          <option value="NauticalMiles">NauticalMiles</option>
        </select>
        <label htmlFor="drainageExFeatures">배수도 부적합지 
          <span className="bullet-essential">*</span>
          <AnalHelp analName="OptimalStation" propName="drainageExFeatures"/>
        </label>
        <select 
          id="drainageExFeatures" 
          {...register("drainageExFeatures")} 
          onChange={(e) => {
            setFilterLayer(null);
            setValue('drainageExFeatures', e.target.value);
            setDrainageExFeaturesFilter(e.target.value === DefaultDrainageFeaturesLayer ? DefaultDrainageFeaturesFilter : null);
          }}
        >
        {
          LIKE_POLYGON_LAYER.map((name, idx) => {
            return (
              <option value={name} key={idx}>{name}</option>
            )
          })
        }
        </select>
        <FilterButton fieldName="배수도 부적합지" filter={drainageExFeaturesFilter} layerName={watch('drainageExFeatures')} setFilter={setDrainageExFeaturesFilter}/>
        <label htmlFor="minimumArea" style={{fontSize:'9px'}}>배수도(부적합지 최소면적)
          <span className="bullet-essential">*</span>
          <AnalHelp analName="OptimalStation" propName="minimumArea"/>
        </label>
        <input type="number" id="minimumArea"
          {...register("minimumArea", {required: '분석반경을 입력해주세요.'})} 
          onChange={(e) => {
            setValue('minimumArea', Number(e.target.value));
          }}
        />
        <label htmlFor="areaUnit">면적 단위 <AnalHelp analName="OptimalStation" propName="areaUnit"/></label>
        <select 
          id="areaUnit" 
          {...register("areaUnit")} 
        >
          <option value="SquareMeters">SquareMeters</option>
          <option value="SquareKilometers">SquareKilometers</option>
          <option value="SquareFeet">SquareFeet</option>
          <option value="SquareYards">SquareYards</option>
          <option value="SquareMiles">SquareMiles</option>
          <option value="Hectare">Hectare</option>
          <option value="Acre">Acre</option>
        </select>
        <label style={{fontSize:'12px'}}>분석 영역 <AnalHelp analName="OptimalStation" propName="cropShape"/></label>
        <div className="btn-div">
          <button className={`drawBtn circle-icon ${drawType === DrawType.Circle ? 'isDrawingGeometry':''}`} type="button" onClick={()=>{toggleDrawType(DrawType.Circle)}}></button>
          <button className={`drawBtn box-icon ${drawType === DrawType.Box ? 'isDrawingGeometry':''}`} type="button" onClick={()=>{toggleDrawType(DrawType.Box)}}></button>
          <button className={`drawBtn polygon-icon ${drawType === DrawType.Polygon ? 'isDrawingGeometry':''}`} type="button" onClick={()=>{toggleDrawType(DrawType.Polygon)}}></button>
        </div>
        {
          cropShape ? (
            <>
            <label>잘라낼 도형</label>
            <div className="btn-div">
                <div className="coordinate-txt">{cropShape}</div>
                <button className="btn-coordinate-delete" type="button" onClick={clearCropShape}>X</button>
            </div>
            </>
          ) : null
        }
        <div className="btn marginTop-5 clearBoth">
          <button type="submit" className="btn-apply">분석</button>
        </div>
      </div>
    </form>
  )
}   

export default OptimalStation;