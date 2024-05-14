import axios from "axios";
import { SubmitHandler, useForm } from "react-hook-form";
import { useSetRecoilState } from "recoil";
import { DrawType } from "@/hooks/useAnalGeometryDraw";
import { AnalLayerInputProps, AnalReqXmlProps, AnalValueInputProps, useAnalSpace } from "@/hooks/useAnalSpace";
import { DefaultDrainageFeaturesFilter, DefaultDrainageFeaturesLayer, DefaultForestFeaturesLayer, DefaultSoilFeaturesLayer, DefaultTownFeaturesFilter, DefaultTownFeaturesLayer, DefaultVegetationFeaturesFilter, DefaultVegetationFeaturesLayer, FilterLayerProps, FilterLayerState, ResultLayerDataType, ResultLayerStepType } from "@/recoils/Analysis";
import { useEffect, useState } from "react";
import FilterButton from "../FilterButton";
import { useAnalResult } from "@/hooks/useAnalResult";
import AnalHelp from "../AnalInfo";

type Payload = {
  slopeCoverage: string;
  forestFeatures: string;
  forestFeaturesFilter?: string;
  soilFeatures: string;
  soilFeaturesFilter?: string;
  townFeatures: string;
  townFeaturesFilter?: string;
  drainageFeatures: string;
  drainageFeaturesFilter?: string;
  dmzFeatures: string;
  dmzFeaturesFilter?: string;
  bboxLowerCorner: string;
  bboxUpperCorner: string;
  season: string;
  maskArea: string;
}
/**
 * 
 * 적종팀 은거 및 관측 분석
 */
const DefaultDmzFeaturesFilter = null;
const DefaultForestFeaturesFilter = `dnst_cd = 'C' AND dmcls_cd = '2'`;
const DefaultSoilFeaturesFilter  = `tpgrp_tpcd IN ('01', '02', '03', '04', '05') OR slant_typ_cd IN ('1', '2', '3')`;
const EnemyObservation = () => {
  const analName = 'statistics:EnemyObservation';
  const setFilterLayer = useSetRecoilState<FilterLayerProps | null>(FilterLayerState);
  const { register, handleSubmit, formState: { errors, }, setValue, getValues, watch} = useForm<Payload>();
  const {clearCropShape, cropShape, drawType, toggleDrawType, craeteXml, retFilterXml, LIKE_RASTER_LAYER, LIKE_POLYGON_LAYER, LIKE_LINE_LAYER, getConner} = useAnalSpace(analName);
  const {analysisFeatureCollection} = useAnalResult();

  const [forestFeaturesFilter, setForestFeaturesFilter] = useState<string | null>(DefaultForestFeaturesFilter);
  const [soilFeaturesFilter, setSoilFeaturesFilter] = useState<string | null>(DefaultSoilFeaturesFilter);
  const [townFeaturesFilter, setTownFeaturesFilter] = useState<string | null>(DefaultTownFeaturesFilter);
  const [drainageFeaturesFilter, setDrainageFeaturesFilter] = useState<string | null>(DefaultDrainageFeaturesFilter);
  const [dmzFeaturesFilter, setDmzFeaturesFilter] = useState<string | null>(DefaultDmzFeaturesFilter);

  useEffect(() => {
    setValue('slopeCoverage', '경사도래스터');
    setValue('forestFeatures', DefaultForestFeaturesLayer);
    setValue('soilFeatures', DefaultSoilFeaturesLayer);
    setValue('townFeatures', DefaultTownFeaturesLayer);
    setValue('drainageFeatures', DefaultDrainageFeaturesLayer);
    setValue('dmzFeatures', '비무장지대');
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
          name: 'forestFeatures',
          type: 'feature',
          layerName: getValues('forestFeatures'),
          filter: await retFilterXml(forestFeaturesFilter,'forestFeaturesFilter')
        },
        {
          name: 'soilFeatures',
          type: 'feature',
          layerName: getValues('soilFeatures'),
          filter: await retFilterXml(soilFeaturesFilter,'soilFeaturesFilter')
        },
        {
          name: 'townFeatures',
          type: 'feature',
          layerName: getValues('townFeatures'),
          filter: await retFilterXml(townFeaturesFilter,'townFeaturesFilter')
        },
        {
          name: 'drainageFeatures',
          type: 'feature',
          layerName: getValues('drainageFeatures'),
          filter: await retFilterXml(drainageFeaturesFilter,'drainageFeaturesFilter')
        }
        ,
        {
          name: 'dmzFeatures',
          type: 'feature',
          layerName: getValues('dmzFeatures'),
          filter: await retFilterXml(dmzFeaturesFilter,'transFeaturesFilter')
        }
      ]

      const values:AnalValueInputProps[] = [
        {
          name: 'season',
          value: getValues('season')
        }
      ]

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
          layerName: '적종팀 은거 및 관측 분석',
          changable: true,
          step: ResultLayerStepType.SIMPLIFY,
          type: ResultLayerDataType.Entity,
          fillColor: '#F03000',
          fillOpacity: 0.7,
          lineColor: '#F03000',
          lineOpacity: 0.7,
          isCustom: false
        }
      });
    } catch (error) {
      console.error(error);
      alert('분석에 실패하였습니다.');
    }
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="analysisContent width-88">
        <label htmlFor="slopeCoverage">경사도 
          <span className="bullet-essential">*</span>
          <AnalHelp analName="EnemyObservation" propName="slopeCoverage"/>
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
        <label htmlFor="forestFeatures">식생도(산림) 
          <span className="bullet-essential">*</span>
          <AnalHelp analName="EnemyObservation" propName="forestFeatures"/>
        </label>
        <select 
          id="forestFeatures" 
          {...register("forestFeatures")} 
          onChange={(e) => {
            setFilterLayer(null);
            setValue('forestFeatures', e.target.value);
            setForestFeaturesFilter(e.target.value === DefaultForestFeaturesLayer ? DefaultVegetationFeaturesFilter : null);
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
        <FilterButton fieldName="식생도" filter={forestFeaturesFilter} layerName={watch('forestFeatures')} setFilter={setForestFeaturesFilter}/>
        <label htmlFor="soilFeatures">토질도 
          <span className="bullet-essential">*</span>
          <AnalHelp analName="EnemyObservation" propName="soilFeatures"/>
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
        <label htmlFor="townFeatures">도심지 
          <span className="bullet-essential">*</span>
          <AnalHelp analName="EnemyObservation" propName="townFeatures"/>
        </label>
        <select 
          id="townFeatures" 
          {...register("townFeatures")} 
          onChange={(e) => {
            setFilterLayer(null);
            setValue('townFeatures', e.target.value);
            setTownFeaturesFilter(e.target.value === DefaultTownFeaturesLayer ? DefaultTownFeaturesFilter : null);
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
        <FilterButton fieldName="도심지" filter={townFeaturesFilter} layerName={watch('townFeatures')} setFilter={setTownFeaturesFilter}/>
        <label htmlFor="drainageFeatures">배수도 
          <span className="bullet-essential">*</span>
          <AnalHelp analName="EnemyObservation" propName="drainageFeatures"/>
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
        <label htmlFor="dmzFeatures">식생도(DMZ) 
          <span className="bullet-essential">*</span>
          <AnalHelp analName="EnemyObservation" propName="dmzFeatures"/>
        </label>
        <select 
          id="dmzFeatures" 
          {...register("dmzFeatures")} 
          onChange={(e) => {
            setFilterLayer(null);
            setValue('dmzFeatures', e.target.value);
            setDmzFeaturesFilter(e.target.value === '비무장지대' ? DefaultDmzFeaturesFilter : null);
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
        <FilterButton fieldName="식생도(DMZ)" filter={dmzFeaturesFilter} layerName={watch('dmzFeatures')} setFilter={setDmzFeaturesFilter}/>
        <label htmlFor="season">분석계절 <AnalHelp analName="EnemyObservation" propName="season"/></label>
        <select 
          id="season" 
          {...register("season")} 
        >
          <option value="Winter">Winter</option>
          <option value="Summer">Summer</option>
        </select>    
        <label style={{fontSize:'12px'}}>분석 영역 <AnalHelp analName="EnemyObservation" propName="cropShape"/></label>
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

export default EnemyObservation;