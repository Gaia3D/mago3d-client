import { RefObject, useEffect, useRef } from "react";
import * as Cesium from "cesium";
import { useGlobeController } from "@/components/providers/GlobeControllerProvider";
import { useRecoilState } from "recoil";
import { CurrentLayerMapState } from "@/recoils/Layer.ts";
import { OptionsState } from "@/recoils/Tool.ts";
import { BackgroundsDocument, LayerBackground } from "@mnd/shared/src/types/layerset/gql/graphql.ts";
import { useQuery } from "@apollo/client";
import {initBackground} from "@/utils/cesium/initBackground.ts";
import {useBackgrounds} from "@/hooks/api/useBackgrounds.ts";

export const useCreateViewer = (containerRef: RefObject<HTMLDivElement>) => {

  const { globeController } = useGlobeController();
  const [options, setOptions] = useRecoilState(OptionsState);
  const { backgrounds, currentMap } = useBackgrounds();
  const { data } = useQuery<{ backgrounds: LayerBackground[] }>(BackgroundsDocument);

  const viewerRef = useRef<Cesium.Viewer | null>(null);
  const baseLayerRef = useRef<Cesium.ImageryLayer | null>(null);
  const backgroundLayerRef = useRef<Cesium.ImageryLayer[] | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const initializeViewer = async () => {
      const terrainProvider = await Cesium.CesiumTerrainProvider.fromUrl(import.meta.env.VITE_TERRAIN_SERVER_URL);
      setOptions(prev => ({ ...prev, isTerrain: true }));

      const baseLayers = currentMap.url
        .filter((url): url is string => !!url)
        .map(url => initBackground(currentMap.type, url));

      if (baseLayers.length === 0) return;

      viewerRef.current = globeController.createViewer(container, {
        baseLayer: baseLayers[0], // 첫 번째 레이어만 초기 base로
        terrainProvider,
        geocoder: false,
        homeButton: false,
        baseLayerPicker: false,
        sceneModePicker: false,
        navigationHelpButton: false,
        animation: false,
        timeline: false,
        fullscreenButton: false,
        shouldAnimate: false,
        infoBox: false,
        selectionIndicator: false,
      });

      const viewer = viewerRef.current;
      const globe = viewer.scene.globe;
      globe.depthTestAgainstTerrain = true;

      baseLayerRef.current = baseLayers[0];
      backgroundLayerRef.current = baseLayers.slice(1); // 나머지 레이어들

      backgroundLayerRef.current.forEach(layer => {
        viewer.scene.imageryLayers.add(layer);
      });

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

  // 4. currentMap 변경 시 baseLayer 교체
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer || !currentMap.url.length) return;

    const newBaseLayers = currentMap.url
      .filter((url): url is string => !!url)
      .map(url => initBackground(currentMap.type, url));

    if (baseLayerRef.current) {
      viewer.scene.imageryLayers.remove(baseLayerRef.current);
    }

    if (backgroundLayerRef.current) {
      backgroundLayerRef.current.forEach(layer => viewer.scene.imageryLayers.remove(layer));
    }

    const [newBase, ...backgrounds] = newBaseLayers;
    if (!newBase) return;

    viewer.scene.imageryLayers.add(newBase);
    viewer.scene.imageryLayers.lowerToBottom(newBase);
    baseLayerRef.current = newBase;

    backgrounds.forEach(layer => viewer.scene.imageryLayers.add(layer));
    backgroundLayerRef.current = backgrounds;

    viewer.scene.requestRender();
  }, [currentMap]);
};
