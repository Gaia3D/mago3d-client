import React, {useEffect, useRef, useState} from 'react';
import Cesium from "cesium";
import {BackgroundMapType} from "@src/constants/backgroundMap";
import {PreviewMode} from "@src/types/Layer";
import {useRecoilState} from "recoil";
import {completeStylesState, editingStyleState} from "@src/recoils/LayerStyle";
import {initCesiumViewer} from "@src/utils/layer/initCesiumViewer";
import {updateImageryProvider} from "@src/utils/layer/updateImageryProvider";
import {applyStyledEntities} from "@src/components/refactor-layer-style/preview-panel/applyStyledEntities";

interface CesiumPreviewerProps {
  dataSource: Cesium.GeoJsonDataSource;
  backgroundMap: BackgroundMapType;
  previewMode: PreviewMode;
}

const CesiumPreview = ({ dataSource, backgroundMap, previewMode }: CesiumPreviewerProps) => {
  const viewerRef = useRef<HTMLDivElement>(null);
  const cesiumViewerRef = useRef<Cesium.Viewer | null>(null);
  const imageryLayerRef = useRef<Cesium.ImageryLayer | null>(null);
  const [currentEntities, setCurrentEntities] = useState<Cesium.Entity[]>([]);

  const [completeStyles, setCompleteStyles] = useRecoilState(completeStylesState);
  const [editingStyle, setEditingStyle] = useRecoilState(editingStyleState);
  const [currentLayerStyles, setCurrentLayerStyles] = useState(() => (
    editingStyle ? [editingStyle] : completeStyles
  ));

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

  // preview 스타일 배열 설정
  useEffect(() => {
    const toggledStyles = completeStyles.filter(style => style.enabled);
    const next = editingStyle ? [editingStyle] : toggledStyles;
    setCurrentLayerStyles(next);
  }, [editingStyle, completeStyles]);

  // preview entity 설정
  useEffect(() => {
    if (!dataSource?.entities?.values || previewMode === "legend") return;
    const values = dataSource.entities.values;
    const entities = previewMode === "single" ? [values[0]] : values;
    setCurrentEntities(entities);
  }, [dataSource, previewMode]);

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

  useEffect(() => {
    console.log("currentLayerStyles", currentLayerStyles);
  }, [currentLayerStyles]);

  return <div ref={viewerRef} className="cesium-viewer" />;
};

export default CesiumPreview;