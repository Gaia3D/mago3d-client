import {useEffect, useRef, useState} from "react";
import * as Cesium from "cesium";
import {ClassifyAttributeDocument, CreateStyleInput, LayerAsset, LayersetAssetDocument, LayerStyle, RemoteDocument, RemoteQueryVariables, Rule} from "@src/generated/gql/layerset/graphql";
import WarningMessage from "../../dataset/asset/WarningMessage";
import {SubmitHandler, useForm} from "react-hook-form";
import {useLazyQuery, useSuspenseQuery} from "@apollo/client";
import {useTranslation} from "react-i18next";
import {createCesiumViewer} from "@src/utils/createCesiumViewer";
import {useLayerStyleMutations} from "@src/hooks/useLayerStyleMutation";

function extractPath(url: string): string {
    const parsedUrl = new URL(url);
    return parsedUrl.pathname + parsedUrl.search + parsedUrl.hash;
}

const LayerPreviewVector = ({asset}: { asset: LayerAsset }) => {
    const {t} = useTranslation();
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

    const {
        createStyle,
        updateStyle,
        deleteStyle,
    } = useLayerStyleMutations(asset.id, {
        applyStyle: [LayersetAssetDocument],
        createStyle: [],
        updateStyle: [LayersetAssetDocument, RemoteDocument],
        deleteStyle: [LayersetAssetDocument, RemoteDocument],
    });

    const defaultStyles = asset.styles?.filter(style => style.defaultStatus);
    const defaultStyle = defaultStyles?.[0];

    const [styleState, setStyleState] = useState<LayerStyle>(defaultStyle);
    const [count, setCount] = useState<string>("&count=1");
    const [selectedAttribute, setSelectedAttribute] = useState<string>(defaultStyle?.context?.attribute ?? "");
    const [rules, setRules] = useState<Rule[]>([]);

    const handleContextChange = <K extends keyof NonNullable<LayerStyle["context"]>>(key: K, value: string | number) => {
        setStyleState((prev) => ({
            ...prev,
            context: {
                ...(prev.context ?? {}),
                [key]: value,
            },
        }));
    };

    const handleStyleNameChange = (value: string) => {
        setStyleState((prev) => ({
            ...prev,
            name: value,
        }));
    };

    const viewerRef = useRef<Cesium.Viewer | null>(null);
    const dataSourceRef = useRef<Cesium.GeoJsonDataSource | null>(null);

    const [isPointStyleVisible, setIsPointStyleVisible] = useState<boolean>(true);
    const [isPolylineStyleVisible, setIsPolylineStyleVisible] = useState<boolean>(false);
    const [isPolygonStyleVisible, setIsPolygonStyleVisible] = useState<boolean>(false);
    const [isAttributeStyleVisible, setIsAttributeStyleVisible] = useState<boolean>(false);

    const [isNumberStyleVisible, setIsNumberStyleVisible] = useState<boolean>(false);
    const [isStringStyleVisible, setIsStringStyleVisible] = useState<boolean>(false);

    useEffect(() => {
        const viewer = createCesiumViewer("preview-layer");
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
            stroke: Cesium.Color.fromCssColorString(styleState.context.strokeColor),
            fill: Cesium.Color.fromCssColorString(styleState.context.fillColor).withAlpha(styleState.context.fillOpacity),
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
                        color: Cesium.Color.fromCssColorString(styleState.context.fillColor).withAlpha(styleState.context.fillOpacity), // 채우기 색상
                        pixelSize: styleState.context.size, // 크기
                        outlineColor: Cesium.Color.fromCssColorString(styleState.context.strokeColor).withAlpha(styleState.context.strokeOpacity), // 외곽선 색상
                        outlineWidth: styleState.context.strokeWidth // 외곽선 두께
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
                        width: styleState.context.strokeWidth,
                        material: Cesium.Color.fromCssColorString(styleState.context.strokeColor).withAlpha(styleState.context.strokeOpacity),
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
               entity.polygon.material = new Cesium.ColorMaterialProperty(Cesium.Color.fromCssColorString(styleState.context.fillColor).withAlpha(styleState.context.fillOpacity));
               entity.polygon.outlineColor = new Cesium.ConstantProperty(Cesium.Color.fromCssColorString(styleState.context.strokeColor).withAlpha(styleState.context.strokeOpacity));
           }
           if (entity.polyline) {
               entity.polyline.material = new Cesium.ColorMaterialProperty(Cesium.Color.fromCssColorString(styleState.context.strokeColor).withAlpha(styleState.context.strokeOpacity));
               entity.polyline.width = new Cesium.ConstantProperty(styleState.context.strokeWidth);
           }
           if (entity.point) {
               // TODO: shape를 반영하도록..
               entity.point.color = new Cesium.ConstantProperty(Cesium.Color.fromCssColorString(styleState.context.fillColor).withAlpha(styleState.context.fillOpacity));
               entity.point.pixelSize = new Cesium.ConstantProperty(styleState.context.size);
               entity.point.outlineColor = new Cesium.ConstantProperty(Cesium.Color.fromCssColorString(styleState.context.strokeColor).withAlpha(styleState.context.strokeOpacity));
               entity.point.outlineWidth = new Cesium.ConstantProperty(styleState.context.strokeWidth);
           }
        });

    }, [styleState.context]);

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

        setStyleState(defaultStyle);
        setSelectedAttribute("");
        setRules([]);

        reset({
            name: defaultStyle.name,
            context: {
                point: {
                    shape: defaultStyle.context.shape,
                    size: defaultStyle.context.size,
                    strokeColor: defaultStyle.context.shape.strokeColor,
                    strokeWidth: defaultStyle.context.shape.strokeWidth,
                    strokeOpacity: defaultStyle.context.shape.strokeOpacity,
                    fillColor: defaultStyle.context.shape.fillColor,
                    fillOpacity: defaultStyle.context.shape.fillOpacity,
                },
                line: {
                    strokeColor: defaultStyle.context.shape.strokeColor,
                    strokeWidth: defaultStyle.context.shape.strokeWidth,
                    strokeOpacity: defaultStyle.context.strokeOpacity,
                },
                polygon: {
                    strokeColor: defaultStyle.context.strokeColor,
                    strokeWidth: defaultStyle.context.strokeWidth,
                    strokeOpacity: defaultStyle.context.strokeOpacity,
                    fillColor: defaultStyle.context.fillColor,
                    fillOpacity: defaultStyle.context.fillOpacity,
                },
                attribute: {
                    name: defaultStyle.context.name,
                    attribute: "",
                    rules: []
                }
            }
        });
    }

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
        if (!styleState.name) {
            alert(t("required.style-name"));
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
        if (!confirm(t("style")+ `[${styleState.name}]` + t("question.blank-delete") )) return;
        deleteStyle({ variables: { id: defaultStyle?.id } });
    }

    const toClassify = () => {
        if (!selectedAttribute) {
            alert(t("required.attribute"));
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
          <button type="button" className="btn-l-save" onClick={() => setCount("")}>{t("total-preview")}</button>
          <button type="button" className="btn-l-save" onClick={() => setCount("&count=1")}>{t("object-preview")}</button>
          <WarningMessage message={t("warning.object")}/>
          <div className="preview-layer" style={{width: "50%"}}>
              <form onSubmit={handleSubmit(onSubmitStyle)}>
                  <div className="mar-b10" style={{display: "inline-block"}}>
                      <button type="button" className={`btn-basic ${isPointStyleVisible ? 'on' : ''}`}
                              onClick={() => setStyleComponent('point')}>{t("point")}(Point)
                      </button>
                      <button type="button" className={`btn-basic ${isPolylineStyleVisible ? 'on' : ''}`}
                              onClick={() => setStyleComponent('polyline')}>{t("line")}(Line)
                      </button>
                      <button type="button" className={`btn-basic ${isPolygonStyleVisible ? 'on' : ''}`}
                              onClick={() => setStyleComponent('polygon')}>{t("plane")}(Polygon)
                      </button>
                      <button type="button" className={`btn-basic ${isAttributeStyleVisible ? 'on' : ''}`}
                              onClick={() => setStyleComponent('attribute')}>{t("attribute")}(Attribute)
                      </button>
                  </div>
                  <label>{t("style-name")}</label>
                  <input type="text" defaultValue={styleState.name} {...register("name", {
                      required: {
                          value: true,
                          message: t("required.style-name")
                      },
                      value: styleState.name,
                      onChange: (e) => handleStyleNameChange(e.target.value)
                  })}/>
                  {
                    isPointStyleVisible &&
                    <div>
                        <label>{t("point-shape")}</label>
                        <select {...register("context.point.shape")}>
                            <option value="circle">{t("circle")}</option>
                            <option value="square">{t("square")}</option>
                            <option value="triangle">{t("triangle")}</option>
                            <option value="cross">{t("cross")}</option>
                        </select>
                        <label>{t("point-size")}</label>
                        <input type="number" defaultValue={styleState.context.size}
                               {...register("context.point.size", {
                                   value: styleState.context.size,
                                   onChange: (e) => handleContextChange("size", Number(e.target.value))
                               })}/>
                        <label>{t("stroke-color")}</label>
                        <input type="color" defaultValue={styleState.context.strokeColor}
                               {...register("context.point.strokeColor", {
                                   value: styleState.context.strokeColor,
                                   onChange: (e) => handleContextChange("strokeColor", e.target.value)
                               })}/>
                        <label>{t("stroke-width")}</label>
                        <input type="number" defaultValue={styleState.context.strokeWidth}
                               {...register("context.point.strokeWidth", {
                                   value: styleState.context.strokeWidth,
                                   onChange: (e) => handleContextChange("strokeWidth", Number(e.target.value))
                               })}/>
                        <label>{t("stroke-opacity")}</label>
                        <input type="range" min={0} max={100} defaultValue={styleState.context.strokeOpacity * 100}
                               {...register("context.point.strokeOpacity", {
                                   value: styleState.context.strokeOpacity * 100,
                                   onChange: (e) => handleContextChange("strokeOpacity", Number(e.target.value / 100))
                               })}/>
                        <label>{t("fill-color")}</label>
                        <input type="color" defaultValue={styleState.context.fillColor}
                               {...register("context.point.fillColor", {
                                   value: styleState.context.fillColor,
                                   onChange: (e) => handleContextChange("fillColor", e.target.value)
                               })}/>
                        <label>{t("fill-opacity")}</label>
                        <input type="range" min={0} max={100} defaultValue={styleState.context.fillOpacity * 100}
                               {...register("context.point.fillOpacity", {
                                   value: styleState.context.fillOpacity * 100,
                                   onChange: (e) => handleContextChange("fillOpacity", Number(e.target.value / 100))
                               })}/>
                    </div>
                  }
                  {
                    isPolylineStyleVisible &&
                    <div>
                        <label>{t("stroke-color")}</label>
                        <input type="color" defaultValue={styleState.context.strokeColor}
                               {...register("context.line.strokeColor", {
                                   value: styleState.context.strokeColor,
                                   onChange: (e) => handleContextChange("strokeColor", e.target.value)
                               })}/>
                        <label>{t("stroke-width")}</label>
                        <input type="number" defaultValue={styleState.context.strokeWidth}
                               {...register("context.line.strokeWidth", {
                                   value: styleState.context.strokeWidth,
                                   onChange: (e) => handleContextChange("strokeWidth", Number(e.target.value))
                               })}/>
                        <label>{t("stroke-opacity")}</label>
                        <input type="range" min={0} max={100} defaultValue={styleState.context.strokeOpacity * 100}
                               {...register("context.line.strokeOpacity", {
                                   value: styleState.context.strokeOpacity * 100,
                                   onChange: (e) => handleContextChange("strokeOpacity", Number(e.target.value / 100))
                               })}/>
                    </div>
                  }
                  {
                    isPolygonStyleVisible &&
                    <div>
                        <label>{t("stroke-color")}</label>
                        <input type="color" defaultValue={styleState.context.strokeColor}
                               {...register("context.polygon.strokeColor", {
                                   value: styleState.context.strokeColor,
                                   onChange: (e) => handleContextChange("strokeColor", e.target.value)
                               })}/>
                        <label>{t("stroke-width")}</label>
                        <input type="number" defaultValue={styleState.context.strokeWidth}
                               {...register("context.polygon.strokeWidth", {
                                   value: styleState.context.strokeWidth,
                                   onChange: (e) => handleContextChange("strokeWidth", Number(e.target.value))
                               })}/>
                        <label>{t("stroke-opacity")}</label>
                        <input type="range" min={0} max={100} defaultValue={styleState.context.strokeOpacity * 100}
                               {...register("context.polygon.strokeOpacity", {
                                   value: styleState.context.strokeOpacity * 100,
                                   onChange: (e) => handleContextChange("strokeOpacity", Number(e.target.value / 100))
                               })}/>
                        <label>{t("fill-color")}</label>
                        <input type="color" defaultValue={styleState.context.fillColor}
                               {...register("context.polygon.fillColor", {
                                   value: styleState.context.fillColor,
                                   onChange: (e) => handleContextChange("fillColor", e.target.value)
                               })}/>
                        <label>{t("fill-opacity")}</label>
                        <input type="range" min={0} max={100} defaultValue={styleState.context.fillOpacity * 100}
                               {...register("context.polygon.fillOpacity", {
                                   value: styleState.context.fillOpacity * 100,
                                   onChange: (e) => handleContextChange("fillOpacity", Number(e.target.value / 100))
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
                            <option value="">{t("attribute-select")}</option>
                            {
                                attribute.map((attr, index) => (
                                  <option key={index} value={attr.name}>{attr.name}</option>
                                ))
                            }
                        </select>
                        <button type="button" className="btn-l-apply" onClick={toClassify}>{t("classify")}</button>
                        {
                          isNumberStyleVisible &&
                          rules.length > 0 &&
                          <div className="list-classify">
                              {/*<button type="button">추가</button>*/}
                              <table>
                                  <thead>
                                  <tr>
                                      <th>{t("min")}</th>
                                      <th>{t("max")}</th>
                                      <th>{t("color")}</th>
                                      <th>{t("delete")}</th>
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
                                                }}>{t("delete")}
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
                                      <th>{t("value")}</th>
                                      <th>{t("color")}</th>
                                      <th>{t("delete")}</th>
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
                                                }}>{t("delete")}
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
                      <button type="submit" className="btn-l-save">{t("save")}</button>
                      <button type="button" className="btn-l-delete" onClick={toDelete}>{t("delete")}</button>
                      <button type="button" className="btn-l-delete" onClick={resetStyle}>{t("reset")}</button>
                  </div>
              </form>
          </div>
          <div className="preview-layer" id="preview-layer" style={{width: "50%"}}></div>
          <WarningMessage message={t("warning.preview")}/>
      </>
    )
}

export default LayerPreviewVector;