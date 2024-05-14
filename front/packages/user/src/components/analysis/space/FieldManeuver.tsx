import { SubmitHandler, useForm } from "react-hook-form";
import { DrawType } from "@/hooks/useAnalGeometryDraw";
import { AnalLayerInputProps, AnalReqXmlProps, useAnalSpace } from "@/hooks/useAnalSpace";
import { DefaultDrainageFeaturesFilter, DefaultDrainageFeaturesLayer, DefaultSoilFeaturesFilter, DefaultSoilFeaturesLayer, DefaultTownFeaturesFilter, DefaultTownFeaturesLayer, DefaultVegetationFeaturesFilter, DefaultVegetationFeaturesLayer, FilterLayerProps, FilterLayerState, ResultLayerDataType, ResultLayerStepType } from "@/recoils/Analysis";
import { useSetRecoilState } from "recoil";
import { useEffect, useState } from 'react';
import FilterButton from "../FilterButton";
import { useAnalResult } from "@/hooks/useAnalResult";
import AnalHelp from "../AnalInfo";

type Payload = {
    slopeCoverage: string;
    vegetationFeatures: string;
    vegetationFeaturesFilter?: string;
    soilFeatures: string;
    soilFeaturesFilter?: string;
    townFeatures: string;
    townFeaturesFilter?: string;
    drainageFeatures: string;
    drainageFeaturesFilter?: string;
    bboxLowerCorner: string;
    bboxUpperCorner: string;
    maskArea: string;
}
/**
 * 
 * 야지기동 분석
 */
const FieldManeuver = () => {
  const analName = 'statistics:FieldManeuver';
  const setFilterLayer = useSetRecoilState<FilterLayerProps | null>(FilterLayerState);
  const { register, handleSubmit, formState: { errors, }, setValue, getValues, watch} = useForm<Payload>();
  const {clearCropShape, cropShape, drawType, toggleDrawType, craeteXml, retFilterXml,LIKE_RASTER_LAYER, LIKE_POLYGON_LAYER, getConner} = useAnalSpace(analName);
  const {analysisFeatureCollection} = useAnalResult();

  const [vegetationFeaturesFilter, setVegetationFeaturesFilter] = useState<string | null>(DefaultVegetationFeaturesFilter);
  const [soilFeaturesFilter, setSoilFeaturesFilter] = useState<string | null>(DefaultSoilFeaturesFilter);
  const [townFeaturesFilter, setTownFeaturesFilter] = useState<string | null>(DefaultTownFeaturesFilter);
  const [drainageFeaturesFilter, setDrainageFeaturesFilter] = useState<string | null>(DefaultDrainageFeaturesFilter);

  useEffect(() => {
    setValue('slopeCoverage', '경사도래스터');
    setValue('vegetationFeatures', DefaultVegetationFeaturesLayer);
    setValue('soilFeatures', DefaultSoilFeaturesLayer);
    setValue('townFeatures', DefaultTownFeaturesLayer);
    setValue('drainageFeatures', DefaultDrainageFeaturesLayer);

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
      ]

      const analReqXml:AnalReqXmlProps = {
        analName,
        maskWkt: cropShape,
        responseType: 'json',
        lowerCorner: bboxLowerCorner,
        upperCorner: bboxUpperCorner,
        layers
      };

      analysisFeatureCollection({
        xml: craeteXml(analReqXml),
        result: {
          layerName: '야지기동 분석',
          changable: true,
          step: ResultLayerStepType.SIMPLIFY,
          type: ResultLayerDataType.Entity,
          fillColor: '#2B312F',
          fillOpacity: 0.7,
          lineColor: '#FFFFFF',
          lineOpacity: 0,
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
          <AnalHelp analName="FieldManeuver" propName="slopeCoverage"/>
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
          <AnalHelp analName="FieldManeuver" propName="vegetationFeatures"/>
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
          <AnalHelp analName="FieldManeuver" propName="soilFeatures"/>
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
          <AnalHelp analName="FieldManeuver" propName="townFeatures"/>
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
          <AnalHelp analName="FieldManeuver" propName="drainageFeatures"/>
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
        <label>분석 영역 <AnalHelp analName="FieldManeuver" propName="cropShape"/></label>
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

export default FieldManeuver;
