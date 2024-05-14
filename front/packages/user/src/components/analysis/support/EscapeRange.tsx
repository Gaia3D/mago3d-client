import * as Cesium from "cesium";
import {SubmitHandler, useForm} from "react-hook-form";
import {useSetRecoilState} from "recoil";
import {DrawType} from "@/hooks/useAnalGeometryDraw";
import {AnalLayerInputProps, AnalReqXmlProps, AnalValueInputProps, useAnalSpace} from "@/hooks/useAnalSpace";
import {FilterLayerProps, FilterLayerState, ResultLayerDataType, ResultLayerStepType} from "@/recoils/Analysis";
import {useEffect, useState} from "react";
import {useAnalPointEntity} from "@/hooks/useAnalPointEntity";
import {useAnalResult} from "@/hooks/useAnalResult";
import AnalHelp from "../AnalInfo";


type Payload = {
    origin: string;
    speedRaster: string;
    radius:number;
    radiusUnit:string;
    weatherFactor:string;
    startTime:number;
    endTime:number;
    bboxLowerCorner: string;
    bboxUpperCorner: string;
    maskArea: string;
}
const EscapeRange = () => {
  const analName = 'statistics:EscapeRange';
  const setFilterLayer = useSetRecoilState<FilterLayerProps | null>(FilterLayerState);
  const { register, handleSubmit, formState: { errors, }, setValue, getValues} = useForm<Payload>();
  const {clearCropShape, cropShape, drawType, toggleDrawType, globeController, craeteXml, LIKE_RASTER_LAYER, getConner} = useAnalSpace(analName);
  const {analysisFeatureCollection} = useAnalResult();
  
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [observerPoint, setObserverPoint] = useState<string | null>(null);
  const [observerEntityId, setObserverEntityId] = useState<string | null>(null);

  useEffect(() => {
    setValue('speedRaster', '속도래스터');
    setValue('radius', 5.0);
    setValue('radiusUnit', 'Kilometers');
    setValue('weatherFactor', 'Normal');
    setValue('startTime', 0);
    setValue('endTime', 30);

    return () => {
      setFilterLayer(null);
    }
  }, []);  

  useAnalPointEntity({
    dependency: isDrawing,
    guideText: '관측자 지점을 선택하세요.',
    
    callback(cartesian3:Cesium.Cartesian3) {
      const {analysisDataSource} = globeController;
      const observerEntity = analysisDataSource.entities.getOrCreateEntity('observerPoint');
      observerEntity.position = new Cesium.ConstantPositionProperty(cartesian3);
      observerEntity.label = new Cesium.LabelGraphics({
        text: '관측자 지점',
        showBackground: true,
        font: '16px sans-serif',
        backgroundColor: Cesium.Color.fromCssColorString('#000000').withAlpha(0.7),
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
      });

      const carto = Cesium.Cartographic.fromCartesian(cartesian3);
      setObserverPoint(`POINT(${Cesium.Math.toDegrees(carto.longitude)} ${Cesium.Math.toDegrees(carto.latitude)})`);
      setIsDrawing(false);
      setObserverEntityId(observerEntity.id);
    },
  });
  const clearPoint = () => {
    setObserverPoint(null);
    const {analysisDataSource} = globeController
    if (observerEntityId) analysisDataSource.entities.removeById(observerEntityId);
    setObserverEntityId(null);
  }
  
  const toggleIsDrawing = () => {
    setIsDrawing(!isDrawing);
  }

  const onSubmit: SubmitHandler<Payload> = async () => {
    if (observerPoint === null) {
        alert('식별 원점을 선택해주세요.');
        return;
    }
    if (cropShape === null) {
        alert('영역을 그려주세요.');
        return;
    }
    try {
      const {bboxLowerCorner, bboxUpperCorner} = getConner();
      const layers:AnalLayerInputProps[] = [
        {
          name: 'speedRaster',
          type: 'coverage',
          layerName: getValues('speedRaster'),
        }
      ]
      const values:AnalValueInputProps[] = [
        {
          name: 'origin',
          value: observerPoint,
          type: 'wkt'
        },
        {
          name: 'radius',
          value: getValues('radius').toString(),
          type: 'literal'
        },
        {
          name: 'radiusUnit',
          value: getValues('radiusUnit'),
          type: 'literal'
        },
        {
          name: 'weatherFactor',
          value: getValues('weatherFactor'),
          type: 'literal'
        },
        {
          name: 'startTime',
          value: getValues('startTime').toString(),
          type: 'literal'
        },
        {
          name: 'endTime',
          value: getValues('endTime').toString(),
          type: 'literal'
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
          layerName: '침투 적 도주 범위 분석',
          changable: true,
          step: ResultLayerStepType.SIMPLIFY,
          type: ResultLayerDataType.Entity,
          fillColor: '#E64021',
          fillOpacity: 0.7,
          lineColor: '#F03000',
          lineOpacity: 0.7,
          isCustom: false
        }
      });

      //#E64021 0.7
    }
    catch (e) {
      console.error(e);
      alert('에러가 발생했습니다.');
    }
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="analysisContent width-88">
        <label>식별 원점 <AnalHelp analName="EscapeRange" propName="observerPoint"/></label>
        <div className="btn-div">
          <button className={`drawBtn ${isDrawing ? 'isDrawing':''}`} type="button" onClick={toggleIsDrawing}>위치선택</button>
        </div>
        {
          observerPoint ? (
          <>
          <label>관측자 좌표</label>
          <div className="btn-div">
            <div className="coordinate-txt">{observerPoint}</div>
            <button className="btn-coordinate-delete" type="button" onClick={clearPoint}>x</button>
          </div>
          </>
          ) : null
        }
        <label htmlFor="speedRaster">도주속도
          <span className="bullet-essential">*</span>
          <AnalHelp analName="EscapeRange" propName="speedRaster"/>
        </label>
        <select 
          id="speedRaster" 
          {...register("speedRaster")}
        >
        {
          LIKE_RASTER_LAYER.map((name, idx) => {
            return (
              <option value={name} key={idx}>{name}</option>
            )
          })
        }
        </select>
        <label htmlFor="radius">분석반경
          <span className="bullet-essential">*</span>
          <AnalHelp analName="EscapeRange" propName="radius"/>
        </label>
        <input type="number" id="radius"
          {...register("radius", {required: '분석반경을 입력해주세요.'})} 
        />
        <label htmlFor="radiusUnit">분석반경 단위 <AnalHelp analName="EscapeRange" propName="radiusUnit"/></label>
        <select 
          id="radiusUnit" 
          {...register("radiusUnit")} 
        >
          <option value="Meters">Meters</option>
          <option value="Kilometers">Kilometers</option>
          <option value="Inches">Inches</option>
          <option value="Feet">Feet</option>
          <option value="Yards">Yards</option>
          <option value="Miles">Miles</option>
          <option value="NauticalMiles">NauticalMiles</option>
        </select>
        <label htmlFor="weatherFactor">기상지연 계수 <AnalHelp analName="EscapeRange" propName="weatherFactor"/></label>
        <select 
          id="weatherFactor" 
          {...register("weatherFactor")} 
        >
          <option value="Normal">Normal</option>
          <option value="Foggy">Foggy</option>
          <option value="Rainy">Rainy</option>
          <option value="Night">Night</option>
        </select>
        <label htmlFor="startTime">시작 시간(분)
          <span className="bullet-essential">*</span>
          <AnalHelp analName="EscapeRange" propName="startTime"/>
        </label>
        <input type="number" id="startTime"
          {...register("startTime")} 
        />
        <label htmlFor="endTime">종료 시간(분)
          <span className="bullet-essential">*</span>
          <AnalHelp analName="EscapeRange" propName="endTime"/>
        </label>
        <input type="number" id="endTime"
          {...register("endTime")} 
        />
        <label style={{fontSize:'12px'}}>분석 영역 <AnalHelp analName="EscapeRange" propName="cropShape"/></label>
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

export default EscapeRange;