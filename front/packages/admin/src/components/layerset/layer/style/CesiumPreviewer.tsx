import React, { useEffect, useRef } from "react";
import * as Cesium from "cesium";
import {LayerStyle} from "@src/generated/gql/layerset/graphql";
import {BackgroundMapType} from "@src/constants/backgroundMap";

interface CesiumPreviewerProps {
  layerStyles: LayerStyle[]; // 실제 타입으로 교체
  backgroundMap: BackgroundMapType;
}

const CesiumPreviewer: React.FC<CesiumPreviewerProps> = ({ layerStyles, backgroundMap }) => {
  const viewerRef = useRef<HTMLDivElement>(null);
  const cesiumViewerRef = useRef<Cesium.Viewer | null>(null);
  const imageryLayerRef = useRef<Cesium.ImageryLayer | null>(null);
  const dataSourceRef = useRef<Cesium.DataSource | null>(null);

  useEffect(() => {
    if (!viewerRef.current) return;

    cesiumViewerRef.current = new Cesium.Viewer(viewerRef.current, {
      geocoder: false,
      homeButton: false,
      baseLayerPicker: false,
      sceneModePicker: false,
      navigationHelpButton: false,
      animation: false,
      timeline: false,
      fullscreenButton: false,
      shouldAnimate: true,
      infoBox: false,
      selectionIndicator: false,
      terrainProvider: new Cesium.EllipsoidTerrainProvider(),
    });

    cesiumViewerRef.current.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(127.9780, 36.5665, 800000),
    });

    return () => {
      cesiumViewerRef.current?.destroy();
      cesiumViewerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const viewer = cesiumViewerRef.current;
    if (!viewer || !backgroundMap) return;

    let imageryProvider: Cesium.ImageryProvider;

    if (backgroundMap.type === "osm") {
      imageryProvider = new Cesium.OpenStreetMapImageryProvider({ url: backgroundMap.url });
    } else if (backgroundMap.type === "vworld") {
      imageryProvider = new Cesium.WebMapTileServiceImageryProvider({
        url: backgroundMap.url,
        layer: "Base",
        style: "default",
        maximumLevel: 19,
        tileMatrixSetID: "default028mm",
      });
    } else {
      return;
    }

    if (imageryLayerRef.current) {
      viewer.imageryLayers.remove(imageryLayerRef.current, true);
    }

    imageryLayerRef.current = viewer.imageryLayers.addImageryProvider(imageryProvider);
  }, [backgroundMap]);

  useEffect(() => {
    const viewer = cesiumViewerRef.current;
    if (!viewer || layerStyles.length < 0) return;

    viewer.entities.removeAll();

    console.log("layerStyles", layerStyles)

    // 예시: GeoJSON 로딩
    // Cesium.GeoJsonDataSource.load(asset.geojson, {
    //   stroke: Cesium.Color.fromCssColorString(style.strokeColor || "#ff0000"),
    //   fill: Cesium.Color.fromCssColorString(style.fillColor || "#ff000033"),
    //   strokeWidth: style.strokeWidth || 2,
    // }).then((dataSource) => {


    //   viewer.dataSources.removeAll();
    //   viewer.dataSources.add(dataSource);
    //   dataSourceRef.current = dataSource;
    //
    //   const entities = dataSource.entities.values;
    //   if (entities.length > 0) {
    //     viewer.zoomTo(entities);
    //   }
    // });
  }, [layerStyles]);

  return <div ref={viewerRef} className="cesium-viewer" />;
};

export default CesiumPreviewer;
