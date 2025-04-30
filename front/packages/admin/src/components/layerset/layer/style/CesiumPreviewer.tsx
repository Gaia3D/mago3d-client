import React, { useEffect, useRef } from "react";
import * as Cesium from "cesium";
import { LayerStyle } from "@src/generated/gql/layerset/graphql";
import { BackgroundMapType } from "@src/constants/backgroundMap";
import {initCesiumViewer} from "@src/utils/layer/initCesiumViewer";
import {updateImageryProvider} from "@src/utils/layer/updateImageryProvider";
import {loadAndStyleGeoJson} from "@src/utils/layer/loadAndStyleGeoJson";

interface CesiumPreviewerProps {
  resourceName: string | undefined;
  layerStyles: LayerStyle[];
  backgroundMap: BackgroundMapType;
}

const CesiumPreviewer: React.FC<CesiumPreviewerProps> = ({ resourceName, layerStyles, backgroundMap }) => {
  const viewerRef = useRef<HTMLDivElement>(null);
  const cesiumViewerRef = useRef<Cesium.Viewer | null>(null);
  const imageryLayerRef = useRef<Cesium.ImageryLayer | null>(null);
  const dataSourceRef = useRef<Cesium.DataSource | null>(null);

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
    imageryLayerRef.current = updateImageryProvider(cesiumViewerRef.current, imageryLayerRef.current, backgroundMap);
  }, [backgroundMap]);

  useEffect(() => {
    if (!cesiumViewerRef.current || !resourceName || layerStyles.length <= 0) return;
    cesiumViewerRef.current.entities.removeAll();
    loadAndStyleGeoJson({
      viewer: cesiumViewerRef.current,
      resourceName,
      layerStyles,
      dataSourceRef,
    });
  }, [resourceName, layerStyles]);

  return <div ref={viewerRef} className="cesium-viewer" />;
};

export default CesiumPreviewer;