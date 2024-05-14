import { useGlobeController } from "@/components/providers/GlobeControllerProvider";
import { useAnalPointEntity } from "@/hooks/useAnalPointEntity";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Feature, point, toMercator, toWgs84} from "@turf/turf";
import * as Cesium from "cesium";
import blueFlag from '@/assets/start.png';
import redFlag from '@/assets/end.png';
import axios from "axios";
import { produce } from "immer";
import { useAnalResult } from "@/hooks/useAnalResult";
import { ResultLayerDataType, ResultLayerStepType } from "@/recoils/Analysis";
import AnalHelp from "../AnalInfo";

type PathAnalysisPayload = {
    analysisPosition: 'south' | 'north';
    pathType: 'true' | 'false';
    startPoint: string;
    endPoint: string;
}

const getMercator = (carto:Cesium.Cartographic) => {
    const degrees = [Cesium.Math.toDegrees(carto.longitude),Cesium.Math.toDegrees(carto.latitude)];
    const pt = point(degrees);
    const mercator = toMercator(pt);

    return mercator.geometry.coordinates;
}

const getWgs84 = (xy:number[]) => {
    const [x, y] = xy;
    const pt = point([x, y]);
    const wgs84 = toWgs84(pt);

    return wgs84.geometry.coordinates;
}

const PathAnalysis = () => {
    const analKorName = '경로분석'
    const {initialized, globeController} = useGlobeController();
    const {setloading, getOrCreateDataSource, setResultLayers} = useAnalResult();
    const [startPoint, setStartPoint] = useState<string | null>(null);
    const [endPoint, setEndPoint] = useState<string | null>(null);
    const [startEntityId, setStartEntityId] = useState<string | null>(null);
    const [endEntityId, setEndEntityId] = useState<string | null>(null);
    const [isStartDrawing, setIsStartDrawing] = useState<boolean>(false);
    const [isEndDrawing, setIsEndDrawing] = useState<boolean>(false);
    const [nodes, setNodes] = useState<string[]>([]);
    const [distance, setDistance] = useState<string | null>(null);
    const [spendTime, setSpendTime] = useState<string | null>(null);
    const { register, handleSubmit, formState: { errors}} = useForm<PathAnalysisPayload>();

    useEffect(() => {
        return () => {
            setNodes([]);
            setDistance(null);
            setSpendTime(null);
        }
    }, []);

    useAnalPointEntity({
        dependency: isStartDrawing,
        guideText: '출발 지점을 선택하세요.',
        
        callback(cartesian3:Cesium.Cartesian3) {
            const {analysisDataSource} = globeController;
            if (startEntityId) analysisDataSource.entities.removeById(startEntityId);
            const observerEntity = analysisDataSource.entities.add({
                position: cartesian3,
                billboard: {
                    image: blueFlag,
                    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                    disableDepthTestDistance: Number.POSITIVE_INFINITY,
                    /* scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1.5, 1.5e6, 0.1), */
                }
            });
            const mercator = getMercator(Cesium.Cartographic.fromCartesian(cartesian3));
            setStartPoint(`${mercator.join(',')}`);
            setIsStartDrawing(false);
            setStartEntityId(observerEntity.id);
        },
    });
    useAnalPointEntity({
        dependency: isEndDrawing,
        guideText: '도착 지점을 선택하세요.',
        
        callback(cartesian3:Cesium.Cartesian3) {
            const {analysisDataSource} = globeController;
            if (endEntityId) analysisDataSource.entities.removeById(endEntityId);
            const targetEntity = analysisDataSource.entities.add({
                position: cartesian3,
                billboard: {
                    image: redFlag,
                    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                    verticalOrigin: Cesium.VerticalOrigin.TOP,
                    disableDepthTestDistance: Number.POSITIVE_INFINITY,
                }
            });
            
            const mercator = getMercator(Cesium.Cartographic.fromCartesian(cartesian3));
            setEndPoint(`${mercator.join(',')}`);
            setIsEndDrawing(false);
            setEndEntityId(targetEntity.id);
        },
    });

    const toggleIsStartDrawing = () => {
        setIsEndDrawing(false);
        setIsStartDrawing(!isStartDrawing);
    }

    const toggleIsEndDrawing = () => {
        setIsStartDrawing(false);
        setIsEndDrawing(!isEndDrawing);
    }

    const clearStartPoint = () => {
        setStartPoint(null);
        const {analysisDataSource} = globeController
        if (startEntityId) analysisDataSource.entities.removeById(startEntityId);
        setStartEntityId(null);
    }
    const clearEndPoint = () => {
        setEndPoint(null);
        const {analysisDataSource} = globeController
        if (endEntityId) analysisDataSource.entities.removeById(endEntityId);
        setEndEntityId(null);
    }

    const onSubmit: SubmitHandler<PathAnalysisPayload> = async (data) => {
        if (startPoint === null) {
            alert('출발 지점을 선택해주세요.');
            return;
        }

        if (endPoint === null) {
            alert('도착 지점을 선택해주세요.');
            return;
        }

        const {analysisPosition, pathType} = data;
        const [startPointX, startPointY] = startPoint.split(',');
        const [endPointX, endPointY] = endPoint.split(',');

        const node = analysisPosition === 'south' ? 'ad0102' : 'north';
        const link = analysisPosition === 'south' ? 'ad0022' : 'north';

        let viewParams = 'link:' + link;
        viewParams += ';node:' + node;
        viewParams += ';x1:' + startPointX;
        viewParams += ';y1:' + startPointY;
        viewParams += ';x2:' + endPointX;
        viewParams += ';y2:' + endPointY;
        viewParams += ';routeType:' + pathType;

        const params = {
          service: 'WFS',
          version: '1.1.0',
          request: 'GetFeature',
          outputFormat: 'application/json',
          typeName: 'mdtp:pgr_fromAtoB',
          srsName: 'EPSG:4326',
          viewparams: viewParams,
        };

        try {
          setloading({loading: true, msg: '분석중...'});
          setResultLayers(produce((draft) => {
            draft[analKorName] = {
              layerName: analKorName,
              changable: false,
              step: ResultLayerStepType.SIMPLIFY,
              type: ResultLayerDataType.Entity,
              isCustom: true,
            };
          }));
          const response = await axios({
              method: 'GET',
              url: `${import.meta.env.VITE_ANAL_GEOSERVER_URL}/ows`,
              params,
          });

          const dataSource = getOrCreateDataSource(analKorName);
          dataSource.entities.removeAll();
          const geojson = response.data;
          const {features} = geojson;
          let totalLength = 0;
          let totalSpeed = 0;
          const names:string[] = [];
          features.forEach((item:any) => {
              const {geometry, properties:{length, speed, name}} = item;
              const {coordinates} = geometry;
              totalLength += length;
              totalSpeed += speed;
              names.push(name ? name : '');
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const cartesians = coordinates[0].map((coordinate:any) => {
                const [lon, lat] = coordinate;
                return Cesium.Cartesian3.fromDegrees(lon, lat);
              });
              dataSource.entities.add({
                  polyline: {
                      clampToGround: true,
                      positions: cartesians,
                      width: 5,
                      material: Cesium.Color.fromCssColorString('#4ba1e7'),
                  }
              });
          });

          const averageSpeed = totalSpeed / features.length;
          const totalMinute = (totalLength / averageSpeed) * 60;
          const hour = Math.floor(totalMinute / 60);
          const minute = Math.ceil(totalMinute % 60);
          setDistance(`${totalLength.toFixed(2)}km`);
          setSpendTime(`${hour ? 'hour 시간 ':''}${minute}분`);
          setNodes(names);
        } catch {
            alert('분석에 실패했습니다.');
        } finally {
          setloading({loading: false, msg: ''});
        }
    }
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
        <div className="analysisContent width-88">
            <label>분석위치 <AnalHelp analName="PathAnalysis" propName="analysisPosition"/></label>
            <select id="analysisPosition" {...register("analysisPosition")} defaultValue={'south'}>
                <option value="south">남한</option>
                <option value="north">북한</option>
            </select>
            <label>경로유형 <AnalHelp analName="PathAnalysis" propName="pathType"/></label>
            <select id="pathType" {...register("pathType")} defaultValue={'false'}>
                <option value="false">최단경로</option>
                <option value="true">최적경로</option>
            </select>
            <label>출발지점 <AnalHelp analName="PathAnalysis" propName="startPoint"/></label>
            <div className="btn-div">
                <button className={`drawBtn ${isStartDrawing ? 'isDrawing':''}`} onClick={toggleIsStartDrawing} type="button">위치선택</button>
            </div>
            {
                startPoint ? (
                    <>
                    <label>대상자 좌표</label>
                    <div className="btn-div">
                        <div className="coordinate-txt">{startPoint}</div>
                        <button className="btn-coordinate-delete" type="button" onClick={clearStartPoint}>X</button>
                    </div>
                    </>
                    ) : null
            }
            <label>도착지점 <AnalHelp analName="PathAnalysis" propName="endPoint"/></label>
            <div className="btn-div">
                <button className={`drawBtn ${isEndDrawing ? 'isDrawing':''}`} onClick={toggleIsEndDrawing} type="button">위치선택</button>
            </div>
            {
                endPoint ? (
                    <>
                    <label>대상자 좌표</label>
                    <div className="btn-div">
                        <div className="coordinate-txt">{endPoint}</div>
                        <button className="btn-coordinate-delete" type="button" onClick={clearEndPoint}>X</button>
                    </div>
                    </>
                    ) : null
            }
            <div>
              {
                distance && <span>{distance}</span>
              }
              {
                spendTime && <span>{spendTime}</span>
              }
              {
                nodes.length > 0 && (
                  <ul>
                    {
                      nodes.map((name, idx) => {
                        return (
                          <li key={idx}>{idx+1}. {name}</li>
                        )
                      })
                    }
                  </ul>
                )
              }
              
            </div>
            <div className="btn marginTop-5 clearBoth">
                <button type="submit" className="btn-apply">분석</button>
            </div>
        </div>
      </form>
    )
}

export default PathAnalysis;