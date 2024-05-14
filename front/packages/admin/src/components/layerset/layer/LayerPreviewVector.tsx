import {useEffect, useRef, useState} from "react";
import * as Cesium from "cesium";
import {
    ApplyLayerStyleDocument, ClassifyAttributeDocument,
    CreateLayerStyleDocument, CreateStyleInput,
    DeleteLayerStyleDocument,
    LayerAsset, LayersetAssetDocument, RemoteDocument, RemoteQueryVariables, Rule, UpdateLayerStyleDocument
} from "@src/generated/gql/layerset/graphql";
import WarningMessage from "../../dataset/asset/WarningMessage";
import {SubmitHandler, useForm} from "react-hook-form";
import {useLazyQuery, useMutation, useSuspenseQuery} from "@apollo/client";
import {getWmsLayerImageProvider} from "@src/components/layerset/utils/utils";

function extractPath(url: string): string {
    const parsedUrl = new URL(url);
    return parsedUrl.pathname + parsedUrl.search + parsedUrl.hash;
}

const LayerPreviewVector = ({asset}: { asset: LayerAsset }) => {

    const {properties} = asset;
    const {layer} = properties;
    const {resource} = layer;

    let variables: RemoteQueryVariables = { href : resource.href };

    // 운영환경의 경우 현재 페이지의 URL을 기반으로 전체 URL을 구성
    if (import.meta.env.MODE === 'production') {
        const path = extractPath(resource.href);

        const { protocol, hostname, port } = window.location;

        // 포트가 있는 경우 콜론과 함께 포트 번호를 추가
        const portPart = port ? `:${port}` : '';

        // 전체 URL 구성
        const href = `${protocol}//${hostname}${portPart}${path}`;
        variables =  { href };
    }

    const { data } = useSuspenseQuery(RemoteDocument, { variables });

    const { nativeName, attributes, latLonBoundingBox } = data.remote.featureType;
    const { attribute } = attributes;

    const [ getData ] = useLazyQuery(ClassifyAttributeDocument);

    const {register, handleSubmit, reset} = useForm<CreateStyleInput>();

    const [ applyStyle ] = useMutation(ApplyLayerStyleDocument, {
        refetchQueries: [LayersetAssetDocument],
        onCompleted: (data) => {
            //console.info(data);
            alert("스타일이 적용되었습니다.");
        },
        onError: (error) => {
            console.error(error);
            alert('에러가 발생하였습니다. 관리자에게 문의하시기 바랍니다.');
        }
    });

    const [ createStyle ] = useMutation(CreateLayerStyleDocument, {
        onCompleted: (data) => {
            //console.info(data);
            const {id} = asset;
            applyStyle({ variables: { id: id, styleId: data.createStyle.id } });
        },
        onError: (error) => {
            console.error(error);
            alert('에러가 발생하였습니다. 관리자에게 문의하시기 바랍니다.');
        }
    });

    const [ updateStyle ] = useMutation(UpdateLayerStyleDocument, {
        refetchQueries: [LayersetAssetDocument, RemoteDocument],
        onCompleted: (data) => {
            //console.info(data);
            alert("스타일이 적용되었습니다.");
        },
        onError: (error) => {
            console.error(error);
            alert('에러가 발생하였습니다. 관리자에게 문의하시기 바랍니다.');
        }
    });

    const [ deleteStyle ] = useMutation(DeleteLayerStyleDocument, {
        refetchQueries: [LayersetAssetDocument, RemoteDocument],
        onCompleted: (data) => {
            //console.info(data);
            alert("스타일이 삭제되었습니다.");
        },
        onError: (error) => {
            console.error(error);
            alert('에러가 발생하였습니다. 관리자에게 문의하시기 바랍니다.');
        }
    });

    const defaultStyles = asset.styles?.filter(style => style.defaultStatus);
    const defaultStyle = defaultStyles?.[0];

    const [styleName, setStyleName] = useState<string>(defaultStyle?.name ?? "");
    const [shape, setShape] = useState<string>(defaultStyle?.context?.shape ?? "circle");
    const [size, setSize] = useState<number>(defaultStyle?.context?.size ?? 5);
    const [strokeColor, setStrokeColor] = useState<string>(defaultStyle?.context?.strokeColor ?? "#000000");
    const [fillColor, setFillColor] = useState<string>(defaultStyle?.context?.fillColor ?? "#000000");
    const [lineWidth, setLineWidth] = useState<number>(defaultStyle?.context?.strokeWidth ?? 1);
    const [fillOpacity, setFillOpacity] = useState<number>(defaultStyle?.context?.fillOpacity ?? 0.5);
    const [strokeOpacity, setStrokeOpacity] = useState<number>(defaultStyle?.context?.strokeOpacity ?? 0.5);
    const [count, setCount] = useState<string>("&count=1");
    const [selectedAttribute, setSelectedAttribute] = useState<string>(defaultStyle?.context?.attribute ?? "");
    const [rules, setRules] = useState<Rule[]>([]);

    const viewerRef = useRef<Cesium.Viewer | null>(null);
    const dataSourceRef = useRef<Cesium.GeoJsonDataSource | null>(null);

    const [isPointStyleVisible, setIsPointStyleVisible] = useState<boolean>(true);
    const [isPolylineStyleVisible, setIsPolylineStyleVisible] = useState<boolean>(false);
    const [isPolygonStyleVisible, setIsPolygonStyleVisible] = useState<boolean>(false);
    const [isAttributeStyleVisible, setIsAttributeStyleVisible] = useState<boolean>(false);

    const [isNumberStyleVisible, setIsNumberStyleVisible] = useState<boolean>(false);
    const [isStringStyleVisible, setIsStringStyleVisible] = useState<boolean>(false);

    useEffect(() => {
        const viewer = new Cesium.Viewer('preview-layer', {
            geocoder: false,
            homeButton: false,
            baseLayerPicker: false,
            sceneModePicker: false,
            navigationHelpButton: false,
            animation: false,
            timeline: false,
            fullscreenButton: false,
            shouldAnimate: true,
            infoBox: false,
            selectionIndicator: false,
        });

        viewer.imageryLayers.removeAll();
        // 운영환경에서는 배경지도를 WMS로 설정
        if (import.meta.env.MODE === 'production') {
            const baseImageryProvider = getWmsLayerImageProvider(import.meta.env.VITE_BASE_LAYER_NAME);
            viewer.imageryLayers.addImageryProvider(baseImageryProvider);
        } else {
            // 개발환경에서는 OSM으로 설정
            const osmImageryProvider = new Cesium.OpenStreetMapImageryProvider({ url: 'https://a.tile.openstreetmap.org/' });
            viewer.imageryLayers.addImageryProvider(osmImageryProvider);
        }
        viewerRef.current = viewer;
        return () => {
            viewer.destroy();
        }
    }, []);

    useEffect(() => {
        if (!viewerRef.current) return;
        if (isAttributeStyleVisible) return;

        viewerRef.current?.dataSources.removeAll();

        const {properties} = asset;
        const {layer} = properties;
        const {resource} = layer;

        const wfsUrl = import.meta.env.VITE_GEOSERVER_WFS_SERVICE_URL + 'service=WFS&version=2.0.0&request=GetFeature&typeName=' + resource.name + '&outputFormat=application/json&propertyName=wkb_geometry'+ count;

        // WFS 레이어를 GeoJSON으로 가져와서 뷰어에 추가
        const geoJsonDataSource = Cesium.GeoJsonDataSource.load(wfsUrl, {
            stroke: Cesium.Color.fromCssColorString(strokeColor),
            fill: Cesium.Color.fromCssColorString(fillColor).withAlpha(fillOpacity),
        });
        viewerRef.current?.dataSources.add(geoJsonDataSource);

        // 데이터소스가 로드된 후 카메라를 이동
        geoJsonDataSource.then(dataSource => {
            viewerRef.current?.flyTo(dataSource);
            dataSource.entities.values.forEach(entity => {
                // 엔티티가 포인트 타입인 경우, Billboard를 Point로 변경합니다.
                if (entity.billboard) {
                    // 포인트 엔티티 생성
                    entity.point = new Cesium.PointGraphics({
                        color: Cesium.Color.fromCssColorString(fillColor).withAlpha(fillOpacity), // 채우기 색상
                        pixelSize: size, // 크기
                        outlineColor: Cesium.Color.fromCssColorString(strokeColor).withAlpha(strokeOpacity), // 외곽선 색상
                        outlineWidth: lineWidth // 외곽선 두께
                    });
                    // 기존의 Billboard를 제거합니다.
                    entity.billboard = undefined;
                }

                // 엔티티가 폴리곤 타입인 경우, 폴리곤 outline의 스타일을 수정할 수 없어 Polyline을 추가합니다.
                if (!entity.polygon) return;
                // 기존의 Polygon 외곽선을 제거합니다.
                entity.polygon.outline = undefined;
                const hierarchy = entity.polygon.hierarchy.getValue(Cesium.JulianDate.now());
                const positions = hierarchy.positions;
                dataSource.entities.add({
                    polyline: {
                        positions: positions,
                        width: lineWidth,
                        material: Cesium.Color.fromCssColorString(strokeColor).withAlpha(strokeOpacity),
                    }
                });
            });
            dataSourceRef.current = dataSource;
        });

    }, [count, isAttributeStyleVisible]);

    useEffect(() => {
        if (!viewerRef.current || !dataSourceRef.current) return;

        dataSourceRef.current.entities.values.forEach(entity => {
           if (entity.polygon) {
               entity.polygon.material = new Cesium.ColorMaterialProperty(Cesium.Color.fromCssColorString(fillColor).withAlpha(fillOpacity));
               entity.polygon.outlineColor = new Cesium.ConstantProperty(Cesium.Color.fromCssColorString(strokeColor).withAlpha(strokeOpacity));
           }
           if (entity.polyline) {
               entity.polyline.material = new Cesium.ColorMaterialProperty(Cesium.Color.fromCssColorString(strokeColor).withAlpha(strokeOpacity));
               entity.polyline.width = new Cesium.ConstantProperty(lineWidth);
           }
           if (entity.point) {
               // TODO: shape를 반영하도록..
               entity.point.color = new Cesium.ConstantProperty(Cesium.Color.fromCssColorString(fillColor).withAlpha(fillOpacity));
               entity.point.pixelSize = new Cesium.ConstantProperty(size);
               entity.point.outlineColor = new Cesium.ConstantProperty(Cesium.Color.fromCssColorString(strokeColor).withAlpha(strokeOpacity));
               entity.point.outlineWidth = new Cesium.ConstantProperty(lineWidth);
           }
        });

    }, [shape, size, strokeColor, fillColor, lineWidth, fillOpacity, strokeOpacity]);

    useEffect(() => {
        if (!viewerRef.current || !dataSourceRef.current) return;

        if (asset.styles.length > 0) return;
        resetStyle();

    }, [asset]);

    useEffect(() => {
        if (!viewerRef.current || !dataSourceRef.current) return;
        if (!isAttributeStyleVisible) return;
        viewerRef.current?.dataSources.removeAll();
        rules.length > 0 && rules.forEach((r) => {
            let filter = "";
            if (isNumberStyleVisible) {
                filter = selectedAttribute + ">=" + r.min + " AND " + selectedAttribute + "<=" + r.max;
            } else if (isStringStyleVisible) {
                filter = selectedAttribute + "='" + r.eq + "'";
            }
            const geoJsonDataSourcePromise = Cesium.GeoJsonDataSource.load(import.meta.env.VITE_GEOSERVER_WFS_SERVICE_URL + `service=WFS&version=2.0.0&request=GetFeature&typeName=${resource.name}&outputFormat=application/json&propertyName=wkb_geometry&CQL_FILTER=${encodeURIComponent(filter)}`, {
                stroke: Cesium.Color.fromCssColorString(r.color),
                fill: Cesium.Color.fromCssColorString(r.color),
            });
            viewerRef.current?.dataSources.add(geoJsonDataSourcePromise);
        });
        viewerRef.current?.camera.flyTo({
            destination: Cesium.Rectangle.fromDegrees(latLonBoundingBox.minx, latLonBoundingBox.miny, latLonBoundingBox.maxx, latLonBoundingBox.maxy),
        });
    }, [rules, isAttributeStyleVisible]);

    useEffect(() => {
        if (!defaultStyle) return;
        if (!defaultStyle.context.attribute) return;
        if (defaultStyle.context.rules?.length > 0) {
            const updatedRules = defaultStyle.context.rules.map((rule) => {
                return {
                    id: crypto.randomUUID(),
                    min: rule.rule.min,
                    max: rule.rule.max,
                    eq: rule.rule.eq,
                    color: rule.style.fillColor,
                }
            });
            setStyleComponent('attribute');
            setStyleComponent(defaultStyle.context.rules[0].rule.eq ? 'string' : 'number');
            setRules(updatedRules);
        }
    }, [defaultStyle]);

    const resetStyle = () => {

        setStyleName("");
        setShape("circle");
        setSize(5);
        setStrokeColor("#000000");
        setFillColor("#000000");
        setLineWidth(1);
        setFillOpacity(0.5);
        setStrokeOpacity(0.5);
        setSelectedAttribute("");
        setRules([]);

        reset({
            name: "",
            context: {
                point: {
                    shape: "circle",
                    size: 5,
                    strokeColor: "#000000",
                    strokeWidth: 1,
                    strokeOpacity: 0.5,
                    fillColor: "#000000",
                    fillOpacity: 0.5,
                },
                line: {
                    strokeColor: "#000000",
                    strokeWidth: 1,
                    strokeOpacity: 0.5,
                },
                polygon: {
                    strokeColor: "#000000",
                    strokeWidth: 1,
                    strokeOpacity: 0.5,
                    fillColor: "#000000",
                    fillOpacity: 0.5,
                },
                attribute: {
                    name: "",
                    attribute: "",
                    rules: []
                }
            }
        });
    }

    const handleShapeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        // 선택된 모양으로 shape 상태를 업데이트합니다.
        setShape(event.target.value);
    };

    const handleSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        // 입력된 크기로 size 상태를 업데이트합니다.
        setSize(Number(event.target.value));
    };

    const handleStrokeColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        // 입력된 색상으로 strokeColor 상태를 업데이트합니다.
        setStrokeColor(event.target.value);
    };

    const handleFillColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        // 입력된 색상으로 strokeColor 상태를 업데이트합니다.
        setFillColor(event.target.value);
    };

    const handleLineWidthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        // 입력된 두께로 lineWidth 상태를 업데이트합니다.
        setLineWidth(Number(event.target.value));
    };

    const handleFillOpacityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        // 입력된 투명도로 opacity 상태를 업데이트합니다.
        setFillOpacity(Number(event.target.value) / 100);
    };

    const handleStrokeOpacityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        // 입력된 투명도로 opacity 상태를 업데이트합니다.
        setStrokeOpacity(Number(event.target.value) / 100);
    };

    const handleAttributeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedAttribute(event.target.value); // 상태 변수에 선택된 값을 설정
    };

    const handleMinChange = (id: string, event: React.ChangeEvent<HTMLInputElement>) => {
        const updatedRules = rules.map((rule) => {
            // @ts-ignore
            if (rule.id === id) {
                return { ...rule, min: event.target.value };
            }
            return rule;
        });
        setRules(updatedRules);
    }

    const handleMaxChange = (id: string, event: React.ChangeEvent<HTMLInputElement>) => {
        const updatedRules = rules.map((rule) => {
            // @ts-ignore
            if (rule.id === id) {
                return { ...rule, max: event.target.value };
            }
            return rule;
        });
        setRules(updatedRules);
    }

    const handleColorChange = (id: string, event: React.ChangeEvent<HTMLInputElement>) => {
        const updatedRules = rules.map((rule) => {
            // @ts-ignore
            if (rule.id === id) {
                return { ...rule, color: event.target.value };
            }
            return rule;
        });
        setRules(updatedRules);
    }

    const deleteRule = (id: string) => {
        const updatedRules = rules.filter((rule) => {
            // @ts-ignore
            return rule.id !== id;
        });
        setRules(updatedRules);
    }

    const setStyleComponent = (styleComponent: string) => {
        switch (styleComponent) {
            case "point":
                setIsPointStyleVisible(true);
                setIsPolylineStyleVisible(false);
                setIsPolygonStyleVisible(false);
                setIsAttributeStyleVisible(false);
                break;
            case "polyline":
                setIsPointStyleVisible(false);
                setIsPolylineStyleVisible(true);
                setIsPolygonStyleVisible(false);
                setIsAttributeStyleVisible(false);
                break;
            case "polygon":
                setIsPointStyleVisible(false);
                setIsPolylineStyleVisible(false);
                setIsPolygonStyleVisible(true);
                setIsAttributeStyleVisible(false);
                break;
            case "attribute":
                setIsPointStyleVisible(false);
                setIsPolylineStyleVisible(false);
                setIsPolygonStyleVisible(false);
                setIsAttributeStyleVisible(true);
                break;
            case "number":
                setIsNumberStyleVisible(true);
                setIsStringStyleVisible(false);
                break;
            case "string":
                setIsNumberStyleVisible(false);
                setIsStringStyleVisible(true);
                break;
            default:
                break;
        }
    }

    const onSubmitStyle: SubmitHandler<CreateStyleInput> = (input) => {
        if (!styleName) {
            alert("스타일명을 입력해주시기 바랍니다.");
            return;
        }

        if (!isPointStyleVisible) {
            delete input.context.point;
        }
        if (!isPolylineStyleVisible) {
            delete input.context.line;
        }
        if (!isPolygonStyleVisible) {
            delete input.context.polygon;
        }

        const properties = ['point', 'line', 'polygon'];
        const attributes = ['strokeOpacity', 'fillOpacity'];

        properties.forEach(property => {
            attributes.forEach(attribute => {
                if (input.context?.[property]?.[attribute]) {
                    input.context[property][attribute] /= 100;
                }
            });
        });

        const numberAttributes = ['size', 'strokeWidth'];
        properties.forEach(property => {
            numberAttributes.forEach(attribute => {
                if (input.context?.[property]?.[attribute]) {
                    input.context[property][attribute] = Number(input.context[property][attribute]);
                }
            });
        });

        if (isAttributeStyleVisible) {
            input.context.attribute = {
                name: input.name,
                attribute: selectedAttribute,
                rules: rules.map(rule => {
                    return {
                        rule: {
                            min: rule.min,
                            max: rule.max,
                            eq: rule.eq
                        },
                        style: {
                            strokeColor: rule.color,
                            fillColor: rule.color
                        }
                    }
                })
            }
        } else {
            delete input.context.attribute;
        }

        if (!defaultStyle) {
            createStyle({ variables: { input } });
        } else {
            updateStyle({ variables: { id: defaultStyle.id, input } });
        }
    }

    const toDelete = () => {
        if (!confirm(`스타일 [${styleName}]을 삭제하시겠습니까?`)) return;
        deleteStyle({ variables: { id: defaultStyle?.id } });
    }

    const toClassify = () => {
        if (!selectedAttribute) {
            alert("속성을 선택해주시기 바랍니다.");
            return;
        }
        const promise = getData({ variables: { nativeName: nativeName, attribute: selectedAttribute } });
        promise
          .then((response) => {
              // @ts-ignore
              const errors = response.errors??[];
              if (errors.length > 0) {
                  alert(errors[0].message);
                  setRules([]);
                  return;
              }

              const { type, rules } = response.data.classifyAttribute;
              setStyleComponent(type.toLowerCase());

              const updatedRules = rules.map((rule) => {
                  return {
                      id: crypto.randomUUID(),
                      min: rule.min,
                      max: rule.max,
                      eq: rule.eq,
                      color: rule.color,
                  }
              });
              setRules(updatedRules);
          });
    }

    return (
      <>
          <button type="button" className="btn-l-save" onClick={() => setCount("")}>전체 미리보기</button>
          <button type="button" className="btn-l-save" onClick={() => setCount("&count=1")}>한 객체만 미리보기</button>
          <WarningMessage message="성능 상의 이유로 하나의 객체만 미리보기 됩니다."/>
          <div className="preview-layer" style={{width: "30%"}}>
              <form onSubmit={handleSubmit(onSubmitStyle)}>
                  <div className="mar-b10" style={{display: "inline-block"}}>
                      <button type="button" className={`btn-basic ${isPointStyleVisible ? 'on' : ''}`}
                              onClick={() => setStyleComponent('point')}>점(Point)
                      </button>
                      <button type="button" className={`btn-basic ${isPolylineStyleVisible ? 'on' : ''}`}
                              onClick={() => setStyleComponent('polyline')}>선(Line)
                      </button>
                      <button type="button" className={`btn-basic ${isPolygonStyleVisible ? 'on' : ''}`}
                              onClick={() => setStyleComponent('polygon')}>면(Polygon)
                      </button>
                      <button type="button" className={`btn-basic ${isAttributeStyleVisible ? 'on' : ''}`}
                              onClick={() => setStyleComponent('attribute')}>속성(Attribute)
                      </button>
                  </div>
                  <label>스타일명</label>
                  <input type="text" defaultValue={styleName} {...register("name", {
                      required: {
                          value: true,
                          message: "스타일명을 입력해주시기 바랍니다."
                      },
                      value: styleName,
                      onChange: (event) => setStyleName(event.target.value)
                  })}/>
                  {
                    isPointStyleVisible &&
                    <div>
                        <label>점 모양</label>
                        <select defaultValue={shape}
                                {...register("context.point.shape", {
                                    value: shape,
                                    onChange: handleShapeChange
                                })}>
                            <option value="circle">원(Circle)</option>
                            <option value="square">사각형(Square)</option>
                            <option value="triangle">삼각형(Triangle)</option>
                            <option value="cross">십자가(Cross)</option>
                        </select>
                        <label>점 크기</label>
                        <input type="number" defaultValue={size}
                               {...register("context.point.size", {
                                   value: size,
                                   onChange: handleSizeChange
                               })}/>
                        <label>외곽선 색상</label>
                        <input type="color" defaultValue={strokeColor}
                               {...register("context.point.strokeColor", {
                                   value: strokeColor,
                                   onChange: handleStrokeColorChange
                               })}/>
                        <label>외곽선 두께</label>
                        <input type="number" defaultValue={lineWidth}
                               {...register("context.point.strokeWidth", {
                                   value: lineWidth,
                                   onChange: handleLineWidthChange
                               })}/>
                        <label>외곽선 투명도</label>
                        <input type="range" min={0} max={100} defaultValue={strokeOpacity * 100}
                               {...register("context.point.strokeOpacity", {
                                   value: strokeOpacity * 100,
                                   onChange: handleStrokeOpacityChange
                               })}/>
                        <label>채우기 색상</label>
                        <input type="color" defaultValue={fillColor}
                               {...register("context.point.fillColor", {
                                   value: fillColor,
                                   onChange: handleFillColorChange
                               })}/>
                        <label>채우기 투명도</label>
                        <input type="range" min={0} max={100} defaultValue={fillOpacity * 100}
                               {...register("context.point.fillOpacity", {
                                   value: fillOpacity * 100,
                                   onChange: handleFillOpacityChange
                               })}/>
                    </div>
                  }
                  {
                    isPolylineStyleVisible &&
                    <div>
                        <label>외곽선 색상</label>
                        <input type="color" defaultValue={strokeColor}
                               {...register("context.line.strokeColor", {
                                   value: strokeColor,
                                   onChange: handleStrokeColorChange
                               })}/>
                        <label>외곽선 두께</label>
                        <input type="number" defaultValue={lineWidth}
                               {...register("context.line.strokeWidth", {
                                   value: lineWidth,
                                   onChange: handleLineWidthChange
                               })}/>
                        <label>외곽선 투명도</label>
                        <input type="range" min={0} max={100} defaultValue={strokeOpacity * 100}
                               {...register("context.line.strokeOpacity", {
                                   value: strokeOpacity * 100,
                                   onChange: handleStrokeOpacityChange,
                               })}/>
                    </div>
                  }
                  {
                    isPolygonStyleVisible &&
                    <div>
                        <label>외곽선 색상</label>
                        <input type="color" defaultValue={strokeColor}
                               {...register("context.polygon.strokeColor", {
                                   value: strokeColor,
                                   onChange: handleStrokeColorChange,
                               })}/>
                        <label>외곽선 두께</label>
                        <input type="number" defaultValue={lineWidth}
                               {...register("context.polygon.strokeWidth", {
                                   value: lineWidth,
                                   onChange: handleLineWidthChange,
                               })}/>
                        <label>외곽선 투명도</label>
                        <input type="range" min={0} max={100} defaultValue={strokeOpacity * 100}
                               {...register("context.polygon.strokeOpacity", {
                                   value: strokeOpacity * 100,
                                   onChange: handleStrokeOpacityChange,
                               })}/>
                        <label>채우기 색상</label>
                        <input type="color" defaultValue={fillColor}
                               {...register("context.polygon.fillColor", {
                                   value: fillColor,
                                   onChange: handleFillColorChange,
                               })}/>
                        <label>채우기 투명도</label>
                        <input type="range" min={0} max={100} defaultValue={fillOpacity * 100}
                               {...register("context.polygon.fillOpacity", {
                                   value: fillOpacity * 100,
                                   onChange: handleFillOpacityChange,
                               })}/>
                    </div>
                  }
                  {
                    isAttributeStyleVisible &&
                    <div>
                        <label htmlFor="attribute">속성명</label>
                        <select id="attributes" defaultValue={selectedAttribute}
                                {...register("context.attribute.attribute", {
                                    value: selectedAttribute,
                                    onChange: handleAttributeChange
                                })}
                        >
                            <option value="">속성선택</option>
                            {
                                attribute.map((attr, index) => (
                                  <option key={index} value={attr.name}>{attr.name}</option>
                                ))
                            }
                        </select>
                        <button type="button" className="btn-l-apply" onClick={toClassify}>분류</button>
                        {
                          isNumberStyleVisible &&
                          rules.length > 0 &&
                          <div className="list-classify">
                              {/*<button type="button">추가</button>*/}
                              <table>
                                  <thead>
                                  <tr>
                                      <th>최소</th>
                                      <th>최대</th>
                                      <th>색상</th>
                                      <th>삭제</th>
                                  </tr>
                                  </thead>
                                  <tbody>
                                  {
                                      rules.map((rule, index) => (
                                        // @ts-ignore
                                        <tr key={rule.id}>
                                            <td>
                                                <input type="number" defaultValue={rule.min}
                                                       // @ts-ignore
                                                       onChange={(event) => handleMinChange(rule.id, event)}/>
                                            </td>
                                            <td>
                                                <input type="number" defaultValue={rule.max}
                                                       // @ts-ignore
                                                       onChange={(event) => handleMaxChange(rule.id, event)}/>
                                            </td>
                                            <td>
                                                <input type="color" defaultValue={rule.color}
                                                        // @ts-ignore
                                                       onBlur={(event) => handleColorChange(rule.id, event)}/>
                                            </td>
                                            <td>
                                                <button type="button" onClick={() => {
                                                    // @ts-ignore
                                                    deleteRule(rule.id)
                                                }}>삭제
                                                </button>
                                            </td>
                                        </tr>
                                      ))
                                  }
                                  </tbody>
                              </table>
                          </div>
                        }
                        {
                          isStringStyleVisible &&
                          rules.length > 0 &&
                          <div className="list-classify column-03">
                              {/*<button type="button">추가</button>*/}
                              <table>
                                  <thead>
                                  <tr>
                                      <th>값</th>
                                      <th>색상</th>
                                      <th>삭제</th>
                                  </tr>
                                  </thead>
                                  <tbody>
                                  {
                                      rules.map((rule, index) => (
                                        // @ts-ignore
                                        <tr key={rule.id}>
                                            <td><input type="text" defaultValue={rule.eq} disabled/></td>
                                            <td>
                                                <input type="color" defaultValue={rule.color}
                                                        // @ts-ignore
                                                       onBlur={(event) => handleColorChange(rule.id, event)}
                                                />
                                            </td>
                                            <td>
                                                <button type="button" onClick={() => {
                                                    // @ts-ignore
                                                    deleteRule(rule.id)
                                                }}>삭제
                                                </button>
                                            </td>
                                        </tr>
                                      ))
                                  }
                                  </tbody>
                              </table>
                          </div>
                        }
                    </div>
                  }
                  <div className="alg-right">
                      <button type="submit" className="btn-l-save">저장</button>
                      <button type="button" className="btn-l-delete" onClick={toDelete}>삭제</button>
                      <button type="button" className="btn-l-delete" onClick={resetStyle}>초기화</button>
                  </div>
              </form>
          </div>
          <div className="preview-layer" id="preview-layer" style={{width: "70%"}}></div>
          <WarningMessage message="미리보기는 실제와 다를 수 있습니다."/>
      </>
    )
}

export default LayerPreviewVector;