import axios from "axios";
import { SubmitHandler, useForm } from "react-hook-form";
import { useSetRecoilState } from "recoil";
import { DrawType } from "@/hooks/useAnalGeometryDraw";
import { AnalLayerInputProps, AnalReqXmlProps, AnalValueInputProps, useAnalSpace } from "@/hooks/useAnalSpace";
import { DefaultDrainageFeaturesFilter, DefaultDrainageFeaturesLayer, DefaultForestFeaturesFilter, DefaultForestFeaturesLayer, DefaultSoilFeaturesFilter, DefaultTownFeaturesFilter, DefaultTownFeaturesLayer, DefaultVegetationFeaturesFilter, DefaultVegetationFeaturesLayer, FilterLayerProps, FilterLayerState, ResultLayerDataType, ResultLayerStepType } from "@/recoils/Analysis";
import { useEffect, useState } from "react";
import FilterButton from "../FilterButton";
import { useAnalResult } from "@/hooks/useAnalResult";
import AnalHelp from "../AnalInfo";

type Payload = {
  slopeCoverage: string;
  vegetationFeatures: string;
  vegetationFeaturesFilter?: string;
  forestFeatures: string;
  forestFeaturesFilter?: string;
  townFeatures: string;
  townFeaturesFilter?: string;
  drainageFeatures: string;
  drainageFeaturesFilter?: string;
  transFeatures: string;
  transFeaturesFilter?: string;
  bboxLowerCorner: string;
  bboxUpperCorner: string;
  maskArea: string;
  distance: number;
  distanceUnit: string;
}

/**
 * 
 * 공중침투 분석
 */
const DefaultTransFeaturesFilter = null;
const Penetration = () => {
  const analName = 'statistics:Penetration';
  const setFilterLayer = useSetRecoilState<FilterLayerProps | null>(FilterLayerState);
  const { register, handleSubmit, formState: { errors, }, setValue, getValues, watch} = useForm<Payload>();
  const {clearCropShape, cropShape, drawType, toggleDrawType, craeteXml, retFilterXml, LIKE_RASTER_LAYER, LIKE_POLYGON_LAYER, LIKE_LINE_LAYER, getConner} = useAnalSpace(analName);
  const {analysisFeatureCollection} = useAnalResult();

  const [vegetationFeaturesFilter, setVegetationFeaturesFilter] = useState<string | null>(DefaultVegetationFeaturesFilter);
  const [forestFeaturesFilter, setForestFeaturesFilter] = useState<string | null>(DefaultForestFeaturesFilter);
  const [townFeaturesFilter, setTownFeaturesFilter] = useState<string | null>(DefaultTownFeaturesFilter);
  const [drainageFeaturesFilter, setDrainageFeaturesFilter] = useState<string | null>(DefaultDrainageFeaturesFilter);
  const [transFeaturesFilter, setTransFeaturesFilter] = useState<string | null>(DefaultTransFeaturesFilter);

  useEffect(() => {
    setValue('distance', 100.0);
    setValue('slopeCoverage', '경사도래스터');
    setValue('vegetationFeatures', DefaultVegetationFeaturesLayer);
    setValue('forestFeatures', DefaultForestFeaturesLayer);
    setValue('townFeatures', DefaultTownFeaturesLayer);
    setValue('drainageFeatures', DefaultDrainageFeaturesLayer);
    setValue('transFeatures', '송전선');
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
          name: 'forestFeatures',
          type: 'feature',
          layerName: getValues('forestFeatures'),
          filter: await retFilterXml(forestFeaturesFilter,'forestFeaturesFilter')
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
          name: 'transFeatures',
          type: 'feature',
          layerName: getValues('transFeatures'),
          filter: await retFilterXml(transFeaturesFilter,'transFeaturesFilter')
        }
      ]

      const values:AnalValueInputProps[] = [
        {
          name: 'distance',
          value: getValues('distance').toString()
        },
        {
          name: 'distanceUnit',
          value: getValues('distanceUnit')
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
          layerName: '공중침투 분석',
          changable: true,
          step: ResultLayerStepType.SIMPLIFY,
          type: ResultLayerDataType.Entity,
          fillColor: '#EB6D69',
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
          <AnalHelp analName="Penetration" propName="slopeCoverage"/>
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
          <AnalHelp analName="Penetration" propName="vegetationFeatures"/>
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
        <label htmlFor="forestFeatures">식생도(산림)
          <span className="bullet-essential">*</span>
          <AnalHelp analName="Penetration" propName="forestFeatures"/>
        </label>
        <select 
          id="forestFeatures" 
          {...register("forestFeatures")}
          onChange={(e) => {
            setFilterLayer(null);
            setValue('forestFeatures', e.target.value);
            setForestFeaturesFilter(e.target.value === DefaultForestFeaturesLayer ? DefaultForestFeaturesLayer : null);
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
        <FilterButton fieldName="식생도(산림)" filter={forestFeaturesFilter} layerName={watch('forestFeatures')} setFilter={setForestFeaturesFilter}/>
        <label htmlFor="townFeatures">도심지
          <span className="bullet-essential">*</span>
          <AnalHelp analName="Penetration" propName="townFeatures"/>
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
          <AnalHelp analName="Penetration" propName="drainageFeatures"/>
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
        <label htmlFor="transFeatures">송전선
          <span className="bullet-essential">*</span>
          <AnalHelp analName="Penetration" propName="transFeatures"/>
        </label>
        <select 
          id="transFeatures" 
          {...register("transFeatures")}
          onChange={(e) => {
            setFilterLayer(null);
            setValue('transFeatures', e.target.value);
            setTransFeaturesFilter(e.target.value === '송전선' ? DefaultTransFeaturesFilter : null);
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
        <FilterButton fieldName="송전선" filter={transFeaturesFilter} layerName={watch('transFeatures')} setFilter={setTransFeaturesFilter}/>
        <label htmlFor="distance">송전선 버퍼거리
          <span className="bullet-essential">*</span>
          <AnalHelp analName="Penetration" propName="distance"/>
        </label>
        <input type="number" id="distance"
          {...register("distance", {required: '분석반경을 입력해주세요.'})} 
          onChange={(e) => {
            setValue('distance', Number(e.target.value));
          }}
        />
        <label htmlFor="distanceUnit">거리 단위 <AnalHelp analName="Penetration" propName="distanceUnit"/></label>
        <select 
          id="distanceUnit" 
          {...register("distanceUnit")} 
        >
          <option value="Meters">Meters</option>
          <option value="Kilometers">Kilometers</option>
          <option value="Inches">Inches</option>
          <option value="Feet">Feet</option>
          <option value="Yards">Yards</option>
          <option value="Miles">Miles</option>
          <option value="NauticalMiles">NauticalMiles</option>
        </select>
        <label>분석 영역 <AnalHelp analName="Penetration" propName="cropShape"/></label>
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

export default Penetration;