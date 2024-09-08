import {RefObject, useEffect, useRef} from "react";
import * as Cesium from "cesium";
import { useGlobeController } from "@/components/providers/GlobeControllerProvider";
import {TerrainUrlState} from "@/recoils/Terrain.ts";
import {useRecoilState} from "recoil";

export const useCreateViewer = (containerRef: RefObject<HTMLDivElement>) => {
  const { globeController } = useGlobeController();
  const [terrainUrl] = useRecoilState<string>(TerrainUrlState);
  const viewerRef = useRef<Cesium.Viewer | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const initializeViewer = async () => {
      let terrainProvider = new Cesium.EllipsoidTerrainProvider();
      const terrainUrl = import.meta.env.VITE_TERRAIN_SERVER_URL;
      if (terrainUrl) {
        terrainProvider = await Cesium.CesiumTerrainProvider.fromUrl(terrainUrl);
      }
      //const terrainProvider = await Cesium.CesiumTerrainProvider.fromUrl(import.meta.env.VITE_TERRAIN_SERVER_URL);
      viewerRef.current = globeController.createViewer(containerRef.current as HTMLDivElement, {
        baseLayer: new Cesium.ImageryLayer(new Cesium.OpenStreetMapImageryProvider({
          url: 'https://a.tile.openstreetmap.org/'
        }), {show:true}),
        terrainProvider,
        // baseLayer: getWmsLayer(import.meta.env.VITE_BASE_LAYER_NAME),
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

      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(Number(import.meta.env.VITE_START_LONGITUDE), Number(import.meta.env.VITE_START_LATITUDE), Number(import.meta.env.VITE_START_HEIGHT)),
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerRef]);

  useEffect(() => {
    if (terrainUrl && viewerRef.current) {
      changeTerrainByUrl(terrainUrl);
    }
  }, [terrainUrl]);

  const changeTerrainByUrl = (newTerrainUrl: string) => {
    if (viewerRef.current) {
      Cesium.CesiumTerrainProvider.fromUrl(newTerrainUrl).then(terrainProvider => {
        viewerRef.current!.terrainProvider = terrainProvider;
        viewerRef.current!.scene.globe.terrainProvider = terrainProvider;
        viewerRef.current!.scene.requestRender();
      }).catch(error => {
        console.error("지형 로드 실패:", error);
      });
    }
  };
};


