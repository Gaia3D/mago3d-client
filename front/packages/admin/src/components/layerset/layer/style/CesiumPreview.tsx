import React, { useEffect, useRef, useMemo } from "react";
import * as Cesium from "cesium";
import { BackgroundMapType } from "@src/constants/backgroundMap";
import { initCesiumViewer } from "@src/utils/layer/initCesiumViewer";
import { updateImageryProvider } from "@src/utils/layer/updateImageryProvider";
import { applyStyledEntities } from "@src/utils/layer/applyStyledEntities";
import { PreviewMode } from "@src/types/Layer";
import { useRecoilValue } from "recoil";
import { layerStylesState, selectedLayerStyleState } from "@src/recoils/LayerStyle";

interface CesiumPreviewerProps {
  dataSource: Cesium.GeoJsonDataSource;
  backgroundMap: BackgroundMapType;
  previewMode: PreviewMode;
}

const CesiumPreview = ({
                         dataSource,
                         backgroundMap,
                         previewMode,
                       }: CesiumPreviewerProps) => {
  const viewerRef = useRef<HTMLDivElement>(null);
  const cesiumViewerRef = useRef<Cesium.Viewer | null>(null);
  const imageryLayerRef = useRef<Cesium.ImageryLayer | null>(null);
  const entityListRef = useRef<Cesium.Entity[]>([]);

  const layerStyles = useRecoilValue(layerStylesState);
  const selectedLayerStyle = useRecoilValue(selectedLayerStyleState);

  const currentLayerStyles = useMemo(
    () => (selectedLayerStyle ? [selectedLayerStyle] : layerStyles),
    [selectedLayerStyle, layerStyles]
  );

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

  // 초기 데이터 로드 시 Entity 리스트 저장 및 스타일 적용
  useEffect(() => {
    if (!dataSource || !cesiumViewerRef.current) return;
    entityListRef.current = dataSource.entities.values;
    applyStyledEntities(cesiumViewerRef.current, entityListRef.current, currentLayerStyles, previewMode);
  }, [dataSource, currentLayerStyles, previewMode]);

  return <div ref={viewerRef} className="cesium-viewer" />;
};

export default CesiumPreview;
