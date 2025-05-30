import React, {useEffect, useRef, useState} from 'react';
import * as Cesium from "cesium";
import {PreviewMode} from "@src/layer-style/components/vector/PreviewPanel";
import {useRecoilValue} from "recoil";
import {editableStylesState, editingStyleState, selectedBackgroundState} from "@src/layer-style/recoils/layerStyle";
import {initCesiumViewer} from "@src/utils/layer/initCesiumViewer";
import {updateImageryProvider} from "@src/utils/layer/updateImageryProvider";
import {applyStyledEntities} from "@src/layer-style/utils/apply-styled-entities";

interface CesiumPreviewerProps {
  dataSource: Cesium.GeoJsonDataSource;
  previewMode: PreviewMode;
}

const CesiumPreview = ({dataSource, previewMode}: CesiumPreviewerProps) => {
  const viewerRef = useRef<HTMLDivElement>(null);
  const cesiumViewerRef = useRef<Cesium.Viewer | null>(null);
  const imageryLayerRef = useRef<Cesium.ImageryLayer | null>(null);
  const [currentEntities, setCurrentEntities] = useState<Cesium.Entity[]>([]);

  const selectedBackground = useRecoilValue(selectedBackgroundState);
  const editableStyles = useRecoilValue(editableStylesState);
  const editingStyle = useRecoilValue(editingStyleState)
  const [currentStyles, setCurrentStyles] = useState(() => (
    editingStyle ? [editingStyle] : editableStyles
  ));

  useEffect(() => {
    console.log("현재 미리보기되는 스타일배열", currentStyles);
  }, [currentStyles]);

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
      selectedBackground
    );
  }, [selectedBackground]);

  // 보여야할 스타일 적용
  useEffect(() => {
    // visible 켜진 스타일만
    const visibleOnly = editableStyles.filter(style => style.context.visible);
    // 해당 배경에 나타날 스타일만
    const matchedBackgroundStyles = visibleOnly.filter(
      style =>
        style.context.backgroundId === "" ||
        style.context.backgroundId === selectedBackground.id
    );

    const stylesToApply = editingStyle
      ? [editingStyle] // 편집 중인 스타일만 우선 적용
      : matchedBackgroundStyles;

    setCurrentStyles(stylesToApply);
  }, [editingStyle, editableStyles]);

  // preview entity 설정
  useEffect(() => {
    if (!dataSource?.entities?.values || previewMode === "legend") return;
    const values = dataSource.entities.values;
    const entities = previewMode === "single" ? [values[0]] : values;
    setCurrentEntities(entities);
  }, [dataSource, previewMode]);

  // 스타일 적용 (디바운스)
  useEffect(() => {
    if (!cesiumViewerRef.current) return;
    if (!currentEntities.length) return;

    const handler = setTimeout(() => {
      applyStyledEntities(cesiumViewerRef.current, currentEntities, currentStyles);
    }, 300); // 300ms 디바운스

    return () => {
      clearTimeout(handler); // 이전 타이머 제거
    };
  }, [currentEntities, currentStyles]);

  return <div ref={viewerRef} className="cesium-viewer" />;
};

export default CesiumPreview;