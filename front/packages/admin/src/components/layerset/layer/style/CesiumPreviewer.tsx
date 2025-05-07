import React, { useEffect, useRef } from "react";
import * as Cesium from "cesium";
import { LayerStyle } from "@src/generated/gql/layerset/graphql";
import { BackgroundMapType } from "@src/constants/backgroundMap";
import { initCesiumViewer } from "@src/utils/layer/initCesiumViewer";
import { updateImageryProvider } from "@src/utils/layer/updateImageryProvider";
import {applyStyledEntities} from "@src/utils/layer/applyStyledEntities";
import {previewModeType} from "@src/components/layerset/layer/style/LayerVectorStyle";

interface CesiumPreviewerProps {
  resourceName: string | undefined;
  layerStyles: LayerStyle[];
  backgroundMap: BackgroundMapType;
  previewMode: previewModeType;
}

const CesiumPreviewer: React.FC<CesiumPreviewerProps> = ({
   resourceName,
   layerStyles,
   backgroundMap,
   previewMode,
 }) => {
  const viewerRef = useRef<HTMLDivElement>(null);
  const cesiumViewerRef = useRef<Cesium.Viewer | null>(null);
  const imageryLayerRef = useRef<Cesium.ImageryLayer | null>(null);
  const dataSourceRef = useRef<Cesium.DataSource | null>(null);
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
    if (!cesiumViewerRef.current || !resourceName) return;
    const fetchData = async () => {
      const url = `${import.meta.env.VITE_GEOSERVER_WFS_SERVICE_URL}service=WFS&version=2.0.0&request=GetFeature&typeName=${resourceName}&outputFormat=application/json`;
      const dataSource = await Cesium.GeoJsonDataSource.load(url);
      dataSourceRef.current = dataSource;
      entityListRef.current = dataSource.entities.values;

      applyStyledEntities(cesiumViewerRef.current!, entityListRef.current, layerStyles, previewMode);
    };

    fetchData();
  }, [resourceName]);

  useEffect(() => {
    if (!cesiumViewerRef.current || !entityListRef.current.length || previewMode === "legend") return;
    applyStyledEntities(cesiumViewerRef.current, entityListRef.current, layerStyles, previewMode);
  }, [layerStyles, previewMode]);

  return <div ref={viewerRef} className="cesium-viewer" />;
};

export default CesiumPreviewer;