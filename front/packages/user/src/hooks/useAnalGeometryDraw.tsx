import { useGlobeController } from "@/components/providers/GlobeControllerProvider";
import * as Cesium from "cesium";
import { produce } from "immer";
import { useEffect, useState } from "react";
import { polygon as turfPolygon, area as turfArea, circle} from "@turf/turf";

export enum DrawType {
    Point = 'point',
    Circle = 'circle',
    Box = 'box',
    Polygon = 'polygon',
    Line = 'line'
}
const getLabelText = (drawType:DrawType) => {
    switch(drawType) {
        case DrawType.Point:
            return '원하는 지점을 클릭하세요.';
        case DrawType.Circle:
            return '클릭 후 이동하여 원하는 원의 크기 지점을 우클릭하세요.';
        case DrawType.Line:
            return '클릭하여 라인의 꼭지점을 지정해주세요.';
        case DrawType.Box:
            return '클릭 후 이동하여 원하는 박스의 크기 지점을 우클릭하세요.';
        case DrawType.Polygon:
            return '다각형의 꼭지점을 클릭해주세요.(우클릭 종료)';
    }
}
export type DrawEndFuncProps = {
    drawType:DrawType,
    cartesians: Cesium.Cartesian3 | Cesium.Cartesian3[] | undefined,
    resultEntity: Cesium.Entity,
    wkt: string
}
type DrawEndFunc = (props:DrawEndFuncProps) => void;

export type AnalGeometryDrawProps = {
    drawEnd?: DrawEndFunc,
    restrictArea?: boolean
}
export const useAnalGeometryDraw = ({drawEnd, restrictArea = true}:AnalGeometryDrawProps) => {
    const {initialized, globeController} = useGlobeController();
    const [cropShape, setCropShape] = useState<string | null>(null);
    const [resultEntityIds, setResultEntityIds] = useState<string[]>([]);
    const [drawType, setDrawType] = useState<DrawType | null>(null);
    const clearResultEntityIds = () => {
        const {analysisDataSource} = globeController;
        resultEntityIds.forEach((id) => {
            analysisDataSource.entities.removeById(id);
        });
        setResultEntityIds([]);
    }

    useEffect(() => {
        return () => {
            const {analysisDataSource} = globeController;
            analysisDataSource.entities.removeAll();
        }
    }, []);
    
    useEffect(() => {
        if (!initialized) return;
    
        const { viewer, handler, eventDataSource, analysisDataSource} = globeController;
        if (!viewer) return;      
    
        const clear = () => {
            const { handler, eventDataSource} = globeController;
            handler?.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
            handler?.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
            handler?.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK);
            
            eventDataSource.entities.removeAll();
        }
        const cartesians:Cesium.Cartesian3[] = [];
        const getEventEntityContructor = ():Cesium.Entity.ConstructorOptions => {
            const color = Cesium.Color.fromCssColorString('#0c8dff');
            const colorWithAlpha = color.withAlpha(0.15);
            switch(drawType) {
                case DrawType.Point:{
                    return {
                        position: Cesium.Cartesian3.fromDegrees(10, 10, 10),
                        point: {
                            color: color,
                            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                            pixelSize: 10,
                            disableDepthTestDistance: Number.POSITIVE_INFINITY
                        }
                    }
                }
                case DrawType.Circle:{
                    const getRadius = new Cesium.CallbackProperty(() => {
                        if( cartesians.length < 2) return 1;
                        const [firstPoint, cartesian] = cartesians;
                        return Cesium.Cartesian3.distance(firstPoint, cartesian);
                    }, false);
                    
                    return {
                        position: Cesium.Cartesian3.fromDegrees(10, 10, 10),
                        ellipse: {
                            semiMinorAxis: getRadius,
                            semiMajorAxis: getRadius,
                            material: colorWithAlpha,
                            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                            outline: true,
                            outlineColor: color,
                            outlineWidth: 2
                        }
                    }
                }
                case DrawType.Line:
                    return {
                        polyline: {
                            positions: new Cesium.CallbackProperty(() => {
                                if( cartesians.length < 2) return null;
                                return cartesians;
                            }, false),
                            material:color,
                            width: 3,
                            clampToGround: true
                        }
                    }
                case DrawType.Box: {
                    const getNews = (cartesians:Cesium.Cartesian3[]) => {
                      const [firstPoint, cartesian] = cartesians;
                      const firstCartographic = Cesium.Cartographic.fromCartesian(firstPoint);
                      const secondCartographic = Cesium.Cartographic.fromCartesian(cartesian);

                      const east = Math.max(firstCartographic.longitude, secondCartographic.longitude);
                      const west = Math.min(firstCartographic.longitude, secondCartographic.longitude);
                      const north = Math.max(firstCartographic.latitude, secondCartographic.latitude);
                      const south = Math.min(firstCartographic.latitude, secondCartographic.latitude);

                      return {east, west, north, south};
                    }
                    const getRectangle = new Cesium.CallbackProperty(() => {
                        if( cartesians.length < 2) return null;
                        const {east, north, south, west} = getNews(cartesians);
                        return Cesium.Rectangle.fromRadians(west, south, east, north);
                    }, false);

                    const getLine = new Cesium.CallbackProperty(() => {
                      if( cartesians.length < 2) return null;
                      const {east, north, south, west} = getNews(cartesians);
                      const rightTop = Cesium.Cartesian3.fromRadians(east, north);
                      const leftTop = Cesium.Cartesian3.fromRadians(west, north);
                      const leftBottom = Cesium.Cartesian3.fromRadians(west, south);
                      const rightBottom = Cesium.Cartesian3.fromRadians(east, south);

                      return [rightTop, leftTop, leftBottom, rightBottom, rightTop] as Cesium.Cartesian3[];
                    }, false);
                    return {
                        polyline: {
                          positions: getLine,
                          width: 3,
                          material: color,
                          clampToGround: true
                        },
                        rectangle: {
                            coordinates: getRectangle,
                            material: colorWithAlpha,
                            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
                        }
                    }
                }
                case DrawType.Polygon:
                    return {
                        polyline: {
                            positions: new Cesium.CallbackProperty(() => {
                                if( cartesians.length < 3) return cartesians;
                                else {
                                    return [...cartesians, cartesians[0]] as Cesium.Cartesian3[];
                                }
                            }, false),
                            width: 3,
                            material: color,
                            clampToGround: true
                        },
                        polygon: {
                            hierarchy: new Cesium.CallbackProperty(() => {
                                return new Cesium.PolygonHierarchy(cartesians);
                            }, false),
                            material: colorWithAlpha,
                            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                            show: false
                        }
                    };
                default:
                    return {};
            }
        }
    
        const heirarchyToWkt = (hierarchy:number[][]) => hierarchy.map((item) => item.join(' ')).join(', ');
        const getArea = (hierarchy:number[][]) => {
            const polygon = turfPolygon([hierarchy]);
            return turfArea(polygon) / 1000000;
        }
        const postProcess = () => {
            const resultEntity = analysisDataSource.entities.add(Cesium.clone(eventEntity));
            let area = 0;
            let wkt = '';
            switch(drawType) {
                case DrawType.Point:{
                    if (!resultEntity.point) return;
                    const position = resultEntity.position?.getValue(Cesium.JulianDate.now());
                    if (!position) throw new Error('position is null');

                    const cartographic = Cesium.Cartographic.fromCartesian(position);
                    
                    wkt = `POINT(${Cesium.Math.toDegrees(cartographic.longitude)} ${Cesium.Math.toDegrees(cartographic.latitude)})`
                    break;
                }
                case DrawType.Line:{
                    if (!resultEntity.polyline) return;
                    const positions: Cesium.Cartesian3[] = resultEntity.polyline.positions?.getValue(Cesium.JulianDate.now());
                    resultEntity.polyline.positions = new Cesium.ConstantProperty(positions);

                    const wktCoord = positions.map((item) => {
                        const cartographic = Cesium.Cartographic.fromCartesian(item);
                        return `${Cesium.Math.toDegrees(cartographic.longitude)} ${Cesium.Math.toDegrees(cartographic.latitude)}`;
                    }).join(', ');

                    wkt = `LINESTRING(${wktCoord})`;
                    break;
                }
                case DrawType.Circle:{
                    if (!resultEntity.ellipse) return;
                    const cartographic = Cesium.Cartographic.fromCartesian(cartesians[0]);
                    const radius = resultEntity.ellipse.semiMajorAxis?.getValue(Cesium.JulianDate.now());
                    resultEntity.ellipse.semiMajorAxis = new Cesium.ConstantProperty(radius);
                    resultEntity.ellipse.semiMinorAxis = new Cesium.ConstantProperty(radius);
    
                    const geojson = circle([cartographic.longitude, (cartographic).latitude], radius / 50, {steps: 72, units: 'meters'});
                    const {geometry} = geojson;
                    const {coordinates} = geometry;
                    const hierarchy = coordinates[0].map((item) => item.map((item) => Cesium.Math.toDegrees(item)));
                    
                    wkt = `POLYGON((${heirarchyToWkt(hierarchy)}))`;
                    if (restrictArea) area = getArea(hierarchy);
                    break;
                }
                case DrawType.Box: {
                    if (!resultEntity.rectangle || !resultEntity.polyline) return;
                    const linePositions: Cesium.Cartesian3[] = resultEntity.polyline.positions?.getValue(Cesium.JulianDate.now());
                    resultEntity.polyline.positions = new Cesium.ConstantProperty(linePositions);
                    const rectangle = resultEntity.rectangle.coordinates?.getValue(Cesium.JulianDate.now());
                    resultEntity.rectangle.coordinates = new Cesium.ConstantProperty(rectangle);
    
                    const westDeg = Cesium.Math.toDegrees(rectangle?.west ?? 0);
                    const eastDeg = Cesium.Math.toDegrees(rectangle?.east ?? 0);
                    const southDeg = Cesium.Math.toDegrees(rectangle?.south ?? 0);
                    const northDeg = Cesium.Math.toDegrees(rectangle?.north ?? 0);
    
                    const rightTop = [eastDeg, northDeg];
                    const leftTop = [westDeg, northDeg];
                    const leftBottom = [westDeg, southDeg];
                    const rightBottom = [eastDeg, southDeg];
    
                    const hierarchy = [rightTop, leftTop, leftBottom, rightBottom, rightTop];
    
                    wkt = `POLYGON((${heirarchyToWkt(hierarchy)}))`;
                    if (restrictArea) area = getArea(hierarchy);
                    break;
                }   
                case DrawType.Polygon: {
                    if (!resultEntity.polygon || !resultEntity.polyline) return;
                    const linePositions: Cesium.Cartesian3[] = resultEntity.polyline.positions?.getValue(Cesium.JulianDate.now());
                    resultEntity.polyline.positions = new Cesium.ConstantProperty(linePositions);

                    const polygonHierarchy = resultEntity.polygon.hierarchy?.getValue(Cesium.JulianDate.now());
                    const positions = polygonHierarchy.positions;
                    
                    positions.push(positions[0]);
                    resultEntity.polygon.hierarchy = new Cesium.ConstantProperty(polygonHierarchy);
    
                    const hierarchy = positions
                                        .map((item:Cesium.Cartesian3) => Cesium.Cartographic.fromCartesian(item))
                                        .map((item:Cesium.Cartographic) => [Cesium.Math.toDegrees(item.longitude), Cesium.Math.toDegrees(item.latitude)]);
                    wkt = `POLYGON((${heirarchyToWkt(hierarchy)}))`;                                         
                    if (restrictArea) area = getArea(hierarchy);
                    break;
                }
            }

            if ( restrictArea && area > 100) {
                alert('최대 면적의 크기는 100㎢ 이내여야 합니다. 다시 설정해주세요.');
                analysisDataSource.entities.remove(resultEntity);
                setDrawType(null);
                return;
            }

            if (drawType && drawEnd) {
                drawEnd({
                    drawType, 
                    cartesians: cartesians.length > 1 ? cartesians : resultEntity.position?.getValue(Cesium.JulianDate.now()),
                    resultEntity,
                    wkt
                });
            }
            
            setCropShape(wkt);
            setDrawType(null);
            clear();
    
            setResultEntityIds(produce(draft => {
                draft.length = 0;
                draft.push(resultEntity.id);
            }));
        }
        
        if (!handler || !drawType) {
            clear();
            return;
        }
        clearResultEntityIds();
    
        const labelEntity = eventDataSource.entities.add({
            position: Cesium.Cartesian3.fromDegrees(0, 0),
            label: {
                text: getLabelText(drawType),
                showBackground: true,
                font: '16px sans-serif',
                backgroundColor: Cesium.Color.fromCssColorString('#000000').withAlpha(0.7),
                horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                disableDepthTestDistance: Number.POSITIVE_INFINITY
            }
        });
        
        const eventEntity = eventDataSource.entities.add(getEventEntityContructor());
        
        //let lastClickTime:Cesium.JulianDate | null = null;
        handler.setInputAction((movement: Cesium.ScreenSpaceEventHandler.MotionEvent) => {
            const cartesian = globeController.pickPosition(movement.endPosition);
            if (!cartesian) return;
            labelEntity.position = new Cesium.ConstantPositionProperty(cartesian);
            
            if (drawType === DrawType.Polygon){
                if (cartesians.length === 0) return;
    
                if (cartesians.length > 1) {
                    cartesians.pop();
                }
                cartesians.push(cartesian);
                if (cartesians.length === 3) {
                    if (eventEntity.polygon) eventEntity.polygon.show = new Cesium.ConstantProperty(true);
                    //if (eventEntity.polyline) eventEntity.polyline.show = new Cesium.ConstantProperty(false);
                }
            } else if (drawType === DrawType.Line) {
                if (cartesians.length === 0) return;
                if (cartesians.length > 1) {
                    cartesians.pop();
                }
                cartesians.push(cartesian);
            } else if (drawType === DrawType.Point) {
                eventEntity.position = new Cesium.ConstantPositionProperty(cartesian);
            } else {
                if (cartesians.length === 0 || cartesians.length > 2) return;
    
                if (cartesians.length === 2) {
                    cartesians.pop();
                }
                cartesians.push(cartesian);
            }
            
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        handler.setInputAction((clicked: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
            /* const currentTime = Cesium.JulianDate.now();
            if (lastClickTime && Cesium.JulianDate.secondsDifference(currentTime, lastClickTime) < 0.3) return; */
    
            const cartesian = globeController.pickPosition(clicked.position);
            if (!cartesian) return;
    
            if (cartesians.length === 0) {
                eventEntity.position = new Cesium.ConstantPositionProperty(cartesian);
                if (drawType === DrawType.Point) {
                    postProcess();
                }
            } else {
                if (drawType !== DrawType.Polygon && drawType !== DrawType.Line) cartesians.pop();
            }
            cartesians.push(cartesian);
            
            /* lastClickTime = currentTime; */
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK); 
    
        handler.setInputAction((clicked: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
            const cartesian = globeController.pickPosition(clicked.position);
            if (!cartesian) return;
            cartesians.pop();
            cartesians.push(cartesian);
            
            postProcess();
        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

        handler.setInputAction((clicked: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
          return;
        }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    
        return () => {
            clear();
        }
    }, [drawType]);
    
    const clearCropShape = () => {
        setCropShape(null);
        clearResultEntityIds();
    }
    
    const toggleDrawType = (type:DrawType) => {
        if (type === drawType) {
            setDrawType(null);
        } else {
            setDrawType(type);
        }
    }

    return {
        globeController,
        cropShape,
        resultEntityIds,
        setResultEntityIds,
        drawType,
        toggleDrawType,
        clearCropShape,
        clearResultEntityIds,
        setDrawType
    }
}
