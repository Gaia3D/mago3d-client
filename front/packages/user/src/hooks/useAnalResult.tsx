import { useGlobeController } from "@/components/providers/GlobeControllerProvider";
import { OpenResultState, RasterProfileResult, ResultLayerDataType, ResultLayerStepType, ResultLayerType, ResultLayersState, ResultStepType, ValueAndColor, rasterProfileResultsState } from "@/recoils/Analysis"
import { FeatureCollection, Geometry, Position, Properties, } from "@turf/turf";
import { produce } from "immer";
import * as Cesium from "cesium";
import { useRecoilState, useSetRecoilState } from "recoil";
import { LoadingStateType, loadingState } from "@/recoils/Spinner";
import axios from "axios";
import booleanValid from "@turf/boolean-valid";
import { choroplethColorList, generateUniqueColors, getClassBreaks, getClassIndex } from "@/api/util";

export const useAnalResult = () => {
  const setloading = useSetRecoilState<LoadingStateType>(loadingState);
  const setRasterProfileResults = useSetRecoilState<RasterProfileResult[]>(rasterProfileResultsState);
  const {globeController } = useGlobeController();
  const {viewer} = globeController;
  const [openResult, setOpenResult] = useRecoilState<boolean>(OpenResultState);
  const [resultLayers, setResultLayers] = useRecoilState<Record<string, ResultLayerType>>(ResultLayersState);

  const groupByProperties = (properties:Properties[]) => 
    properties.reduce<ResultStepType>((acc, cur, idx) => {
    const keys = Object.keys(cur as any);
    keys.forEach((key) => {
      if (key === 'id') return;
      const value = (cur as any)[key];
      
      if (typeof value === 'number') {
        // group by value, no permit same value, and sort
        if (!acc.stage[key]) {
          acc.stage[key] = [];
        }
        if (!acc.stage[key].includes(value)) {
          acc.stage[key].push(value);
        }
      }
      if (!acc.classify[key]) {
        acc.classify[key] = {};
      }
      acc.classify[key][value] = '';
    });

    if (idx === properties.length - 1) {
      Object.keys(acc.classify).forEach((key) => {
        if (Object.keys(acc.classify[key]).length === 1 && Object.keys(acc.classify[key])[0] === 'null') delete acc.classify[key];
      });

      Object.keys(acc.classify).forEach((key) => {
        const keys = Object.keys(acc.classify[key]); 
        const cssColors = generateUniqueColors(keys.length);
        keys.forEach((field, idx) => {
          acc.classify[key][field] = cssColors[idx];
        });
      });

      // sort stage
      Object.keys(acc.stage).forEach((key) => {
        acc.stage[key] = acc.stage[key].sort((a, b) => a - b);
      });
    }

    return acc;
  }, {
    classify: {},
    stage: {}
  })

  const handleResult = (result:ResultLayerType) => {
    const {type, data, isCustom, customFunction} = result;
    if (type === ResultLayerDataType.Entity) {
      const dataSource = getOrCreateDataSource(result.layerName);
      dataSource.entities.removeAll();

      if (!data) {
        throw new Error('result is null');
      }
      if (!isCustom) {
        const {fillColor, fillOpacity, lineColor, lineOpacity, lineWidth} = result;
        const {features} = data;
        if (features.length === 0) {
          alert('분석 결과가 없습니다.');
          return;
        }

        if (features.length === 1) {
          const {geometry} = features[0];
          if (!geometry) {
            alert('분석 결과가 없습니다.');
            return;
          }
        }
        const propertiesArray:Properties[] = [];
        const entites = [];
        features.forEach((feature) => {
          const {geometry, properties} = feature;
          
          /* if (!booleanValid(feature)) { 
            return;
          } */
          propertiesArray.push(properties);
          const {type, coordinates} = geometry as Geometry;
          
          const propertiesBag = new Cesium.PropertyBag(properties);
          
          if (type === 'MultiPolygon') {
            const fColor = Cesium.Color.fromCssColorString(fillColor ? fillColor : '#F03000');
            const lColor = Cesium.Color.fromCssColorString(lineColor ? lineColor : '#FFFFFF');
            coordinates.forEach((polygonSets) => {
              if (Array.isArray(polygonSets)) {
                polygonSets.forEach((polygonCoordinates) => {
                  const hierarchy = (polygonCoordinates as Position[]).map((coordinate) => Cesium.Cartesian3.fromDegrees(coordinate[0], coordinate[1]));
                  const entity = dataSource.entities.add({
                    polygon: {
                      hierarchy: new Cesium.PolygonHierarchy(hierarchy),
                      material: fColor.withAlpha(fillOpacity !== undefined ? fillOpacity : 0.7),
                      heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                    },
                    polyline: {
                      positions: hierarchy,
                      width: lineWidth !== undefined ? lineWidth : 1,
                      material: lColor.withAlpha(lineOpacity !== undefined ? lineOpacity : 0.7),
                      clampToGround: true,
                    },
                    properties: propertiesBag,
                  });
                  entites.push(entity);
                });
              }
            });
          } else if ( type === "Point") {
            const [longitude, latitude] = coordinates as Position;
            const point = Cesium.Cartesian3.fromDegrees(longitude, latitude);
            const entity = dataSource.entities.add({
              position: point,
              point: {
                pixelSize: 10,
                color: Cesium.Color.fromCssColorString(fillColor ? fillColor : '#F03000'),
                outlineColor: Cesium.Color.fromCssColorString(lineColor ? lineColor : '#FFFFFF'),
                outlineWidth: lineWidth !== lineWidth ? lineWidth : 1,
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
              },
              properties: propertiesBag,
            });
            entites.push(entity);
          } else if (type === "MultiLineString") {
            coordinates.forEach((lineCoordinates) => {
              const positions = (lineCoordinates as Position[]).map((coordinate) => Cesium.Cartesian3.fromDegrees(coordinate[0], coordinate[1]));
              const entity = dataSource.entities.add({
                polyline: {
                  positions,
                  width: lineWidth !== undefined ? lineWidth : 1,
                  material: Cesium.Color.fromCssColorString(lineColor ? lineColor : '#FFFFFF').withAlpha(lineOpacity !== undefined ? lineOpacity : 0.7),
                  clampToGround: true,
                },
                properties: propertiesBag,
              });
              entites.push(entity);
            });
          }
        });

        result.stepResult = groupByProperties(propertiesArray);
        return entites.length;
      } else {
        if (customFunction) return customFunction(data, dataSource);
      }
    }
  }

  const changeEntityColor = ({entity, fillColor, fillOpacity, lineColor, lineOpacity, lineWidth}
    :{entity:Cesium.Entity, fillColor:string | undefined, fillOpacity:number | undefined, lineColor:string | undefined, lineOpacity:number | undefined, lineWidth:number | undefined}) => {
      const getCssColorFromMaterial = (material:Cesium.MaterialProperty) => {
        const {color} = material.getValue(Cesium.JulianDate.now());
        return getCssColorFromColor(color);
      }
  
      const getCssColorFromColor = (color:Cesium.Color) => color.toCssColorString();
  
      const selectColor = (prevColor:string, newColor:string | undefined) => newColor ? newColor : prevColor;
      const selectOpacity = (newOpacity:number | undefined) => newOpacity !== undefined ? newOpacity : 1;

      if (entity.polygon) {
        const prevCssColor = getCssColorFromMaterial(entity.polygon.material);
        entity.polygon.material = new Cesium.ColorMaterialProperty(Cesium.Color.fromCssColorString(selectColor(prevCssColor, fillColor)).withAlpha(selectOpacity(fillOpacity)));
      }

      if (entity.polyline) {
        const prevCssColor = getCssColorFromMaterial(entity.polyline.material);
        entity.polyline.material = new Cesium.ColorMaterialProperty(Cesium.Color.fromCssColorString(selectColor(prevCssColor, lineColor)).withAlpha(selectOpacity(lineOpacity)));
        entity.polyline.width = new Cesium.ConstantProperty(lineWidth);
      }

      if (entity.point) {
        const prevColorProperty = entity.point.color;
        const prevCssColor = prevColorProperty ? getCssColorFromColor(prevColorProperty.getValue(Cesium.JulianDate.now(), new Cesium.Color())) : '#F03000';
        entity.point.color = new Cesium.ConstantProperty(Cesium.Color.fromCssColorString(selectColor(prevCssColor, fillColor)).withAlpha(selectOpacity(fillOpacity)));

        const prevOutlineColorProperty = entity.point.outlineColor;
        const prevOutlineColor = prevOutlineColorProperty ? getCssColorFromColor(prevOutlineColorProperty.getValue(Cesium.JulianDate.now(), new Cesium.Color())) : '#FFFFFF';
        entity.point.outlineColor = new Cesium.ConstantProperty(Cesium.Color.fromCssColorString(selectColor(prevOutlineColor, lineColor)).withAlpha(selectOpacity(lineOpacity)));
        entity.point.outlineWidth = new Cesium.ConstantProperty(lineWidth);
      }

  }

  const changeSimpleEntityStyle = ({layerName,fillColor, fillOpacity, lineColor, lineOpacity, lineWidth}
    :{layerName:string, fillColor:string | undefined, fillOpacity:number | undefined, lineColor:string | undefined, lineOpacity:number | undefined, lineWidth:number | undefined}) => {
    const dataSource = getOrCreateDataSource(layerName);
    dataSource.entities.values.forEach((entity) => changeEntityColor({entity, fillColor, fillOpacity, lineColor, lineOpacity, lineWidth}));
  };

  const changeCategorizedEntityStyle = ({layerName, key, valueAndColors, fillOpacity, lineColor, lineOpacity, lineWidth}
    :{layerName:string, key:string, valueAndColors:ValueAndColor, fillOpacity:number | undefined, lineColor:string | undefined, lineOpacity:number | undefined, lineWidth:number | undefined}) => {
    const dataSource = getOrCreateDataSource(layerName);
    dataSource.entities.values.forEach((entity) => {
      const properties:Cesium.PropertyBag = entity.properties?.getValue(Cesium.JulianDate.now());
      if (!properties) return;
      const value = properties[key];
      const fillColor = valueAndColors[value];
      changeEntityColor({entity, fillColor, fillOpacity, lineColor, lineOpacity, lineWidth})
    });
  }

  const changeGraduatideEntityStyle = ({layerName, key, colorKey, fillOpacity, lineColor, lineOpacity, lineWidth}
    :{layerName:string, key:string, colorKey:string, fillOpacity:number | undefined, lineColor:string | undefined, lineOpacity:number | undefined, lineWidth:number | undefined}) => {
    const dataSource = getOrCreateDataSource(layerName);
    const values = dataSource.entities.values.map((entity) => {
      const properties:Cesium.PropertyBag = entity.properties?.getValue(Cesium.JulianDate.now());
      if (!properties) return;
      return properties[key];
    }).filter((value) => value !== undefined);

    const colors = choroplethColorList.find((item) => item.title === colorKey)?.value;

    if (!colors) throw new Error('colors is null');
    const classBreaks = getClassBreaks(values, colors.length);
    /* console.info(key);
    console.info(colors);
    console.info(values);
    console.info(classBreaks);

    console.info(getClassIndex(10, classBreaks));
    console.info(getClassIndex(100, classBreaks));
    console.info(getClassIndex(110, classBreaks));
    console.info(getClassIndex(120, classBreaks));
    console.info(getClassIndex(130, classBreaks)); */

    dataSource.entities.values.forEach((entity) => {
      const properties:Cesium.PropertyBag = entity.properties?.getValue(Cesium.JulianDate.now());
      if (!properties) return;
      const value = properties[key];
      const index = getClassIndex(value, classBreaks);
      const fillColor = colors[index];
      changeEntityColor({entity, fillColor, fillOpacity, lineColor, lineOpacity, lineWidth});
    });
  }

  const getOrCreateDataSource = (layerName:string) => {
    const dataSources = viewer?.dataSources.getByName(layerName);
    if (dataSources && dataSources.length > 0) {
      return dataSources[0];
    }

    const dataSource = new Cesium.CustomDataSource(layerName);
    viewer?.dataSources.add(dataSource);
    
    return dataSource;
  }

  const addOrReplaceResult = (result:ResultLayerType) => {
    setResultLayers(produce((draft) => {
      const handled = handleResult(result);
      if (handled && handled > 0) draft[result.layerName] = result;
      else delete draft[result.layerName];
    }));
  }

  const analysisFeatureCollection = async ({xml, result}:{xml:string, result:ResultLayerType}) => {
    try {
      setloading({loading: true, msg: '분석중...'});
      setOpenResult(false);
      const analysis = await axios.post(import.meta.env.VITE_GEOSERVER_WPS_SERVICE_URL, xml, {
        headers: {
          'Content-Type': 'application/xml;charset=utf-8'
        }
      });
  
      const { data }:{data:FeatureCollection} = analysis;
      result.data = data;
      addOrReplaceResult(result);
    } catch (error) {
      console.error(error);
      alert('분석에 실패하였습니다.');
    } finally {
      setloading({loading: false, msg: ''});
    }
  }

  const analysisBlobImage = async ({xml, result, hierarchy, type}:{xml:string, result:ResultLayerType, hierarchy:Cesium.Cartesian3[], type:'image/png' | 'image/tiff'}) => {
    try {
      setloading({loading: true, msg: '분석중...'});
      setOpenResult(false);
      const analysis = await axios.post(import.meta.env.VITE_GEOSERVER_WPS_SERVICE_URL, xml, {
        headers: {
          'Content-Type': 'application/xml;charset=utf-8',
        },
        responseType: 'arraybuffer'
      });
      const dataSource = getOrCreateDataSource(result.layerName);
      dataSource.entities.removeAll();

      const arrayBufferView = new Uint8Array(analysis.data);
      const blob = new Blob([arrayBufferView], { type });
      const urlCreator = window.URL || window.webkitURL;
      const imageUrl = urlCreator.createObjectURL(blob);

      dataSource.entities.add({
        polygon: {
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
            hierarchy,
            material: new Cesium.ImageMaterialProperty({
              image: new Cesium.ConstantProperty(imageUrl),
            })
        }
      });

      setResultLayers(produce((draft) => {
        draft[result.layerName] = result;
      }));

    } catch (error) {
      console.error(error);
      alert('분석에 실패하였습니다.');
    } finally {
      setloading({loading: false, msg: ''});
    }
  }

  const pointStacker = (layerName:string, result:ResultLayerType, bboxLowerCorner: string, bboxUpperCorner: string) => {
    const {viewer, pointStackerLayer} = globeController;
      
    if(!viewer) return;
    setOpenResult(false);
    const scene = viewer.scene;
    const imageryLayers = scene.imageryLayers;
    if (pointStackerLayer) {
      imageryLayers.remove(pointStackerLayer, true);
      globeController.setPointStackerLayer.call(globeController, undefined);
    }

    const [minx, miny] = bboxLowerCorner.split(' ');
    const [maxx, maxy] = bboxUpperCorner.split(' ');
    
    const imageLayer = new Cesium.ImageryLayer(
      new Cesium.WebMapServiceImageryProvider({
        url: `${import.meta.env.VITE_ANAL_GEOSERVER_URL}/wms?`,
        layers: `mdtp:${layerName}`,
        parameters: {
          service: "WMS",
          version: "1.3.0",
          request: "GetMap",
          transparent: "true",
          format: "image/png",
          tiled: true,
          STYLES: 'pointStacker'
        },
      }),
      {
        show: true,
        rectangle: Cesium.Rectangle.fromDegrees(Number(minx), Number(miny), Number(maxx), Number(maxy)),
      },
    );
    globeController.setPointStackerLayer.call(globeController, imageLayer);
    imageryLayers.add(imageLayer);

    setResultLayers(produce((draft) => {
      draft[result.layerName] = result;
    }));
  }

  const getVisible = (layerName:string) => {
    const {type} = resultLayers[layerName];
    if (type === ResultLayerDataType.Entity) {
      const dataSource = getOrCreateDataSource(layerName);
      return dataSource.show;
    } else {
      const {pointStackerLayer} = globeController;
      return !!pointStackerLayer?.show;
    }
  }

  const toggleVisible = (layerName:string) => {
    const {type} = resultLayers[layerName];
    if (type === ResultLayerDataType.Entity) {
      const dataSource = getOrCreateDataSource(layerName);
      dataSource.show = !dataSource.show;
    } else {
      const {pointStackerLayer} = globeController;
      if (pointStackerLayer) pointStackerLayer.show = !pointStackerLayer.show;
    }
  }

  const deleteLayer = (result:ResultLayerType) => {
    const {type, layerName} = result;
    if (type === ResultLayerDataType.Entity) {
      const dataSource = getOrCreateDataSource(layerName);
      dataSource.entities.removeAll();
    } else {
      const {pointStackerLayer} = globeController;
      if (pointStackerLayer) {
        const imageryLayers = viewer?.scene.imageryLayers;
        imageryLayers?.remove(pointStackerLayer, true);
        globeController.setPointStackerLayer.call(globeController, undefined);
      }
    }
  }

  const deleteResult = (layerName:string) => {
    setResultLayers(produce((draft) => {
      const result = draft[layerName];
      if (!result) return;

      deleteLayer(result);
      delete draft[layerName];
    }));

    if (layerName === '래스터 단면도 분석') {
      setRasterProfileResults([]);
    }
  }

  const deleteAllResult = () => {
    setResultLayers(produce((draft) => {
      Object.keys(draft).forEach((key) => {
        const result = draft[key];
        if (!result) return;
        deleteLayer(result);

        delete draft[key];
      });
    }));
    setRasterProfileResults([]);
  }

  return {
    openResult,
    setOpenResult,
    setResultLayers,
    resultLayers,
    setloading,
    analysisFeatureCollection,
    getOrCreateDataSource,
    analysisBlobImage,
    pointStacker,
    getVisible,
    toggleVisible,
    deleteResult,
    deleteAllResult,
    changeSimpleEntityStyle,
    changeCategorizedEntityStyle,
    changeGraduatideEntityStyle
  }
}