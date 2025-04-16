import {useEffect, useRef, useState} from "react";
import * as Cesium from "cesium";
import {ClassifyAttributeDocument, CreateStyleInput, LayerAsset, LayersetAssetDocument, LayerStyle, RemoteDocument, RemoteQueryVariables, Rule} from "@src/generated/gql/layerset/graphql";
import WarningMessage from "../../dataset/asset/WarningMessage";
import {SubmitHandler, useForm} from "react-hook-form";
import {useLazyQuery, useSuspenseQuery} from "@apollo/client";
import {useTranslation} from "react-i18next";
import {createCesiumViewer} from "@src/utils/createCesiumViewer";
import {useLayerStyleMutations} from "@src/hooks/useLayerStyleMutation";
import PointStyleForm from "@src/components/layerset/layer/style-form/PointStyleForm";
import PolylineStyleForm from "@src/components/layerset/layer/style-form/PolylineStyleForm";
import PolygonStyleForm from "@src/components/layerset/layer/style-form/PolygonStyleForm";

type VisibleStyleType = 'point' | 'polyline' | 'polygon' | 'attribute';

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

    useEffect(() => {
        console.log("defaultStyle", defaultStyle);
    }, [defaultStyle]);

    const {
        register,
        handleSubmit,
        reset,
        setValue
    } = useForm<CreateStyleInput>();

    const [styleState, setStyleState] = useState<LayerStyle>(defaultStyle);
    const [count, setCount] = useState<string>("&count=1");
    const [selectedAttribute, setSelectedAttribute] = useState<string>(defaultStyle?.context?.attribute ?? "");
    const [rules, setRules] = useState<Rule[]>([]);

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { name, ...contextWithoutName } = styleState.context;

        setValue("context.point", contextWithoutName);
        setValue("context.line", contextWithoutName);
        setValue("context.polygon", contextWithoutName);
    }, [setValue, styleState.context]);

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

    const [visibleStyle, setVisibleStyle] = useState<VisibleStyleType>('point');
    const [visibleAttributeType, setVisibleAttributeType] = useState<'number' | 'string' | null>(null);

    useEffect(() => {
        const viewer = createCesiumViewer("preview-layer");
        viewerRef.current = viewer;
        return () => {
            viewer.destroy();
        }
    }, []);

    useEffect(() => {
        if (!viewerRef.current) return;
        if (visibleStyle === "attribute") return;

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

    }, [count, visibleStyle]);

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
        if (visibleStyle !== "attribute") return;
        viewerRef.current?.dataSources.removeAll();
        rules.length > 0 && rules.forEach((r) => {
            let filter = "";
            if (visibleAttributeType === "number") {
                filter = selectedAttribute + ">=" + r.min + " AND " + selectedAttribute + "<=" + r.max;
            } else if (visibleAttributeType === "string") {
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
    }, [rules, visibleStyle]);

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
            setVisibleStyle("attribute");
            setVisibleAttributeType(defaultStyle.context.rules[0].rule.eq ? "string" : "number")
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
                point: defaultStyle.context,
                line: defaultStyle.context,
                polygon: defaultStyle.context,
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

    const onSubmitStyle: SubmitHandler<CreateStyleInput> = (input) => {
        
        //  마지막에 point나 polyline, polygon 안에있는 name 빼주자
        
        
        if (!styleState.name) {
            alert(t("required.style-name"));
            return;
        }

        if (visibleStyle !== "point") {
            delete input.context.point;
        }
        if (visibleStyle !== "polyline") {
            delete input.context.line;
        }
        if (visibleStyle !== "polygon") {
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

        if (visibleStyle === "attribute") {
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
              const component = type.toLowerCase();
              if (component === 'point' || component === 'polyline' || component === 'polygon' || component === 'attribute') {
                  setVisibleStyle(component);
                  setVisibleAttributeType(null);
              } else if (component === 'number' || component === 'string') {
                  setVisibleStyle('attribute');
                  setVisibleAttributeType(component);
              }

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
                      <button type="button" className={`btn-basic ${visibleStyle === 'point' ? 'on' : ''}`}
                              onClick={() => setVisibleStyle('point')}>Point
                      </button>
                      <button type="button" className={`btn-basic ${visibleStyle === 'polyline' ? 'on' : ''}`}
                              onClick={() => setVisibleStyle('polyline')}>Line
                      </button>
                      <button type="button" className={`btn-basic ${visibleStyle === 'polygon' ? 'on' : ''}`}
                              onClick={() => setVisibleStyle('polygon')}>Polygon
                      </button>
                      <button type="button" className={`btn-basic ${visibleStyle === 'attribute' ? 'on' : ''}`}
                              onClick={() => setVisibleStyle('attribute')}>Attribute
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
                  { visibleStyle === "point" && <PointStyleForm register={register} styleState={styleState} onChange={handleContextChange} /> }
                  { visibleStyle === "polyline" && <PolylineStyleForm register={register} styleState={styleState} onChange={handleContextChange} /> }
                  { visibleStyle === "polygon" && <PolygonStyleForm register={register} styleState={styleState} onChange={handleContextChange} /> }
                  {
                    visibleStyle === "attribute" &&
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
                          visibleAttributeType === "number" &&
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
                          visibleAttributeType === "string" &&
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