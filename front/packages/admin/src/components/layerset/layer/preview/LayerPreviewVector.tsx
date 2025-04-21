import {useEffect, useRef, useState} from "react";
import * as Cesium from "cesium";
import {
    CreateStyleInput,
    LayerAsset,
    LayersetAssetDocument,
    LayerStyle,
    RemoteDocument,
    RemoteQueryVariables,
    Rule
} from "@mnd/shared/src/types/layerset/gql/graphql";
import WarningMessage from "../../../dataset/asset/WarningMessage";
import {useForm} from "react-hook-form";
import {useSuspenseQuery} from "@apollo/client";
import {useTranslation} from "react-i18next";
import {createCesiumViewer} from "@src/utils/createCesiumViewer";
import {useLayerStyleMutations} from "@src/hooks/useLayerStyleMutation";
import PointStyleForm from "@src/components/layerset/layer/style-form/PointStyleForm";
import PolylineStyleForm from "@src/components/layerset/layer/style-form/PolylineStyleForm";
import PolygonStyleForm from "@src/components/layerset/layer/style-form/PolygonStyleForm";
import {mapToStyleCreateInput} from "@src/utils/variableStyleMap";

interface LayerPreviewVectorProps {
    asset: LayerAsset,
}

type VisibleStyleType = 'point' | 'polyline' | 'polygon' | 'attribute';

const fallbackContext: NonNullable<LayerStyle["context"]> = {
    name: "",
    shape: "circle",
    size: 5,
    strokeColor: "#000000",
    fillColor: "#000000",
    strokeWidth: 1,
    fillOpacity: 0.5,
    strokeOpacity: 0.5,
    minScale: 0,
    maxScale: Infinity
};

function extractPath(url: string): string {
    const parsedUrl = new URL(url);
    return parsedUrl.pathname + parsedUrl.search + parsedUrl.hash;
}

const LayerPreviewVector = ({asset}: LayerPreviewVectorProps) => {
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

    const { latLonBoundingBox } = data.remote.featureType;

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

    const defaultStyle = asset.styles?.find(style => style.defaultStatus);

    const mergedStyle: LayerStyle | undefined = defaultStyle
      ? {
          ...defaultStyle,
          context: {
              ...fallbackContext,
              ...(defaultStyle.context ?? {}),
          },
      }
      : undefined;

    const {
        register,
        handleSubmit,
        reset,
        setValue
    } = useForm<CreateStyleInput>();

    const [styleState, setStyleState] = useState<LayerStyle>(mergedStyle);
    const [count, setCount] = useState<string>("&count=1");
    const [selectedAttribute, setSelectedAttribute] = useState<string>(defaultStyle?.context?.attribute ?? "");
    const [rules, setRules] = useState<Rule[]>([]);

    useEffect(() => {
        if (!defaultStyle) return;

        const defaultContext = defaultStyle.context ?? {};
        const mergedContext = { ...fallbackContext, ...defaultContext };

        setStyleState(prev => ({
            ...prev,
            ...defaultStyle,
            context: mergedContext
        }));
    }, [defaultStyle]);

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
        console.log("resource", resource);
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

    const onSubmitStyle = () => {
        if (!styleState.name) {
            alert(t("required.style-name"));
            return;
        }

        const input = mapToStyleCreateInput({
            styleState,
            visibleStyle,
            selectedAttribute,
            rules
        });

        if (!defaultStyle) {
            createStyle({ variables: { input } });
        } else {
            updateStyle({ variables: { id: defaultStyle.id, input } });
        }
    };

    const toDelete = () => {
        if (!confirm(t("style")+ `[${styleState.name}]` + t("question.blank-delete") )) return;
        deleteStyle({ variables: { id: defaultStyle?.id } });
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
                  { visibleStyle === "point" && <PointStyleForm styleState={styleState} onChange={handleContextChange} /> }
                  { visibleStyle === "polyline" && <PolylineStyleForm styleState={styleState} onChange={handleContextChange} /> }
                  { visibleStyle === "polygon" && <PolygonStyleForm styleState={styleState} onChange={handleContextChange} /> }
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