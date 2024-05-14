import { Fragment, useEffect, useState } from "react";
import { useGlobeController } from "./providers/GlobeControllerProvider";
import * as Cesium from "cesium";
import { Coordinate, CoordinateType } from "@/api/Coordinate";
import { useSetRecoilState } from "recoil";
import { mainMenuState } from "@/recoils/MainMenuState";
import { CoordinateFromReadCoordinateState } from "@/recoils/Mapnote";
import { XLSXWorkSheetProps, downloadExcelFile } from "@mnd/shared";
/**
 * 좌표독취
 * @returns
 */
enum ReadCoordType {
  SCREEN_CENTER = '화면중심',
  SCREEN_DOT = '점',
  SCREEN_AREA = '지도영역',
}
const ReadCoordTypes = [
  {clsName: 'screenCenter', label: '화면중심', type: ReadCoordType.SCREEN_CENTER},
  {clsName: 'screenDot', label: '점', type: ReadCoordType.SCREEN_DOT },
  {clsName: 'screenArea', label: '지도영역', type: ReadCoordType.SCREEN_AREA},
]

type SavedCoordinate = Map<CoordinateType, string>;

const coordinateToCopyText = (coordinate: Coordinate) => {
  return `DD: ${coordinate.toString()}\nDM: ${coordinate.toDMString()}\nDMS: ${coordinate.toDMSString()}\nMGRS: ${coordinate.toMGRS()}\nUTM: ${coordinate.toUTMString()}\nGARS: ${coordinate.toGars()}`;
}

const coordinateToSavedCoordinate = (coordinate: Coordinate):SavedCoordinate => {
  const savedCoordinateMap = new Map();
  savedCoordinateMap.set('DD', coordinate.toString());
  savedCoordinateMap.set('DM', coordinate.toDMString());
  savedCoordinateMap.set('DMS', coordinate.toDMSString());
  savedCoordinateMap.set('MGRS', coordinate.toMGRS());
  savedCoordinateMap.set('UTM', coordinate.toUTMString());
  savedCoordinateMap.set('GARS', coordinate.toGars());

  return savedCoordinateMap
}
const SAVED_COORDINATE_KEY = 'savedCoordinates';
const getSavedCoordinates = ():SavedCoordinate[] | null => {
  const localStorage = window.localStorage;
  const savedCoordinateString = localStorage.getItem(SAVED_COORDINATE_KEY);
  return savedCoordinateString ? JSON.parse(savedCoordinateString).map((entries:any)=>new Map(entries)) : null;
}

const toClipboard = (coordinate: Coordinate | null | undefined) => {
  if (!coordinate) return;
  window.navigator.clipboard.writeText(coordinateToCopyText(coordinate))
  .then(() => {
    alert('복사완료');
  })
  .catch((err) => {
    alert('복사실패');
  });
}

export const AsideCoord = () => {
  //localStorage.removeItem(SAVED_COORDINATE_KEY);
  const setMainMenu = useSetRecoilState(mainMenuState);
  const [readCoordType, setReadCoortType] = useState<ReadCoordType>(ReadCoordType.SCREEN_CENTER);
  const {initialized, globeController} = useGlobeController();
  const [coordinate, setCoordinate] = useState<Coordinate | null>(null);
  const [savedCoordinates, setSavedCoordinates] = useState<SavedCoordinate[] | null>(getSavedCoordinates());
  const setCoordinateFromReadCoordinate = useSetRecoilState(CoordinateFromReadCoordinateState);

  const init = () => {
    const { eventDataSource} = globeController;
    setCoordinate(null);

    const entity = eventDataSource.entities.getById('labelEntity2');
    if ( entity ) entity.position = new Cesium.ConstantPositionProperty(Cesium.Cartesian3.fromDegrees(0, 0));
  }

  const addMapnote = (coordinate: Coordinate | null | undefined) => {
    if (!coordinate) return;

    setMainMenu({SelectedId:'mapnote'});
    setCoordinateFromReadCoordinate(coordinate);
  }

  const excelDownload = () => {
    const data =savedCoordinates?.map((map)=>Array.from(map.entries())).map(item=>{
      const coordinatesObject:{[key: string]: string} = {};
  
      item.forEach(([key, value]) => {
          coordinatesObject[key] = value;
      });
      return coordinatesObject;
    });
    if (!data){
      alert('좌표독취 이력이 없습니다.');
      return;
    }
    const sheet = {
      data,
      sheetName: '좌표독취 이력',
    } as XLSXWorkSheetProps;
    downloadExcelFile([sheet], '좌표독취이력.xlsx');
  }

  const addCoordinate = () => {
    if (!coordinate) return;
    const savedCoordinates = getSavedCoordinates();

    const savedCoordinate = coordinateToSavedCoordinate(coordinate);

    if (!savedCoordinates) {
      const newSavedCoordinates:SavedCoordinate[] = [savedCoordinate];
      window.localStorage.setItem(SAVED_COORDINATE_KEY, JSON.stringify(newSavedCoordinates.map((map)=>Array.from(map.entries()))));

      setSavedCoordinates([...newSavedCoordinates]);
    } else {
      if (savedCoordinates.length > 9) savedCoordinates.shift();

      savedCoordinates.unshift(savedCoordinate);
      window.localStorage.setItem(SAVED_COORDINATE_KEY, JSON.stringify(savedCoordinates.map((map)=>Array.from(map.entries()))));
      setSavedCoordinates([...savedCoordinates]);
    }
  }

  const flyTo = (coordinate: Coordinate | null | undefined) => {
    if (!coordinate) return;

    const viewer = globeController?.viewer;
    if (!viewer) return;

    const cartesian = Cesium.Cartesian3.fromDegrees(coordinate.x, coordinate.y, 5000);
    viewer.camera.flyTo({
      destination: cartesian,
      duration: 1
    });
  }

  const removeCoordinate = (index:number) => {
    if (!savedCoordinates) return;
    const newSavedCoordinates = savedCoordinates.filter((_, i) => i !== index);
    window.localStorage.setItem(SAVED_COORDINATE_KEY, JSON.stringify(newSavedCoordinates.map((map)=>Array.from(map.entries()))));
    setSavedCoordinates([...newSavedCoordinates]);
  }

  useEffect(() => {
    if (!initialized) return;
    //const viewer = globeController?.viewer;
    const { viewer, handler, eventDataSource} = globeController;
    if (!viewer) return;

    setCoordinate(null);
    const scene = viewer.scene;
    const camera = scene.camera;
    
    switch (readCoordType) {
        case ReadCoordType.SCREEN_CENTER: {
            camera.percentageChanged = 0.01;
            camera.changed.addEventListener(center);
            center();
            break;
        }
        case ReadCoordType.SCREEN_DOT: {
            if (!handler) return;
            const labelEntity = eventDataSource.entities.add({
                position: Cesium.Cartesian3.fromDegrees(0, 0),
                label: {
                    text: '좌표독취를 원하는 지점을 클릭하세요',
                    showBackground: true,
                    font: '16px sans-serif',
                    backgroundColor: Cesium.Color.fromCssColorString('#000000').withAlpha(0.7),
                    horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                    disableDepthTestDistance: Number.POSITIVE_INFINITY
                }
            });
            const labelEntity2 = eventDataSource.entities.add({
                position: Cesium.Cartesian3.fromDegrees(0, 0),
                label: {
                    text: '좌표독취지점',
                    showBackground: true,
                    font: '16px sans-serif',
                    backgroundColor: Cesium.Color.fromCssColorString('#000000').withAlpha(0.7),
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                    disableDepthTestDistance: Number.POSITIVE_INFINITY
                },
                id: 'labelEntity2'
            });
            handler.setInputAction((movement: Cesium.ScreenSpaceEventHandler.MotionEvent) => {
                const cartesian = globeController.pickPosition(movement.endPosition);
                if (!cartesian) return;
                labelEntity.position = new Cesium.ConstantPositionProperty(cartesian);
            }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
            handler.setInputAction((clicked: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
                const cartesian = globeController.pickPosition(clicked.position);
                if (!cartesian) return;
                labelEntity2.position = new Cesium.ConstantPositionProperty(cartesian);
                const center = Cesium.Cartographic.fromCartesian(cartesian);
                setCoordinate(new Coordinate(Cesium.Math.toDegrees(center.longitude), Cesium.Math.toDegrees(center.latitude)));
            }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
            break;
        }
        case ReadCoordType.SCREEN_AREA: {
            if (!handler) return;
            let isDrawing = false;
            const labelEntity = eventDataSource.entities.add({
                position: Cesium.Cartesian3.fromDegrees(0, 0),
                label: {
                    text: '좌표독취를 원하는 지점을 드래그하세요',
                    showBackground: true,
                    font: '16px sans-serif',
                    backgroundColor: Cesium.Color.fromCssColorString('#000000').withAlpha(0.7),
                    horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                    disableDepthTestDistance: Number.POSITIVE_INFINITY
                }
            });

            const labelEntity2 = eventDataSource.entities.add({
                position: Cesium.Cartesian3.fromDegrees(0, 0),
                label: {
                    text: '좌표독취지점',
                    showBackground: true,
                    font: '16px sans-serif',
                    backgroundColor: Cesium.Color.fromCssColorString('#000000').withAlpha(0.7),
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                    disableDepthTestDistance: Number.POSITIVE_INFINITY
                },
                id: 'labelEntity2'
            });

            const rectangle = eventDataSource.entities.add({
                rectangle: {
                    coordinates: Cesium.Rectangle.fromDegrees(0, 0, 0, 0),
                    material: Cesium.Color.fromCssColorString('#f00000').withAlpha(0.5),
                    outline: true,
                    outlineColor: Cesium.Color.RED,
                    outlineWidth: 2,
                    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
                }
            });
            const firstPoint = new Cesium.Cartesian3();
            handler.setInputAction((movement: Cesium.ScreenSpaceEventHandler.MotionEvent) => {
                const cartesian = globeController.pickPosition(movement.endPosition);
                if (!cartesian || !rectangle || !rectangle.rectangle) return;
                labelEntity.position = new Cesium.ConstantPositionProperty(cartesian);

                if (!isDrawing) return;

                const firstCartographic = Cesium.Cartographic.fromCartesian(firstPoint);
                const secondCartographic = Cesium.Cartographic.fromCartesian(cartesian);

                const east = Math.max(firstCartographic.longitude, secondCartographic.longitude);
                const west = Math.min(firstCartographic.longitude, secondCartographic.longitude);
                const north = Math.max(firstCartographic.latitude, secondCartographic.latitude);
                const south = Math.min(firstCartographic.latitude, secondCartographic.latitude);

                rectangle.rectangle.coordinates = new Cesium.ConstantProperty(Cesium.Rectangle.fromRadians(west, south, east, north));
            }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
            handler.setInputAction((clicked: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
                const cartesian = globeController.pickPosition(clicked.position);
                if (!cartesian) return;

                labelEntity.position = new Cesium.ConstantPositionProperty(cartesian);
                firstPoint.x = cartesian.x;
                firstPoint.y = cartesian.y;
                firstPoint.z = cartesian.z;

                scene.screenSpaceCameraController.enableRotate = false;
                scene.screenSpaceCameraController.enableTranslate = false;
                scene.screenSpaceCameraController.enableTilt = false;
                scene.screenSpaceCameraController.enableLook = false;
                scene.screenSpaceCameraController.enableCollisionDetection = false;

                isDrawing = true;
            }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

            handler.setInputAction((clicked: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
                const cartesian = globeController.pickPosition(clicked.position);
                if (!cartesian || !rectangle || !rectangle.rectangle || !isDrawing) return;

                const center = Cesium.Rectangle.center(rectangle.rectangle.coordinates?.getValue(Cesium.JulianDate.now()));
                labelEntity2.position = new Cesium.ConstantPositionProperty(Cesium.Cartesian3.fromRadians(center?.longitude ?? 0, center?.latitude ?? 0));

                setCoordinate(new Coordinate(Cesium.Math.toDegrees(center.longitude), Cesium.Math.toDegrees(center.latitude)));
                firstPoint.x = 0;
                firstPoint.y = 0;
                firstPoint.z = 0;

                scene.screenSpaceCameraController.enableRotate = true;
                scene.screenSpaceCameraController.enableTranslate = true;
                scene.screenSpaceCameraController.enableTilt = true;
                scene.screenSpaceCameraController.enableLook = true;
                scene.screenSpaceCameraController.enableCollisionDetection = true;

                isDrawing = false;
            }, Cesium.ScreenSpaceEventType.LEFT_UP);
            break;
        }
    }

    return () => {
        camera.percentageChanged = 1;
        camera.changed.removeEventListener(center);
        handler?.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        handler?.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
        handler?.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_UP);
        handler?.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOWN);
        eventDataSource.entities.removeAll();

        scene.screenSpaceCameraController.enableTranslate = true;
        scene.screenSpaceCameraController.enableTilt = true;
        scene.screenSpaceCameraController.enableLook = true;
        scene.screenSpaceCameraController.enableCollisionDetection = true;
    }
  }, [readCoordType, initialized]);

  const center = () => {
    const viewer = globeController?.viewer;
    if (!viewer) return;
    const scene = viewer.scene;
    const camera = scene.camera;

    const rectangle = camera.computeViewRectangle();
    if (rectangle === undefined) return;
    const center = Cesium.Rectangle.center(rectangle);

    setCoordinate(new Coordinate(Cesium.Math.toDegrees(center.longitude), Cesium.Math.toDegrees(center.latitude)));
  }
  
  return (
    <aside className="gray-bg">
      <div className="aside-content marginTop-20">
        <ul className="register coordinate-03 width-88">
          {
            ReadCoordTypes.map((type, index) => {
              return (
                <li 
                  className={`${type.clsName} ${readCoordType === type.type ? 'on' : ''}`}
                  style={{cursor: 'pointer'}}
                  onClick={() => setReadCoortType(type.type)}
                  key={index}
                >
                  <span>{type.label}</span>
                </li>
              )
            })
          }
        </ul>
        <div className="height-98 yScroll">
          <div className="coordinate width-88 marginTop-20">
            <label>DD</label> <input type="text" readOnly value={coordinate ? coordinate.toString() : ''}/>
            <label>DM</label> <input type="text" readOnly value={coordinate ? coordinate.toDMString() : ''}/>
            <label>DMS</label> <input type="text" readOnly value={coordinate ? coordinate.toDMSString() : ''}/>
            <label>MGRS</label> <input type="text" readOnly value={coordinate ? coordinate.toMGRS() : ''}/>
            <label>UTM </label> <input type="text" readOnly value={coordinate ? coordinate.toUTMString() : ''}/>
            <label>GARS </label> <input type="text" readOnly value={coordinate ? coordinate.toGars() : ''}/>
            <div className="btn">
              <button type="button" className="btn-small white" onClick={()=>{toClipboard(coordinate)}}>
                전체복사
              </button>
              <button type="button" className="btn-small white" onClick={()=>{addMapnote(coordinate)}}>
                지점등록
              </button>
              {
                ReadCoordType.SCREEN_CENTER !== readCoordType &&  
                <button type="button" className="btn-small white" onClick={init}>
                  초기화
                </button>
              }
            </div>
            <div className="btn marginTop-10">
              <button type="button" className="btn-download" onClick={excelDownload}>
                이력다운
              </button>
              <button type="button" className="btn-apply" onClick={addCoordinate}>
                좌표독취
              </button>
            </div>
            <h2 className="marginTop-16 marginBottom-20">좌표독취 이력</h2>
            {
              savedCoordinates && savedCoordinates.length > 0 ?
              savedCoordinates.map((savedCoordinate, index)=>{
                const mgrs = savedCoordinate.get('MGRS');
                if (!mgrs) return null;
                const coord = Coordinate.fromMGRS(mgrs);
                return (
                  <Fragment key={index}>
                  <label>DD</label> <input type="text" readOnly value={coord ? coord.toString() : ''}/>
                  <label>DM</label> <input type="text" readOnly value={coord ? coord.toDMString() : ''}/>
                  <label>DMS</label> <input type="text" readOnly value={coord ? coord.toDMSString() : ''}/>
                  <label>MGRS</label> <input type="text" readOnly value={coord ? coord.toMGRS() : ''}/>
                  <label>UTM </label> <input type="text" readOnly value={coord ? coord.toUTMString() : ''}/>
                  <label>GARS </label> <input type="text" readOnly value={coord ? coord.toGars() : ''}/>
                  <div className="btn marginBottom-20">
                    <button type="button" className="btn-small white" onClick={()=>{flyTo(coord)}}>
                      이동
                    </button>
                    <button type="button" className="btn-small white" onClick={()=>{toClipboard(coord)}}>
                      전체복사
                    </button>
                    <button type="button" className="btn-small white" onClick={()=>{addMapnote(coord)}}>
                      지점등록
                    </button>
                    <button type="button" className="btn-small white" onClick={()=>{removeCoordinate(index)}}>
                      삭제
                    </button>
                  </div>
                  </Fragment>
                )
              })
              :
              <div className="noData">
                <p>좌표독취 이력이 없습니다.</p>
              </div>
            }
          </div>
        </div>
      </div>
    </aside>
  );
};
