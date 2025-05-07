import React, { useEffect, useRef } from "react";
import * as Cesium from "cesium";
import { LayerStyle } from "@src/generated/gql/layerset/graphql";
import { BackgroundMapType } from "@src/constants/backgroundMap";
import { initCesiumViewer } from "@src/utils/layer/initCesiumViewer";
import { updateImageryProvider } from "@src/utils/layer/updateImageryProvider";
import {applyStyledEntities} from "@src/utils/layer/applyStyledEntities";
import {PreviewMode} from "@src/types/previewMode";

interface CesiumPreviewerProps {
  dataSource: Cesium.GeoJsonDataSource;
  layerStyles: LayerStyle[];
  backgroundMap: BackgroundMapType;
  previewMode: PreviewMode;
}

const CesiumPreview: React.FC<CesiumPreviewerProps> = ({
   dataSource,
   layerStyles,
   backgroundMap,
   previewMode,
 }) => {
  const viewerRef = useRef<HTMLDivElement>(null);
  const cesiumViewerRef = useRef<Cesium.Viewer | null>(null);
  const imageryLayerRef = useRef<Cesium.ImageryLayer | null>(null);
  const entityListRef = useRef<Cesium.Entity[]>([]);

  useEffect(() => {
    if (!viewerRef.current) return;
    cesiumViewerRef.current = initCesiumViewer(viewerRef.current);
    return () => {
      cesiumViewerRef.current?.destroy();
      cesiumViewerRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!cesiumViewerRef.current) return;
    imageryLayerRef.current = updateImageryProvider(
      cesiumViewerRef.current,
      imageryLayerRef.current,
      backgroundMap
    );
  }, [backgroundMap]);

  useEffect(() => {
    if (!dataSource) return;
    entityListRef.current = dataSource.entities.values;
    applyStyledEntities(cesiumViewerRef.current!, entityListRef.current, layerStyles, previewMode);
  }, [dataSource]);

  useEffect(() => {
    if (!cesiumViewerRef.current || !entityListRef.current.length || previewMode === "legend") return;
    applyStyledEntities(cesiumViewerRef.current, entityListRef.current, layerStyles, previewMode);
  }, [layerStyles, previewMode]);

  return <div ref={viewerRef} className="cesium-viewer" />;
};

export default CesiumPreview;