import { RefObject, useEffect } from "react";
import * as Cesium from "cesium";
import { useGlobeController } from "@/components/providers/GlobeControllerProvider";
import {getWmsLayer} from "@/components/utils/utils.ts";

export const useCreateViewer = (containerRef: RefObject<HTMLDivElement>) => {
  const { globeController } = useGlobeController();
  
  useEffect(() => {
    Cesium.CesiumTerrainProvider.fromUrl(import.meta.env.VITE_TERRAIN_SERVER_URL).then(terrainProvider => {
      if (!containerRef.current) return;
      const viewer = globeController.createViewer(containerRef.current, {
        // baseLayer: new Cesium.ImageryLayer(new Cesium.OpenStreetMapImageryProvider({
        //     url: 'https://a.tile.openstreetmap.org/'
        // }), {show:true}),
        terrainProvider,
        baseLayer: getWmsLayer(import.meta.env.VITE_BASE_LAYER_NAME),
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
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerRef]);
};
