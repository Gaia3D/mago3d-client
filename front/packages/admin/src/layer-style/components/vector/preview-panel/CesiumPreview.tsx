import React, { useEffect, useRef, useState } from "react";
import * as Cesium from "cesium";
import { PreviewMode } from "@src/layer-style/components/vector/PreviewPanel";
import { useRecoilValue } from "recoil";
import {
  editableStylesState,
  editingStyleState,
  selectedBackgroundState,
} from "@src/layer-style/recoils/layerStyle";
import { initCesiumViewer } from "@src/layer-style/utils/initCesiumViewer";
import { updateImageryProvider } from "@src/layer-style/utils/updateImageryProvider";
import { applyStyledEntities } from "@src/layer-style/utils/apply-styled-entities";
import { setGeometryToEntity } from "@src/layer-style/utils/setGeometryToEntity";
import {zoomToBbox} from "@src/layer-style/utils/zoomToBbox";
import {FeatureCollection} from "geojson";

interface CesiumPreviewerProps {
  geoJson: FeatureCollection;
  previewMode: PreviewMode;
}

const CesiumPreview = ({ geoJson, previewMode }: CesiumPreviewerProps) => {
  const viewerRef = useRef<HTMLDivElement>(null);
  const cesiumViewerRef = useRef<Cesium.Viewer | null>(null);
  const [currentEntities, setCurrentEntities] = useState<Cesium.Entity[]>([]);

  const selectedBackground = useRecoilValue(selectedBackgroundState);
  const editableStyles = useRecoilValue(editableStylesState);
  const editingStyle = useRecoilValue(editingStyleState);
  const [currentStyles, setCurrentStyles] = useState(() =>
    editingStyle ? [editingStyle] : editableStyles
  );

  // 뷰어 초기화
  useEffect(() => {
    if (!viewerRef.current) return;
    cesiumViewerRef.current = initCesiumViewer(viewerRef.current);
    return () => {
      cesiumViewerRef.current?.destroy();
      cesiumViewerRef.current = null;
    };
  }, []);

  // 배경 변경 시 imagery 교체
  useEffect(() => {
    if (!cesiumViewerRef.current || !selectedBackground) return;
    updateImageryProvider(cesiumViewerRef.current, null, selectedBackground);
  }, [selectedBackground]);

  // 스타일 필터링
  useEffect(() => {
    const visible = editableStyles.filter((s) => s.context.visible);
    const matched = visible.filter(
      (s) => !s.context.backgroundId || s.context.backgroundId === selectedBackground?.id
    );
    setCurrentStyles(editingStyle ? [editingStyle] : matched);
  }, [editableStyles, editingStyle, selectedBackground]);

  // 엔티티 생성
  useEffect(() => {
    if (!geoJson || previewMode === "legend") return;

    const features = previewMode === "single"
      ? geoJson.features.slice(0, 1)
      : geoJson.features;

    const entities = features.map((f, i) => {
      const id = f.id?.toString() ?? `feature-${i}`;
      const entity = new Cesium.Entity({ id, properties: f.properties });
      setGeometryToEntity(entity, f);
      return entity;
    });

    setCurrentEntities(entities);
  }, [geoJson, previewMode]);

  // 스타일 적용
  useEffect(() => {
    if (!cesiumViewerRef.current || !currentEntities.length) return;
    const timeout = setTimeout(() => {
      applyStyledEntities(cesiumViewerRef.current!, currentEntities, currentStyles);
    }, 300);
    return () => clearTimeout(timeout);
  }, [currentEntities, currentStyles]);

  // 현재 bbox로 zoom
  useEffect(() => {
    if (!cesiumViewerRef.current || !geoJson) return;
    let bbox: number[] | undefined;

    if (previewMode === "single") {
      bbox = geoJson.features[0]?.bbox;
    } else if (previewMode === "all") {
      bbox = geoJson.bbox;
    }
    if (!bbox) return;
    zoomToBbox(cesiumViewerRef.current, bbox, { paddingRatio: 0.2 });
  }, [geoJson, previewMode]);

  return <div ref={viewerRef} className="cesium-viewer" />;
};

export default CesiumPreview;
