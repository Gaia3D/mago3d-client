import React, {useEffect, useRef, useState} from 'react';
import * as Cesium from "cesium";
import {BackgroundMapType} from "@src/constants/backgroundMap";
import {PreviewMode} from "@src/types/Layer";
import {initCesiumViewer} from "@src/utils/layer/initCesiumViewer";
import {updateImageryProvider} from "@src/utils/layer/updateImageryProvider";
import {useRecoilState, useRecoilValue} from "recoil";
import {globalStyleContextState, layerStylesState, selectedLayerStyleState} from "@src/recoils/LayerStyle";
import {applyStyledEntities} from "@src/components/layer-style/preview/applyStyledEntities";

interface CesiumPreviewerProps {
  dataSource: Cesium.GeoJsonDataSource;
  backgroundMap: BackgroundMapType;
  previewMode: PreviewMode;
}

const CesiumPreview = ({ dataSource, backgroundMap, previewMode }: CesiumPreviewerProps) => {
  const viewerRef = useRef<HTMLDivElement>(null);
  const cesiumViewerRef = useRef<Cesium.Viewer | null>(null);
  const imageryLayerRef = useRef<Cesium.ImageryLayer | null>(null);
  const [globalStyleContext, setGlobalStyleContext] = useRecoilState(globalStyleContextState);
  const [currentEntities, setCurrentEntities] = useState<Cesium.Entity[]>([]);

  const layerStyles = useRecoilValue(layerStylesState);
  const selectedLayerStyle = useRecoilValue(selectedLayerStyleState);
  useEffect(() => {
    console.log("selectedLayerStyle", selectedLayerStyle);
    const next = selectedLayerStyle ? [selectedLayerStyle] : layerStyles;
    setCurrentLayerStyles(next);
  }, [selectedLayerStyle, layerStyles]);

  const [currentLayerStyles, setCurrentLayerStyles] = useState(() => (
    selectedLayerStyle ? [selectedLayerStyle] : layerStyles
  ));
  useEffect(() => {
    if (!dataSource?.entities?.values || previewMode === "legend") return;
    const values = dataSource.entities.values;
    const entities = previewMode === "single" ? [values[0]] : values;
    setCurrentEntities(entities);
  }, [dataSource, previewMode]);

  // 초기 Cesium 뷰어 생성
  useEffect(() => {
    if (!viewerRef.current) return;
    cesiumViewerRef.current = initCesiumViewer(viewerRef.current);

    return () => {
      cesiumViewerRef.current?.destroy();
      cesiumViewerRef.current = null;
    };
  }, []);

  // 배경맵 변경 처리
  useEffect(() => {
    if (!cesiumViewerRef.current) return;
    imageryLayerRef.current = updateImageryProvider(
      cesiumViewerRef.current,
      imageryLayerRef.current,
      backgroundMap
    );
  }, [backgroundMap]);

  useEffect(() => {
    if (!cesiumViewerRef.current) return;
    if (!currentEntities.length) return;

    const handler = setTimeout(() => {
      applyStyledEntities(cesiumViewerRef.current, currentEntities, currentLayerStyles);
    }, 300); // 300ms 디바운스

    return () => {
      clearTimeout(handler); // 이전 타이머 제거
    };
  }, [currentEntities, currentLayerStyles]);

  return <div ref={viewerRef} className="cesium-viewer" />;
};

export default CesiumPreview;