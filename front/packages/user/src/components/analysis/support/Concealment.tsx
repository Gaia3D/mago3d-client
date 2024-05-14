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
    forestFeatures: string;
    goodFilter: string;
    normalFilter: string;
    poorFilter: string;
    bboxLowerCorner: string;
    bboxUpperCorner: string;
    maskArea: string;
}
const DefaultGoodFilter = `koftr_group_cd IN ('11', '14', '60', '66') AND dnst_cd = 'C'`;
const DefaultNormalFilter = `dnst_cd IN ('A', 'B', 'C') AND dnst_cd = 'B'`;
const DefaultPoorFilter = `storunst_cd ='0' AND dnst_cd = 'A'`;
const Concealment = () => {
  const analName = 'statistics:Concealment';
  const setFilterLayer = useSetRecoilState<FilterLayerProps | null>(FilterLayerState);
  const { register, handleSubmit, formState: { errors, }, setValue, getValues, watch} = useForm<Payload>();
  const {clearCropShape, cropShape, drawType, toggleDrawType, craeteXml, retFilterXml, LIKE_POLYGON_LAYER, getConner} = useAnalSpace(analName);
  const {analysisFeatureCollection} = useAnalResult();

  const [goodFilter, setGoodFilter] = useState<string | null>(DefaultGoodFilter);
  const [normalFilter, setNormalFilter] = useState<string | null>(DefaultNormalFilter);
  const [poorFilter, setPoorFilter] = useState<string | null>(DefaultPoorFilter);
  
  useEffect(() => {
    setValue('forestFeatures', DefaultForestFeaturesLayer);
    setValue('goodFilter', DefaultGoodFilter);
    setValue('normalFilter', DefaultNormalFilter);
    setValue('poorFilter', DefaultPoorFilter);
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
          name: 'forestFeatures',
          type: 'feature',
          layerName: getValues('forestFeatures'),
        }
      ]

      const values:AnalValueInputProps[] = [
        {
          name: 'goodFilter',
          value: getValues('goodFilter'),
          type: 'cql'
        },
        {
          name: 'normalFilter',
          value: getValues('normalFilter'),
          type: 'cql'
        },
        {
          name: 'poorFilter',
          value: getValues('poorFilter'),
          type: 'cql'
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
          layerName: '은폐 분석',
          changable: true,
          step: ResultLayerStepType.SIMPLIFY,
          type: ResultLayerDataType.Entity,
          fillColor: '#323232',
          fillOpacity: 0.7,
          lineColor: '#F03000',
          lineOpacity: 0.7,
          isCustom: false
        }
      });

      //#323232 미분류
      //#4CE600 양호
      //#F5FF7A 보통

    } catch (error) {
      console.error(error);
      alert('분석에 실패하였습니다.');
    }
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="analysisContent width-88">
        <label htmlFor="forestFeatures">식생도(산림)
          <span className="bullet-essential">*</span>
          <AnalHelp analName="Concealment" propName="forestFeatures"/>
        </label>
        <select 
          id="forestFeatures" 
          {...register("forestFeatures")} 
        >
        {
          LIKE_POLYGON_LAYER.map((name, idx) => {
            return (
              <option value={name} key={idx}>{name}</option>
            )
          })
        }
        </select>
        <label htmlFor="distance">양호 조건식
          <span className="bullet-essential">*</span>
          <AnalHelp analName="Concealment" propName="goodFilter"/>
        </label>
        <input type="text" id="goodFilter"
          {...register("goodFilter", {required: '양호 조건식을 입력해주세요.'})}
          value={goodFilter ?? ''}
          onChange={(e) => {
            setValue('goodFilter', e.target.value);
            setGoodFilter(e.target.value);
          }}
        />
        <FilterButton fieldName="양호 조건식" filter={goodFilter} layerName={DefaultForestFeaturesLayer} setFilter={setGoodFilter}/>
        <label htmlFor="normalFilter">보통 조건식
          <span className="bullet-essential">*</span>
          <AnalHelp analName="Concealment" propName="normalFilter"/>
        </label>
        <input type="text" id="normalFilter"
          {...register("normalFilter", {required: '보통 조건식을 입력해주세요.'})}
          value={normalFilter ?? ''}
          onChange={(e) => {
            setValue('normalFilter', e.target.value);
            setNormalFilter(e.target.value);
          }}
        />
        <FilterButton fieldName="보통 조건식" filter={normalFilter} layerName={DefaultForestFeaturesLayer} setFilter={setNormalFilter}/>
        <label htmlFor="poorFilter">불량 조건식
          <span className="bullet-essential">*</span>
          <AnalHelp analName="Concealment" propName="poorFilter"/>
        </label>
        <input type="text" id="poorFilter"
          {...register("poorFilter", {required: '불량 조건식을 입력해주세요.'})}
          value={poorFilter ?? ''}
          onChange={(e) => {
            setValue('poorFilter', e.target.value);
            setPoorFilter(e.target.value);
          }}
        />
        <FilterButton fieldName="불량 조건식" filter={poorFilter} layerName={DefaultForestFeaturesLayer} setFilter={setPoorFilter}/>
        <label style={{fontSize:'12px'}}>분석 영역 <AnalHelp analName="Concealment" propName="cropShape"/></label>
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
        <div className="btn marginTop-5">
          <button type="submit" className="btn-apply">분석</button>
        </div>
      </div>
    </form>
  )
}   

export default Concealment;