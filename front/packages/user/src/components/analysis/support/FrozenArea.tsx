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
  roadFeatures: string;
  roadFeaturesFilter?: string;
  aspectCoverage: string;
  hillshadeCoverage: string;
  bboxLowerCorner: string;
  bboxUpperCorner: string;
  distance: number;
  distanceUnit: string;
  maskArea: string;
}

const DefaultRoadFeaturesFilter = null;
const FrozenArea = () => {
  const analName = 'statistics:FrozenArea';
  const setFilterLayer = useSetRecoilState<FilterLayerProps | null>(FilterLayerState);
  const { register, handleSubmit, formState: { errors, }, setValue, getValues, watch} = useForm<Payload>();
  const {clearCropShape, cropShape, drawType, toggleDrawType, craeteXml, retFilterXml, LIKE_RASTER_LAYER, LIKE_POLYGON_LAYER, LIKE_LINE_LAYER, getConner} = useAnalSpace(analName);
  const {analysisFeatureCollection} = useAnalResult();

  const [roadFeaturesFilter, setRoadFeaturesFilter] = useState<string | null>(DefaultRoadFeaturesFilter);

  useEffect(() => {
    setValue('distance', 30.0);
    setValue('roadFeatures', '수송도도로링크');
    setValue('slopeCoverage', '경사도래스터');
    setValue('aspectCoverage', '사면향래스터');
    setValue('hillshadeCoverage', '음영기복래스터');
    
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
            name: 'roadFeatures',
            type: 'feature',
            layerName: getValues('roadFeatures'),
            filter: await retFilterXml(roadFeaturesFilter,'roadFeaturesFilter')
          },
          {
            name: 'aspectCoverage',
            type: 'coverage',
            layerName: getValues('aspectCoverage')
          },
          {
            name: 'hillshadeCoverage',
            type: 'coverage',
            layerName: getValues('hillshadeCoverage')
          },
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
            layerName: '상습 결빙지역 분석',
            changable: true,
            step: ResultLayerStepType.SIMPLIFY,
            type: ResultLayerDataType.Entity,
            fillColor: '#0070FF',
            fillOpacity: 0.7,
            lineColor: '#F03000',
            lineOpacity: 0.7,
            isCustom: false
          }
        });

        //#0070FF 0.7
          
      } catch (error) {
        console.error(error);
        alert('분석에 실패하였습니다.');
      }
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="analysisContent width-88">
        <label htmlFor="roadFeatures">수송도 
          <span className="bullet-essential">*</span>
          <AnalHelp analName="FrozenArea" propName="roadFeatures"/>
        </label>
        <select 
          id="roadFeatures" 
          {...register("roadFeatures")} 
          onChange={(e) => {
            setFilterLayer(null);
            setValue('roadFeatures', e.target.value);
            setRoadFeaturesFilter(e.target.value === '수송도도로링크' ? DefaultRoadFeaturesFilter : null);
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
        <label htmlFor="distance">수송도 분석거리 
          <span className="bullet-essential">*</span>
          <AnalHelp analName="FrozenArea" propName="distance"/>
        </label>
        <input type="number" id="distance"
          {...register("distance", {required: '분석거리를 입력해주세요.'})}
          onChange={(e) => {
            setValue('distance', Number(e.target.value));
          }}
        />
        <label htmlFor="distanceUnit">분석거리 단위 <AnalHelp analName="FrozenArea" propName="distanceUnit"/></label>
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
        <label htmlFor="slopeCoverage">경사도
          <span className="bullet-essential">*</span>
          <AnalHelp analName="FrozenArea" propName="slopeCoverage"/>
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
        <label htmlFor="aspectCoverage">사면향  
          <span className="bullet-essential">*</span>
          <AnalHelp analName="FrozenArea" propName="aspectCoverage"/>
        </label>
        <select 
          id="aspectCoverage" 
          {...register("aspectCoverage")} 
        >
        {
          LIKE_RASTER_LAYER.map((name, idx) => {
            return (
              <option value={name} key={idx}>{name}</option>
            )
          })
        }
        </select>
        <label htmlFor="hillshadeCoverage">음영 
          <span className="bullet-essential">*</span>
          <AnalHelp analName="FrozenArea" propName="hillshadeCoverage"/>
        </label>
        <select 
          id="hillshadeCoverage" 
          {...register("hillshadeCoverage")} 
        >
        {
          LIKE_RASTER_LAYER.map((name, idx) => {
            return (
              <option value={name} key={idx}>{name}</option>
            )
          })
        }
        </select>
        <label style={{fontSize:'12px'}}>분석 영역 <AnalHelp analName="FrozenArea" propName="cropShape"/></label>
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
        <div className="btn clearBoth marginTop-5">
          <button type="submit" className="btn-apply">분석</button>
        </div>
      </div>
    </form>
  )
}   

export default FrozenArea;