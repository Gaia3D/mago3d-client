import {PrintPotalOpenState} from "@/recoils/Tool"
import ReactDOM from "react-dom";
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil"
import {useGlobeController} from "../providers/GlobeControllerProvider";
import {useEffect, useState} from "react";
import * as Cesium from "cesium";
import * as olExtent from "ol/extent";
import {boundingExtent as olBoundingExtent, getBottomLeft, getHeight, getWidth} from "ol/extent";
import GeoTIFF from 'ol/source/GeoTIFF';
import OlMap from "ol/Map";
import OlView from "ol/View";
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import TileWMS from 'ol/source/TileWMS';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import ScaleLine from 'ol/control/ScaleLine';
import Feature from 'ol/Feature';
import Style from 'ol/style/Style';
import Stroke from "ol/style/Stroke";
import Fill from "ol/style/Fill";
import Text from "ol/style/Text";
import {transformExtent} from "ol/proj";
import {fromExtent} from 'ol/geom/Polygon';
import {defaults} from 'ol/control'
import {NodeModel} from "@minoru/react-dnd-treeview";
import {NodeModelsState,} from "@/recoils/Layer";
import {LayerAssetType, UserLayerAsset} from "@mnd/shared/src/types/layerset/gql/graphql";
import {Geometry} from "ol/geom";
import dayjs from "dayjs";
import axios from "axios";
import {Layer} from "ol/layer";
import {loadingState, LoadingStateType} from "@/recoils/Spinner";
import {download} from "@mnd/shared";
import proj4 from 'proj4';
import {register} from 'ol/proj/proj4';
import {useUserInfoLoadable} from "../providers/UserInfoLoadableProvider";

proj4.defs("EPSG:5179","+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=1000000 +y_0=2000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs");
proj4.defs("EPSG:32651","+proj=utm +zone=51 +datum=WGS84 +units=m +no_defs +type=crs");
proj4.defs("EPSG:32652","+proj=utm +zone=52 +datum=WGS84 +units=m +no_defs +type=crs");
register(proj4);

const getLayersFromNodeModels = (nodeModels:NodeModel[]) => {
  const sortList = nodeModels
      .filter((nodeModel:NodeModel) => nodeModel.parent === 0)
      .map((nodeModel:NodeModel) => nodeModel.id);

  const assets = nodeModels.filter((nodeModel:NodeModel) => nodeModel.parent !== 0)
      .sort((a,b) => sortList.indexOf(a.parent) - sortList.indexOf(b.parent))
      .map((nodeModel:NodeModel) => {
        const asset = nodeModel.data as UserLayerAsset;
        return asset;
      }).reverse();

  return assets;
}

type MapFishSpecTypeAttributesMap = {
  bbox: number[];
  dpiSensitiveStyle: boolean;
  layers: any[];
  scale: string;
  projection: string;
  dpi: string;
  areaOfInterest?: {
    area: {
      type: string;
      coordinates: number[][];
    },
    display: string;
  }
}
type MapFishSpecTypeAttributesPaging = {
  scale: string;
  aoiDisplay: string;
}
type MapFishSpecTypeAttributes = {
  map: MapFishSpecTypeAttributesMap;
  paging?: MapFishSpecTypeAttributesPaging;
  title: string;
  description: string;
}
type MapFishSpecType = {
  layout: string;
  outputFormat: string;
  outputFilename: string;
  attributes: MapFishSpecTypeAttributes
}

const dialogWrapperStyle:React.CSSProperties = {
  top: "120px",
  left: "460px",
  width: "880px"
}

const printMapStyle:React.CSSProperties = {
  width: "450px",
  height: "460px",
  float: "left",
  border: "1px solid #fff"
}

const printOptionStyle:React.CSSProperties = {
  width: "300px",
  height: "480px",
  float: "right",
  //border: "1px solid #fff"
}

const getOlLayer = (layers: UserLayerAsset[]):Layer[] => {
  const items = [];
  items.push(new TileLayer({
    source: new OSM()
  }));

  const { protocol, hostname, port } = window.location;
  // 포트가 있는 경우 콜론과 함께 포트 번호를 추가
  const portPart = port ? `:${port}` : '';
  // 전체 URL 구성
  const fullUrl = `${protocol}//${hostname}${portPart}${import.meta.env.VITE_GEOSERVER_WMS_SERVICE_URL}`;

  const tileLayers =  layers.filter(layer=>layer.visible).map(layer => {
    const {type, properties} = layer;
    if (!properties || Object.keys(properties).length === 0) return;
  
    switch (type) {
        case LayerAssetType.Tiles3D: {
            return;
        }
        case LayerAssetType.Vector: 
        case LayerAssetType.Raster: {
            const {layer} = properties;
            const {resource} = layer;
            
            return new TileLayer({
              source: new TileWMS({
                url: fullUrl,
                params: {
                  LAYERS: resource.name,
                  SERVICE: "WMS",
                  VERSION: "1.1.1",
                  REQUEST: "GetMap",
                  TRANSPARENT: "true",
                  FORMAT: "image/png",
                  TILED: true,
                },
                serverType: 'geoserver',
                transition: 0,
              }),
            });
        }
        case LayerAssetType.Layergroup: {
            const {layerGroup} = properties;
            const {bounds, title, workspace} = layerGroup;
            const {minx, miny, maxx, maxy} = bounds;
            const layerName = `${workspace.name}:${title}`;
  
            return new TileLayer({
              extent: transformExtent([minx, miny, maxx, maxy], 'EPSG:4326', 'EPSG:3857'),
              source: new TileWMS({
                url: fullUrl,
                params: {
                  LAYERS: layerName,
                  SERVICE: "WMS",
                  VERSION: "1.1.1",
                  REQUEST: "GetMap",
                  TRANSPARENT: "true",
                  FORMAT: "image/png",
                  TILED: true,
                },
                serverType: 'geoserver',
                transition: 0,
              }),
            });
        }
        case LayerAssetType.Cog: {
          const {resource} = properties;
          return new TileLayer({
            source: new GeoTIFF({
              sources: [
                {
                  url: resource,
                },
              ],
            })
          });
        }
    }
  })
  .filter(layer => layer) as TileLayer<GeoTIFF | TileWMS>[];


  items.push(...tileLayers);
  items.push(new VectorLayer({
    source: new VectorSource(),
    properties: {
      name: 'print-extent'
    }
  }));
  return items;
}
type PrintScaleType = {scale:string, disabled:boolean};
const PRINT_MAX_PAGE = 100;
let olMap: OlMap | null;
export const PrintPortal = () => {
  const el = document.querySelector("#map");
  const {globeController} = useGlobeController();
  const [printPortalOpen, setPrintPortalOpen] = useRecoilState(PrintPotalOpenState);
  const treeData = useRecoilValue<NodeModel[]>(NodeModelsState);
  const setloading = useSetRecoilState<LoadingStateType>(loadingState);
  const {userInfo} = useUserInfoLoadable();

  const [statusMsg, setStatusMsg] = useState<string>('출력 조건이나 서버 상태에 따라 출력에 시간이 소요될 수 있습니다. 잠시만 기다려주세요.');
  const [changedMap, setChangedMap] = useState<boolean>(false);
  const [pagingType, setPagingType] = useState<string>("default");
  const [paperSize, setPaperSize] = useState<string>("A4");
  const [printDirection, setPrintDirection] = useState<string>("landscape");
  const [mapScale, setMapScale] = useState<string>("500000");
  const [mapScales, setMapScales] = useState<string[]>(["500000", "100000", "50000", "25000", "10000", "5000", "2500", "1250", "800", "700", "600", "500"]);
  const [printScale, setPrintScale] = useState<string>("500000");
  const [printScales, setPrintScales] = useState<PrintScaleType[]>([]);
  const [selectDPI, setSelectDPI] = useState<string>("72");
  const [printTitle, setPrintTitle] = useState<string>("");
  const [printContent, setPrintContent] = useState<string>("");
  const [clientWidth, setClientWidth] = useState<number>(842);
  const [clientHeight, setClientHeight] = useState<number>(595);
  const [dpis, setDpis] = useState<string[]>(["72", "96", "130", "150", "200", "300"]);
  const [coordinateSystem, setCoordinateSystem] = useState<string>("32652");

  useEffect(() => {
    if (!changedMap) return;
    renderPrintExtent(clientWidth, clientHeight, mapScale, printScale);
    setChangedMap(false);
  }, [clientWidth, clientHeight, changedMap]);

  useEffect(() => {
    loadCapabilities();
  }, [paperSize, printDirection, pagingType]);

  useEffect(() => {
    if(mapScale && mapScales){
			/* setPrintScale( */sortingPrintScale(mapScales, mapScale);
		}
  }, [mapScale]);

  useEffect(() => {
		if(printScale){
			renderPrintExtent(clientWidth, clientHeight, mapScale, printScale);
			// 지도 extent 변경시 print extent 변경 이벤트 추가
			if(olMap) olMap.on('moveend', () => renderPrintExtent(clientWidth, clientHeight, mapScale, printScale));
		}
		return () => {
			if(olMap){
        const listener = olMap?.getListeners('moveend');
        if(listener && listener.length > 0){
          olMap.removeEventListener('moveend', listener[0]);
        }
			}
		}
	}, [printScale])


  const encodeTileWMS = (layer:TileLayer<TileWMS>) => {
    const source = layer.getSource();
    if (!source) return;
    const opacity = layer.getOpacity();
    const params = source.getParams();

    const styles = [params.STYLES].join(',').split(',');
    const layers = [params.LAYERS].join(',').split(',');
    const baseURL = source.getUrls() ?? '';

    const encodeLayer = {
        type: 'WMS',
        baseURL: (baseURL instanceof Array ? baseURL[0] : baseURL),
        customParams: source.getParams(),
        layers: layers,
        opacity: opacity,
        //styles: styles
    };
    encodeLayer.baseURL = encodeLayer.baseURL.replace('?', '');
    return encodeLayer
  }

  const loadCapabilities = () => {
    console.info('loadCapabilities');
    setloading({loading: true, msg: ''});
    axios.get(`${import.meta.env.VITE_MAP_FISH_URL}/print/${pagingType}/capabilities.json`)
    .then((response) => {
      if (!olMap) return;
      const {layouts} = response.data;

      const layoutName = `${paperSize} ${printDirection}`;
      const layout = layouts.find((layout:any) => layout.name === layoutName);

      const {attributes} = layout;
      const attrMap = attributes.find(function (attribute:any) { return attribute.name === 'map'; });
      const {clientInfo:{width, height, dpiSuggestions, scales}} = attrMap;

      console.info(getMapScale(olMap))
      const mScale = sortingMapScale(getMapScale(olMap), scales);
      console.info(mScale)
      //sortingPrintScale(scales, mScale.toString());
      if(mScale === Number(mapScale)){
        renderPrintExtent(width, height, mScale.toString(), sortingPrintScale(scales, mScale.toString()));
        const listener = olMap?.getListeners('moveend');
        if(listener && listener.length > 0){
          olMap.removeEventListener('moveend', listener[0]);
          // 지도 extent 변경시 print extent 변경 이벤트 삭제
          olMap.on('moveend', () => renderPrintExtent(width, height, mScale.toString(), sortingPrintScale(scales, mScale.toString())));
        }
      }
      
      console.info(attrMap);

      setClientWidth(width);
      setClientHeight(height);

      setDpis([...dpiSuggestions]);
      setMapScale(mScale.toString());
      setMapScales([...scales]);

      setChangedMap(true);
    })
    .catch((error) => {
      console.error(error);
    })
    .finally(() => {
      setloading({loading: false, msg: ''});
    });
  }

  const print = () => {
    const printJson = generatePrintSPEC();
    const jsonString = JSON.stringify(printJson);

    const data = encodeURIComponent(jsonString);
    const startTime = new Date().getTime();

    setStatusMsg('출력 대기중 ...');
    setloading({loading: true, msg: ''});
    axios.post(`${import.meta.env.VITE_MAP_FISH_URL}/print/${pagingType}/report.pdf`, data)
    .then((response) => {
      downloadWhenReady(startTime, response.data);
    })
    .catch((error) => {
      console.error(error);
      setStatusMsg('Error creating report: ' + error.statusText);
      setloading({loading: false, msg: ''});
    });
  }

  const updateWaitingMsg = (startTime:number, data:any) => {
    const elapsed = Math.floor((new Date().getTime() - startTime) / 100);
    let time = '';
    if (elapsed > 5) {
        time = (elapsed / 10) + " sec";
    }
    setStatusMsg(`출력 대기중 ... ${time}: ${data.ref}`);
  }


  const downloadWhenReady = (startTime:number, data:any) => {
    // 1분까지 허용
    setloading({loading: true, msg: ''});
    if ((new Date().getTime() - startTime) > 60000 * 2) {
      setStatusMsg('시간이 초과되었습니다. 다시 시도하시기 바랍니다.');
      setloading({loading: false, msg: ''});
    } else {
      updateWaitingMsg(startTime, data);
      setTimeout(function () {
        axios.get(`${import.meta.env.VITE_MAP_FISH_URL}${data.statusURL}`)
        .then((response) => {
          if (!response.data.done) {
            downloadWhenReady(startTime, data);
          } else {
            if (response.data.status === "error") {
              setStatusMsg('Error: ' + response.data.error);
            }
            else {
              axios.get<Blob>(`${import.meta.env.VITE_MAP_FISH_URL}${response.data.downloadURL}`, {
                responseType: 'blob',
              })
              .then((response) => {
                setStatusMsg('출력 완료');
                download(response.data, `print-${dayjs().format("YYYYMMDDHHmmss")}.pdf`);
              })
            }
            setloading({loading: false, msg: ''});
          }
        })
        .catch((error) => {
          console.error(error);
        });
      }, 500);
    }
  }

  const generatePrintSPEC = () => {
    if (!olMap) return;
    //"지도에 대한 설명을 작성한다.";
    const view = olMap.getView();
    const rotation = view.getRotation() * 180.0 / Math.PI; // toDegrees
    const projection = `EPSG:${coordinateSystem}`;

    const printExtentLayer = getExtentLayer();
    if (!printExtentLayer) return;
    const feature = (printExtentLayer.getSource() as VectorSource).getFeatureById('printbbox') as Feature<Geometry>;

    if (!feature) return;
    const geometry = feature.getGeometry();
    const extent = geometry?.getExtent();
    if (!extent) return;
    const bbox = transformExtent(extent, 'EPSG:3857', projection);
    if (!bbox) return;
    const aoi = [[bbox[0], bbox[1]], [bbox[2], bbox[1]], [bbox[2], bbox[3]], [bbox[0], bbox[3]], [bbox[0], bbox[1]]];
    

    const encodedlayers = [];
    const layers = olMap.getAllLayers();
    for (let i = layers.length - 1; i >= 0; i--) {
      const layer = layers[i];
      // check layer
      if (layer.getVisible() === true && layer != printExtentLayer) {
        const source = layer.getSource();
        let encodedLayer = null;
        if (source instanceof TileWMS) {
            // Get an encoded layer
            encodedLayer = encodeTileWMS(layer as TileLayer<TileWMS>);
        }
        // Only add the encoded layer if it is not null
        if (encodedLayer != null || encodedLayer != undefined) {
            encodedlayers.push(encodedLayer);
        }
      }
    }
    const {username} = userInfo;
    encodedlayers.unshift({
      "geoJson": {
        "features": [
            {
              "geometry": {
                "coordinates": olExtent.getCenter(bbox),
                "type": "Point"
              },
              "type": "Feature",
              "properties": {
                "name": "Draw Feature11",
                "style": "label"
              }
            }
        ],
        "type": "FeatureCollection"
      },
      "style": {
        "styleProperty": "style",
        "version": "1",
        "label": {
          "type": "point",
          "label": `${username ? username : 'unknown'}, ${dayjs().format("YYYY-MM-DD HH:mm:ss")}`,
          "fontFamily": "Malgun Gothic",
          "fontSize": "14px",
          "fontStyle": "normal",
          "fontOpacity": 0.4,
          "labelRotation": -30,
          "labelXOffset": 0,
          "labelYOffset": 0,
          "labelAlign": "cm"
        }
      },
      "type": "geojson"
    });

    const spec:MapFishSpecType = {
      layout: `${paperSize} ${printDirection}`,
      outputFormat: "pdf",
      outputFilename: "print-" + dayjs().format("YYYYMMDDHHmmss"),
      attributes: {
        map: {
          bbox: bbox,
          dpiSensitiveStyle: true,
          layers: encodedlayers,
          scale: mapScale,
          projection: projection,
          dpi: selectDPI,
        },
        title: printTitle,
        description: printContent
      }
    };

    if (pagingType === 'paging') {
      spec.attributes.map.areaOfInterest = { area: { type: "Polygon", coordinates: aoi }, display: "NONE" };
      spec.attributes.paging = { scale: printScale, aoiDisplay: "NONE" };
    }

    return spec;
  }

  const getExtentLayer = () => {
    if (!olMap) return;
    return olMap.getAllLayers().find((layer: Layer) => {
        const properties = layer.getProperties();
        return properties.name === 'print-extent';
    });
  }

  const createPrintExtent = (map: OlMap, width:number, height:number, mapScale:string) => {
    const mapResolution = map.getView().getResolution();
    if (mapResolution === undefined) return;

    const printResolution = scaleToResolution(map, mapScale, 72);

    if (printResolution === undefined) return;
    const scaleFactor = printResolution / mapResolution;
    const targetWidth = width * scaleFactor;
    const targetHeight = height * scaleFactor;

    return map.getView().calculateExtent([
        targetWidth,
        targetHeight
    ]);
  }

  // 지도 스케일 sorting
	const sortingMapScale = (scale:number | undefined, scales:number[]) => {
    if (!scale) throw new Error('scale is not defined');

		let _scale = 0;
		for(const item of scales){
			if(item <= scale){
				_scale = item;
				break;
			}
		}
		return parseInt(_scale.toString());
	}

  // 지도 스케일 생성
	const getMapScale = (map:OlMap | null, _dpi?:number) => {
    if (!map) throw new Error('map is not defined');
		const resolution = map.getView().getResolution();
		const mpu = map.getView().getProjection().getMetersPerUnit();
    if (mpu === undefined || resolution === undefined) return;


		const __dpi = _dpi || 25.4 / 0.28;
		const inchesPerMeter = 39.37;

		return Math.round(resolution * mpu * inchesPerMeter * __dpi);
	}

  const scaleToResolution = (map: OlMap, mapScale:string, _dpi:number) => {
    const mpu = map.getView().getProjection().getMetersPerUnit();
    if (mpu === undefined) return;
    const dpi = _dpi || 25.4 / 0.28;
    const inchesPerMeter = 39.37;

    return Number(mapScale) / mpu / inchesPerMeter / dpi;
  }

  const renderPrintExtent = (width:number, height:number, mScale:string, pScale:string) => {
    renderPrintDefaultExtent(width, height, mScale);
    if (pagingType === 'paging') renderPrintPagingExtent(width, height, mScale, pScale);
  }

  const renderPrintDefaultExtent = (width:number, height:number, mapScale:string) => {
    if (!olMap) return;
    const extentLayer = getExtentLayer();

    if (!extentLayer) return;
    const source = extentLayer.getSource() as VectorSource;
    source.refresh();

    const geomExtent = createPrintExtent(olMap, width, height, mapScale);
    if (!geomExtent) return;
    const style = new Style({
        stroke: new Stroke({
            color: 'rgba(0,0,255,1.0)',
            width: 2,
        }),
        fill: new Fill({
            color: 'rgba(0,0,255,0.1)'
        })
    });
    const feature = new Feature(fromExtent(geomExtent));
    feature.setId('printbbox');
    feature.setStyle(style);
    source.addFeature(feature);
  }

  const renderPrintPagingExtent = (width:number, height:number, mapScaleArgs:string, printScaleArgs:string) => {
    if (!olMap) return;
    const mScale = Number(mapScaleArgs);
    const pScale = Number(printScaleArgs);
    if(mScale <= pScale){
			return;
		}

    const extentLayer = getExtentLayer();
    
    if (!extentLayer) return;
    
    const source = extentLayer.getSource() as VectorSource;

    const PRINT_MAX_PAGE = 100;
    const mapScaleNumber = Number(mapScale);
    const printScaleNumber = Number(printScale);
    
    if(mapScaleNumber <= printScaleNumber) {
        return;
    }

    let widthSize = Math.max(parseInt(Math.ceil(mScale / pScale).toString()), 1);
		let heightSize = Math.max(parseInt(Math.ceil(mScale / pScale).toString()), 1);
		let pageSize = widthSize * heightSize;

		let tmpScale = pScale;
		let tmpScaleRatio = 0;

    if(pageSize > PRINT_MAX_PAGE) {
      alert("분할출력 최대매수를 초과하였습니다.");
      while (pageSize > PRINT_MAX_PAGE) {
        tmpScale *= Math.sqrt(pageSize / PRINT_MAX_PAGE);
        tmpScaleRatio = Math.pow(10, Math.floor(Math.log10(tmpScale) - 1));
        tmpScale = Math.ceil(tmpScale / tmpScaleRatio) * tmpScaleRatio;

        widthSize = Math.max(Math.floor(Math.ceil(mapScaleNumber / tmpScale)), 1);
        heightSize = Math.max(Math.floor(Math.ceil(mapScaleNumber / tmpScale)), 1);
        pageSize = widthSize * heightSize;
      }
    }

    const extent = createPrintExtent(olMap, width, height, mapScale);
    if (!extent) return;
    const extentHeight = getHeight(extent) / heightSize;
    const extentWidth = getWidth(extent) / widthSize;
    const bottomLeft = getBottomLeft(extent);

    const resolution = olMap.getView().getResolution();
    if (resolution === undefined) return;
    const textSize = Math.round((extentHeight/resolution) - 6);

    widthSize++;
    heightSize++;
    pageSize = widthSize * heightSize;

    for (let i = 0; i < pageSize; i++) {
      const row = Math.floor(i / widthSize);
      const column = Math.floor(i % widthSize);
      const x = bottomLeft[0] - extentWidth * 0.5 + column * extentWidth;
      const y = bottomLeft[1] - extentHeight * 0.5 + row * extentHeight;

      const boundingExtent = olBoundingExtent([[x, y], [x + extentWidth, y + extentHeight]]);
      const feature = new Feature(fromExtent(boundingExtent));
      const style = new Style({
        stroke: new Stroke({
          color: 'rgba(0,0,0,1.0)',
          width: 2,
        }),
        text: new Text({
          font: textSize + 'px Calibri,sans-serif',
          fill: new Fill({ color: '#000' }),
          stroke: new Stroke({
            color: '#fff', width: 2
          }),
          overflow: true,
          text: i.toString()
        })
      });

      feature.setId('printbbox'+i);
      feature.setStyle(style);
      source.addFeature(feature);
    }
  }

  // map scale 변경시 인쇄 형식에 따라 print scale list 변경 (disabled)
	const sortingPrintScale = (scales:string[], scale:string) => {
		if(pagingType === "paging") {
			return sortingPrintPagingScale(scales, scale);
		}
		return sortingPrintDefaultScale(scales, scale);
	}

	// 인쇄 형식이 단일 출력일 때 printScaleList
	const sortingPrintDefaultScale = (scales:string[], scale:string) => {
		let _scale = "";
		const _scales:PrintScaleType[] = scales.map((item) => {
			if(item == scale){
				_scale = item;
				return {scale: item, disabled: false} as PrintScaleType;
			}else{
				return {scale: item, disabled: true} as PrintScaleType;
			}
		});
    const printScale = _scales.find((temp)=>!temp.disabled);
    if (printScale) setPrintScale(printScale.scale);
		setPrintScales(...[_scales]);
		return _scale;
	}

	// 인쇄 형식이 분할 출력일 때 printScaleList
	const sortingPrintPagingScale = (scales:string[], scale:string) => {
		const _printScale = scales.filter((item, idx) => scales[idx-1] === scale)[0];
		const _scales = scales.map((item) => {
			// _printScale = scale;
			if(item < scale){
				//setPrintScale(_printScale);
				return {scale: item, disabled: false} as PrintScaleType;
			}else{
				return {scale: item, disabled: true} as PrintScaleType;
			}
		}).map((item) => {
			let pageSize = Math.max(parseInt(Math.ceil(Number(scale)/Number(item.scale)).toString()), 1);
			pageSize *= pageSize;
			if(pageSize > PRINT_MAX_PAGE){
				return {scale: item.scale, disabled: true} as PrintScaleType;
			}
			return item;
		});

    const printScale = _scales.find((temp)=>!temp.disabled);
    if (printScale) setPrintScale(printScale.scale);
    
		setPrintScales(...[_scales]);
		return _printScale;
		// if(_printScale){
		// 	setPrintScale(_printScale);
		// }
	}


  useEffect(() => {
    if (!printPortalOpen) return;

    const {viewer} = globeController;
    if (!viewer) return;

    const extent = viewer.camera.computeViewRectangle(viewer.scene.globe.ellipsoid);
    if (!extent) return;

    const ll = Cesium.Rectangle.southwest(extent)
    const ur = Cesium.Rectangle.northeast(extent);
    
    // 정보 변환  
    const llPoint = [Cesium.Math.toDegrees(ll.longitude), Cesium.Math.toDegrees(ll.latitude)];
    const urPoint = [Cesium.Math.toDegrees(ur.longitude), Cesium.Math.toDegrees(ur.latitude)];
    const boundingExtent = olExtent.boundingExtent([llPoint, urPoint]);
    const center = olExtent.getCenter(boundingExtent);
    const googleExtent = transformExtent(boundingExtent, "EPSG:4326", "EPSG:3857");
    olMap = new OlMap({
      target: "print-map",
      view: new OlView({
        center: [0,0],
        zoom: 10,
        projection: "EPSG:3857",
        constrainOnlyCenter: true
      }),
      layers: getOlLayer(getLayersFromNodeModels(treeData)),
      controls: defaults().extend([
        new ScaleLine({
          units: 'metric',
          bar: true,
          steps: 2,
          text: true,
          minWidth: 140
        })
      ])
    });

    //olMap.getAllLayers().find

    olMap.getView().fit(googleExtent);
    renderPrintExtent( clientWidth, clientHeight, mapScale, printScale);

    olMap.getView().on('propertychange', ()=>{
      setChangedMap(true);
    });

    return () => {
      if (olMap) {
        olMap.setTarget(undefined);
        olMap = null;
      }
    }
  }, [printPortalOpen]);
  const node = (
    <div className="dialog-symbol darkMode" style={dialogWrapperStyle}>
      <div className="dialog-title">
        <h3>지도출력</h3>
        <button className="close floatRight" onClick={()=>{setPrintPortalOpen(false)}}></button>
      </div>
      <div className="dialog-content">
        <div id="print-map" style={printMapStyle}></div>
        <div id="print-option" style={printOptionStyle}>
          <ul className="PrintGroup">
            <li>
              <label className="print-option-label" htmlFor="selectPaperSize">인쇄용지</label>
              <select className="form-control" id="selectPaperSize" value={paperSize} onChange={(e)=>{
                setPaperSize(e.target.value);
              }}>
                <option value="A0">A0</option>
                <option value="A1">A1</option>
                <option value="A2">A2</option>
                <option value="A3">A3</option>
                <option value="A4">A4</option>
              </select>
            </li>
            <li>
              <label className="print-option-label" htmlFor="selectPrintDirection">인쇄방향</label>
              <select className="form-control" id="selectPrintDirection" value={printDirection} onChange={(e)=>{
                setPrintDirection(e.target.value);
              }}>
                <option value="landscape">가로(landscape)</option>
                <option value="portrait">세로(portrait)</option>
              </select>
            </li>
            <li>
              <label className="print-option-label" htmlFor="selectDPI">인쇄품질</label>
              <select className="form-control" id="selectDPI" value={selectDPI} onChange={(e)=>{
                setSelectDPI(e.target.value);
              }}>
                {
                  dpis.map((dpi, index) => {
                    return <option key={index} value={dpi}>{dpi}</option>
                  })
                }
              </select>
            </li>
            <li>
              <label className="print-option-label" htmlFor="selectPagingType">인쇄형식</label>
              <select className="form-control" id="selectPagingType" value={pagingType}onChange={(e)=>{
                setPagingType(e.target.value);
              }}>
                <option value="default">단일 출력</option>
                <option value="paging">분할 출력</option>
              </select>
            </li>
            <li>
              <label className="print-option-label" htmlFor="selectMapScale">지도축척</label>
              <select className="form-control" id="selectMapScale" value={mapScale}onChange={(e)=>{
                setMapScale(e.target.value);
              }}>
                {
                  mapScales.map((scale, index) => {
                    return <option key={index} value={scale}>{`1 : ${scale}`}</option>
                  })
                }
                </select>
            </li>
            <li>
              <label className="print-option-label" htmlFor="selectPrintScale">인쇄축척</label>
              <select className="form-control" id="selectPrintScale" value={printScale}onChange={(e)=>{
                setPrintScale(e.target.value);
              }}>
                {
                  printScales.map((scale, index) => {
                    return <option key={index} value={scale.scale} disabled={scale.disabled}>{`1 : ${scale.scale}`}</option>
                  })
                }
              </select>
            </li>
            <li>
              <label className="print-option-label" htmlFor="coordinateSystem">UTM zone</label>
              <select className="form-control" id="coordinateSystem" value={coordinateSystem} onChange={(e)=>{
                setCoordinateSystem(e.target.value);
              }}>
                <option value="32651">UTM zone 51N</option>
                <option value="32652">UTM zone 52N</option>
              </select>
            </li>
            <li>
              <label className="print-option-label" htmlFor="printTitle">제목</label>
              <input type="text" className="width-200 form-control" id="printTitle" placeholder="제목을 작성해주세요" value={printTitle} onChange={(e)=>{
                setPrintTitle(e.target.value);
              }}/>
            </li>
            <li>
              <label className="print-option-label" htmlFor="printContent">내용</label>
              <input type="text" className="width-200 form-control " id="printContent" placeholder="내용을 작성해주세요" value={printContent} onChange={(e)=>{
                setPrintContent(e.target.value);
              }}/>
            </li>
          </ul>
        </div>
      </div>
      <div className="darkMode-btn">
        <div style={{position: 'absolute', left: '50px',bottom: '10px', color:'white', fontSize:'11px', whiteSpace:'nowrap',width:'600px',overflow:'hidden'}}>
          <span>{statusMsg}</span>
        </div>
        <button type="button" className="register" style={{position:'absolute', right:'30px',bottom: '24px'}} onClick={print}>
            출력
        </button>
      </div>
    </div>
  )

  return el && printPortalOpen ? ReactDOM.createPortal(node, el) : null;
}