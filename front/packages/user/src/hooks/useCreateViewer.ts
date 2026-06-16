import { RefObject, useEffect, useRef } from "react";
import * as Cesium from "cesium";
import { useGlobeController } from "@/components/providers/GlobeControllerProvider";
import {useSetRecoilState} from "recoil";
import { OptionsState } from "@/recoils/Tool.ts";
import {initBackground} from "@/utils/cesium/initBackground.ts";
import {useBackgrounds} from "@/hooks/api/useBackgrounds.ts";
import { toast } from "react-toastify";

export const useCreateViewer = (containerRef: RefObject<HTMLDivElement>) => {

  const { globeController } = useGlobeController();
  const setOptions = useSetRecoilState(OptionsState);
  const { backgrounds, selectedBackground } = useBackgrounds();

  const viewerRef = useRef<Cesium.Viewer | null>(null);
  const baseLayerRef = useRef<Cesium.ImageryLayer | null>(null);
  const backgroundLayerRef = useRef<Cesium.ImageryLayer[] | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const initializeViewer = async () => {
      let terrainProvider: Cesium.TerrainProvider;
      try {
        terrainProvider = await Cesium.CesiumTerrainProvider.fromUrl(import.meta.env.VITE_TERRAIN_SERVER_URL);
        setOptions(prev => ({ ...prev, isTerrain: true }));
      } catch (error) {
        // terrain 서버가 404 등으로 실패해도 viewer 생성은 계속 진행한다.
        console.warn("Failed to load terrain provider, falling back to ellipsoid.", error);
        terrainProvider = new Cesium.EllipsoidTerrainProvider();
        setOptions(prev => ({ ...prev, isTerrain: false }));
        // 사용자가 "지형이 왜 평평하지?" 하고 당황하지 않도록 안내한다. (viewer 생성당 1회)
        toast.info("지형 데이터를 불러올 수 없어 평면 지형으로 표시됩니다.", { autoClose: 5000 });
      }

      const baseLayers = selectedBackground.url
        .filter((url): url is string => !!url)
        .map(url => initBackground(selectedBackground.type, url));

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

    initializeViewer().catch(error => {
      console.error("Failed to initialize Cesium viewer.", error);
    });
  }, [containerRef]);

  // 4. selectedBackground 변경 시 baseLayer 교체
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer || !selectedBackground.url.length) return;

    const newBaseLayers = selectedBackground.url
      .filter((url): url is string => !!url)
      .map(url => initBackground(selectedBackground.type, url));

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
  }, [selectedBackground]);
};
