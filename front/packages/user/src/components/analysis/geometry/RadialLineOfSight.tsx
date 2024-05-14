import { Coordinate } from "@/api/Coordinate";
import { useGlobeController } from "@/components/providers/GlobeControllerProvider";
import { useAnalPointEntity } from "@/hooks/useAnalPointEntity";
import { useAnalResult } from "@/hooks/useAnalResult";
import { useAnalSpace } from "@/hooks/useAnalSpace";
import { AnalysisLayer, ResultLayerDataType, ResultLayerStepType } from "@/recoils/Analysis";
import axios from "axios";
import * as Cesium from "cesium";
import { useEffect, useState } from "react";
import { SubmitHandler, set, useForm } from "react-hook-form";
import { useRecoilState, useRecoilValue } from "recoil";
import AnalHelp from "../AnalInfo";

const requestRadialLineOfSight = (payload:RadialLineOfSightPayload) => {
    const { inputCoverage, observerPoint, observerOffset, radius, sides, useCurvature, useRefraction, refractionFactor } = payload;
    return `<?xml version="1.0" encoding="UTF-8"?><wps:Execute version="1.0.0" service="WPS" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.opengis.net/wps/1.0.0" xmlns:wfs="http://www.opengis.net/wfs" xmlns:wps="http://www.opengis.net/wps/1.0.0" xmlns:ows="http://www.opengis.net/ows/1.1" xmlns:gml="http://www.opengis.net/gml" xmlns:ogc="http://www.opengis.net/ogc" xmlns:wcs="http://www.opengis.net/wcs/1.1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xsi:schemaLocation="http://www.opengis.net/wps/1.0.0 http://schemas.opengis.net/wps/1.0.0/wpsAll.xsd">
    <ows:Identifier>statistics:RadialLineOfSight</ows:Identifier>
    <wps:DataInputs>
      <wps:Input>
        <ows:Identifier>inputCoverage</ows:Identifier>
        <wps:Reference mimeType="image/tiff" xlink:href="http://geoserver/wcs" method="POST">
          <wps:Body>
            <wcs:GetCoverage service="WCS" version="1.1.1">
              <ows:Identifier>mdtp:${inputCoverage}</ows:Identifier>
              <wcs:DomainSubset />
              <wcs:Output format="image/tiff"/>
            </wcs:GetCoverage>
          </wps:Body>
        </wps:Reference>
      </wps:Input>
      <wps:Input>
        <ows:Identifier>observerPoint</ows:Identifier>
        <wps:Data>
            <wps:ComplexData mimeType="application/wkt"><![CDATA[${observerPoint}]]></wps:ComplexData>
        </wps:Data>
      </wps:Input>
      <wps:Input>
        <ows:Identifier>observerOffset</ows:Identifier>
        <wps:Data>
          <wps:LiteralData>${observerOffset}</wps:LiteralData>
        </wps:Data>
      </wps:Input>
      <wps:Input>
        <ows:Identifier>radius</ows:Identifier>
        <wps:Data>
          <wps:LiteralData>${radius}</wps:LiteralData>
        </wps:Data>
      </wps:Input>
      <wps:Input>
        <ows:Identifier>sides</ows:Identifier>
        <wps:Data>
          <wps:LiteralData>${sides}</wps:LiteralData>
        </wps:Data>
      </wps:Input>
      <wps:Input>
        <ows:Identifier>useCurvature</ows:Identifier>
        <wps:Data>
          <wps:LiteralData>${useCurvature}</wps:LiteralData>
        </wps:Data>
      </wps:Input>
      <wps:Input>
        <ows:Identifier>useRefraction</ows:Identifier>
        <wps:Data>
          <wps:LiteralData>${useRefraction}</wps:LiteralData>
        </wps:Data>
      </wps:Input>
      <wps:Input>
        <ows:Identifier>refractionFactor</ows:Identifier>
        <wps:Data>
          <wps:LiteralData>${refractionFactor}</wps:LiteralData>
        </wps:Data>
      </wps:Input>
    </wps:DataInputs>
    <wps:ResponseForm>
      <wps:RawDataOutput mimeType="application/json">
        <ows:Identifier>result</ows:Identifier>
      </wps:RawDataOutput>
    </wps:ResponseForm>
  </wps:Execute>`
}

type RadialLineOfSightPayload = {
    inputCoverage: string;
    observerPoint: string;
    observerOffset: number;
    radius?: number;
    sides?: number;
    useCurvature?: boolean;
    useRefraction?: boolean;
    refractionFactor?: number;
}

const RadialLineOfSight = () => {
  const {initialized, globeController} = useGlobeController();
  const LIKE_RASTER_LAYER = ['경사도래스터', '사면향래스터', '속도래스터', '음영기복래스터', '표고래스터', '표고래스터30M'];
  const [observerPoint, setObserverPoint] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [observerEntityId, setObserverEntityId] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors}} = useForm<RadialLineOfSightPayload>();
  const {analysisFeatureCollection} = useAnalResult();

  useEffect(() => {
    return () => {
      const {analysisDataSource} = globeController;
      analysisDataSource.entities.removeAll();
    }
  }, []);

  useAnalPointEntity({
    dependency: isDrawing,
    guideText: '관측자 지점을 선택하세요.',
    
    callback(cartesian3:Cesium.Cartesian3) {
      const {analysisDataSource} = globeController;
      analysisDataSource.entities.removeAll();
      const observerEntity = analysisDataSource.entities.add({
        position: cartesian3,
        label: {
          text: '관측자 지점',
          showBackground: true,
          font: '16px sans-serif',
          backgroundColor: Cesium.Color.fromCssColorString('#000000').withAlpha(0.7),
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
        }
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
  const onSubmit: SubmitHandler<RadialLineOfSightPayload> = async (data) => {
    if (observerPoint === null) {
        alert('관측자 지점을 선택해주세요.');
        return;
    }

    data.observerPoint = observerPoint;

    analysisFeatureCollection({
      xml: requestRadialLineOfSight(data),
      result: {
        layerName: '방사형 가시선 분석',
        changable: false,
        step: ResultLayerStepType.SIMPLIFY,
        type: ResultLayerDataType.Entity,
        isCustom: true,
        customFunction: (data, dataSource) => {
          const {features} = data;
          
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const entities = features.map((item:any) => {
              const {geometry, properties} = item;
              const {Visible} = properties;
              const {coordinates} = geometry;
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const cartesians = coordinates[0].map((coordinate:any) => {
                  const [lng, lat] = coordinate;
                  return Cesium.Cartesian3.fromDegrees(lng, lat);
              });

              //const {analysisDataSource} = globeController;
              return dataSource.entities.add({
                  corridor: {
                      heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                      positions: cartesians,
                      width: 3,
                      material: Visible === 1 ? Cesium.Color.fromCssColorString('rgb(0, 255, 0, 1)') : Cesium.Color.fromCssColorString('rgb(255, 0, 0, 1)'),
                  }
              });
          });
          return entities.length;
        }
      }
    });
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="analysisContent width-88">
        <label htmlFor="inputCoverage">입력 래스터 레이어 
          <AnalHelp analName="RadialLineOfSight" propName="inputCoverage"/>
          <span className="bullet-essential">*</span>
        </label>
        <select 
          id="inputCoverage" 
          {...register("inputCoverage")}
          defaultValue='표고래스터'
        >
        {
          LIKE_RASTER_LAYER.map((name, idx) => {
            return (
              <option value={name} key={idx}>{name}</option>
            )
          })
        }
        </select>
        <label>관측자 지점<AnalHelp analName="RadialLineOfSight" propName="observerPoint"/></label>
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
        <label htmlFor="observerOffset">관측자 지점의 높이 
          <span className="bullet-essential">*</span>
          <AnalHelp analName="RadialLineOfSight" propName="observerOffset"/>
        </label>
        <input type="number" id="observerOffset" 
          {...register("observerOffset", {required: '관측자 지점의 높이를 입력해주세요.'})} 
          placeholder="" 
          value="1.7" 
        />
        <label htmlFor="radius">분석반경(m) 
          <span className="bullet-essential">*</span>
          <AnalHelp analName="RadialLineOfSight" propName="radius"/>
        </label>
        <input type="number" id="radius"
          {...register("radius", {required: '분석반경을 입력해주세요.'})} 
          value="5000.0"
        />
        <label htmlFor="sides">가시선 수 
          <AnalHelp analName="RadialLineOfSight" propName="sides"/>
        </label>
        <input type="number" id="sides" 
          {...register("sides")}  
          value="180"
        />
        <label htmlFor="useCurvature">지표 곡률 고려 <AnalHelp analName="RadialLineOfSight" propName="useCurvature"/> </label>
        <select id="useCurvature" {...register("useCurvature")} defaultValue={'false'}>
          <option value="true">예</option>
          <option value="false">아니오</option>
        </select>
        <label htmlFor="useRefraction">대기 굴절 고려 <AnalHelp analName="RadialLineOfSight" propName="useRefraction"/> </label>
        <select id="useRefraction" {...register("useRefraction")} defaultValue={'false'}>
          <option value="true">예</option>
          <option value="false">아니오</option>
        </select>
        <label htmlFor="refractionFactor">굴절 계수 <AnalHelp analName="RadialLineOfSight" propName="refractionFactor"/> </label>
        <input type="number" id="refractionFactor" {...register("refractionFactor")} placeholder="" value="0.13"/>
        <div className="btn clearBoth marginTop-5">
          <button type="submit" className="btn-apply">분석</button>
        </div>
      </div>
      </form>
  )
}   

export default RadialLineOfSight;