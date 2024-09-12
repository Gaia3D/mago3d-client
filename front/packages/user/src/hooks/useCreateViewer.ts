import {RefObject, useEffect, useRef, useState} from "react";
import * as Cesium from "cesium";
import { useGlobeController } from "@/components/providers/GlobeControllerProvider";
import { getWmsLayer } from "@/components/utils/utils.ts";
import { TerrainUrlState } from "@/recoils/Terrain.ts";
import { useRecoilState, useRecoilValue } from "recoil";
import { CurrentLayerMapState, LayerMapType } from "@/recoils/Layer.ts";
import {OptionsState} from "@/recoils/Tool.ts";

export const useCreateViewer = (containerRef: RefObject<HTMLDivElement>) => {

  const { globeController } = useGlobeController();
  const [terrainUrl] = useRecoilState<string>(TerrainUrlState);
  const [options, setOptions] = useRecoilState(OptionsState);
  const [currentMap, setCurrentMap] = useRecoilState<LayerMapType>(CurrentLayerMapState);
  const viewerRef = useRef<Cesium.Viewer | null>(null);
  const baseLayerRef = useRef<Cesium.ImageryLayer | null>(null);

  useEffect(() => {
      if (!containerRef.current) return;

      let nowMap = currentMap;

      const localBackgroundMap = localStorage.getItem('BACKGROUND_MAP')
      if ( localBackgroundMap ) {
          nowMap = JSON.parse(localBackgroundMap);
          setCurrentMap(nowMap);
      }
      const initializeViewer = async () => {

          let terrainProvider;
          if (terrainUrl) {
              // localstorage 저장된 url이 있다면 해당 terrain 호출
              terrainProvider = await Cesium.CesiumTerrainProvider.fromUrl(import.meta.env.VITE_API_URL + terrainUrl);
              setOptions((prevOptions) => ({
                  ...prevOptions,
                  isTerrain: true,
              }));
          } else {
              // localstorage에 저장된 url이 없다면 민둥 terrain 호출
              terrainProvider = await new Cesium.EllipsoidTerrainProvider();
          }

          const baseLayer = initBackground(nowMap.type, nowMap.url);

          viewerRef.current = globeController.createViewer(containerRef.current as HTMLDivElement, {
              baseLayer,
              terrainProvider,
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
          } as Cesium.Viewer.ConstructorOptions);

          const viewer = viewerRef.current;
          const scene = viewer.scene;
          const globe = scene.globe;
          globe.depthTestAgainstTerrain = true;
          baseLayerRef.current = baseLayer;

          viewer.camera.flyTo({
              destination: Cesium.Cartesian3.fromDegrees(
                  Number(import.meta.env.VITE_START_LONGITUDE),
                  Number(import.meta.env.VITE_START_LATITUDE),
                  Number(import.meta.env.VITE_START_HEIGHT)
              ),
              orientation: {
                  heading: Cesium.Math.toRadians(0.0),
                  pitch: Cesium.Math.toRadians(-60.0),
              },
              duration: 0,
          });
          viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
          viewer.scene.camera.percentageChanged = 0.01;
      };

      initializeViewer();
  }, [containerRef]);

  // 최적화된 baseLayer 변경 처리
  useEffect(() => {
    if (viewerRef.current && baseLayerRef.current) {
      const viewer = viewerRef.current;
      const newLayer = initBackground(currentMap.type, currentMap.url);

        viewer.scene.imageryLayers.remove(baseLayerRef.current);
        viewer.scene.imageryLayers.add(newLayer);
        viewer.scene.imageryLayers.lowerToBottom(newLayer);
        baseLayerRef.current = newLayer;
        viewer.scene.requestRender();
    }
  }, [currentMap]);

  const initBackground = ( type: string, url: string ) => {
      if (type === "osm") {
          return new Cesium.ImageryLayer(
              new Cesium.OpenStreetMapImageryProvider({
                  url,
              }),
              { show: true }
          );
      } else if (type === "vworld") {
          return new Cesium.ImageryLayer(
              new Cesium.WebMapTileServiceImageryProvider({
                  url,
                  layer: 'Base',
                  style: 'default',
                  maximumLevel: 19,
                  tileMatrixSetID: 'default028mm'
              }),
              {
                  show: true,
                  minimumTerrainLevel: 5
              }
          );
      } else {
          return getWmsLayer(url);
      }
    }
};
