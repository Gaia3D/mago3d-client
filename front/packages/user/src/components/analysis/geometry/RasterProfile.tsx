import { colorsYlorrd, getClassBreaks, getClassIndex, sizesYlorrd } from "@/api/util";
import { useGlobeController } from "@/components/providers/GlobeControllerProvider";
import { useAnalResult } from "@/hooks/useAnalResult";
import { RasterProfileResult, ResultLayerDataType, ResultLayerStepType, rasterProfileResultsState } from "@/recoils/Analysis";
import axios from "axios";
import * as Cesium from "cesium";
import { produce } from "immer";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useSetRecoilState } from "recoil";
import AnalHelp from "../AnalInfo";

const requestRasterProfile = (payload:RasterProfilePayload) => {
    const { inputCoverage, userLine, interval } = payload;
    return `<?xml version="1.0" encoding="UTF-8"?><wps:Execute version="1.0.0" service="WPS" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.opengis.net/wps/1.0.0" xmlns:wfs="http://www.opengis.net/wfs" xmlns:wps="http://www.opengis.net/wps/1.0.0" xmlns:ows="http://www.opengis.net/ows/1.1" xmlns:gml="http://www.opengis.net/gml" xmlns:ogc="http://www.opengis.net/ogc" xmlns:wcs="http://www.opengis.net/wcs/1.1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xsi:schemaLocation="http://www.opengis.net/wps/1.0.0 http://schemas.opengis.net/wps/1.0.0/wpsAll.xsd">
    <ows:Identifier>statistics:RasterProfile</ows:Identifier>
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
        <ows:Identifier>userLine</ows:Identifier>
        <wps:Data>
            <wps:ComplexData mimeType="application/wkt"><![CDATA[${userLine}]]></wps:ComplexData>
        </wps:Data>
      </wps:Input>
      <wps:Input>
        <ows:Identifier>interval</ows:Identifier>
        <wps:Data>
          <wps:LiteralData>${interval}</wps:LiteralData>
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

type RasterProfilePayload = {
    inputCoverage: string;
    lowerCorner: string;
    upperCorner: string;
    userLine: string;
    interval?: number;
}

const RasterProfile = () => {
    const {initialized, globeController} = useGlobeController();
    const [userLine, setUserLine] = useState<string | null>(null);
    const LIKE_RASTER_LAYER = ['경사도래스터', '사면향래스터', '속도래스터', '음영기복래스터', '표고래스터', '표고래스터30M'];
    const [isDrawing, setIsDrawing] = useState<boolean>(false);
    const { register, handleSubmit, formState: { errors}} = useForm<RasterProfilePayload>();
    const setRasterProfileResults = useSetRecoilState<RasterProfileResult[]>(rasterProfileResultsState);
    const {analysisFeatureCollection} = useAnalResult();

    useEffect(() => {
      return () => {
        const {analysisDataSource} = globeController;
        analysisDataSource.entities.removeAll();

        setRasterProfileResults([]);
      }
    }, []);

    const clearResultEntityIds = () => {
      setRasterProfileResults([]);
    }
    useEffect(() => {
      if (!initialized) return;

      const { viewer, handler, eventDataSource, analysisDataSource} = globeController;
      if (!viewer) return;      

      const clear = () => {
          const { handler, eventDataSource} = globeController;
          handler?.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
          handler?.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
          handler?.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
          
          eventDataSource.entities.removeAll();
      }
      
      if (!handler || !isDrawing) {
          clear();
          return;
      }
      clearResultEntityIds();

      const labelEntity = eventDataSource.entities.add({
          position: Cesium.Cartesian3.fromDegrees(0, 0),
          label: {
              text: "클릭하여 사용자 라인을 그려주세요.(더블클릭 종료)",
              showBackground: true,
              font: '16px sans-serif',
              backgroundColor: Cesium.Color.fromCssColorString('#000000').withAlpha(0.7),
              horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
              verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
              disableDepthTestDistance: Number.POSITIVE_INFINITY,
          }
      });
      
      const cartesians: Cesium.Cartesian3[] = [];
      eventDataSource.entities.add({
          polyline: {
              positions: new Cesium.CallbackProperty(() => {
                  return cartesians;
              }, false),
              width: 3,
              material: Cesium.Color.CYAN,
              clampToGround: true
          }
      });
      
      handler.setInputAction((movement: Cesium.ScreenSpaceEventHandler.MotionEvent) => {
          const cartesian = globeController.pickPosition(movement.endPosition);
          if (!cartesian) return;
          labelEntity.position = new Cesium.ConstantPositionProperty(cartesian);
          if(cartesians.length === 1) {
              cartesians.push(cartesian);
          } else if (cartesians.length > 1) {
              cartesians[cartesians.length - 1] = cartesian;
          }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
      handler.setInputAction((clicked: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
          const cartesian = globeController.pickPosition(clicked.position);
          if (!cartesian) return;

          if (cartesians.length === 0) {
            analysisDataSource.entities.removeAll();
          }
          cartesians.push(cartesian);
          
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK); 

      handler.setInputAction((clicked: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
          const cartesian = globeController.pickPosition(clicked.position);
          if (!cartesian) return;
          cartesians.push(cartesian);

          analysisDataSource.entities.add({
              polyline: {
                  positions: cartesians,
                  width: 3,
                  material: Cesium.Color.CYAN,
                  clampToGround: true
              }
          });

          setUserLine(`LINESTRING(${cartesians.map((cartesian) => {
              const carto = Cesium.Cartographic.fromCartesian(cartesian);
              return `${Cesium.Math.toDegrees(carto.longitude)} ${Cesium.Math.toDegrees(carto.latitude)}`;
          }).join(', ')})`);

          setIsDrawing(false);
          clear();
      }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

      return () => {
          clear();
      }
    }, [isDrawing]);
    
    const clearUserLine = () => {
      setUserLine(null);
      clearResultEntityIds();
    }
    
    const toggleIsDrawing = () => {
      setIsDrawing(!isDrawing);
    }
    const onSubmit: SubmitHandler<RasterProfilePayload> = async (data) => {
      if (userLine === null) {
          alert('관측자 지점을 선택해주세요.');
          return;
      }
      
      data.userLine = userLine;
      const results:RasterProfileResult[] = [];
      await analysisFeatureCollection({
        xml: requestRasterProfile(data),
        result: {
          layerName: '래스터 단면도 분석',
          changable: false,
          step: ResultLayerStepType.SIMPLIFY,
          type: ResultLayerDataType.Entity,
          isCustom: true,
          customFunction: (data, dataSource) => {
            const {features} = data;

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const values = features.map((feature:any) => feature.properties.value);
            const classBreaks = getClassBreaks(values, colorsYlorrd.length);
            const linePositions:Cesium.Cartesian3[] = [];
            features.forEach((item:any, index:number) => {
              const {geometry, properties} = item;
              const {value} = properties;
              const {coordinates} = geometry;

              const [lng, lat] = coordinates;
              const cartesian = Cesium.Cartesian3.fromDegrees(lng, lat)
              const classIndex = getClassIndex(value, classBreaks);
              
              //const i = classIndex > colorsYlorrd.length - 1? colorsYlorrd.length-1:classIndex-1
              const entity = dataSource.entities.add({
                  position: cartesian,
                  point: {
                      heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                      color: Cesium.Color.fromCssColorString(colorsYlorrd[classIndex]),
                      outlineColor: Cesium.Color.WHITE,
                      outlineWidth: 2,
                      pixelSize: sizesYlorrd[classIndex],
                      disableDepthTestDistance: Number.POSITIVE_INFINITY,
                  }
              });
              linePositions.push(cartesian);
              results.push({
                  id: entity.id,
                  value,
                  index
              });
            });
            dataSource.entities.add({
              polyline: {
                positions: linePositions,
                width: 3,
                material: Cesium.Color.WHITE,
                clampToGround: true
              }
            }); 

            return 1;
          }
        }
      });
      setRasterProfileResults(produce((draft) => {
        draft.length = 0;
        draft.push(...results);
      }));
    }
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
        <div className="analysisContent width-88">
            <label htmlFor="inputCoverage">입력 래스터 레이어 
              <span className="bullet-essential">*</span>
              <AnalHelp analName="RasterProfile" propName="inputCoverage"/>
            </label>
            <select 
                id="inputCoverage" 
                {...register("inputCoverage")} 
                defaultValue="표고래스터"
            >
                {
                    LIKE_RASTER_LAYER.map((name, idx) => {
                      return (
                        <option value={name} key={idx}>{name}</option>
                      )
                    })
                }
            </select>
            <label>라인 지오메트리 <AnalHelp analName="RasterProfile" propName="userLine"/></label>
            <div className="btn-div">
                <button className={`drawBtn ${isDrawing ? 'isDrawing':''}`} type="button" onClick={toggleIsDrawing}>위치선택</button>
            </div>
            {
                userLine ? (
                    <>
                    <label>라인 좌표</label>
                    <div className="btn-div">
                        <div className="coordinate-txt">{userLine}</div>
                        <button className="btn-coordinate-delete" type="button" onClick={clearUserLine}>x</button>
                    </div>
                    </>
                    ) : null
            }
            <label htmlFor="interval">거리 간격 <AnalHelp analName="RasterProfile" propName="interval"/></label>
            <input type="number" id="interval" {...register("interval")} placeholder="" value="50.0"/>
            <div className="btn marginTop-5">
                <button type="submit" className="btn-apply">분석</button>
            </div>
        </div>
        </form>
    )
}   

export default RasterProfile;