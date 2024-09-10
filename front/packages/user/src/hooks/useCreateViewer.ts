import { RefObject, useEffect, useRef } from "react";
import * as Cesium from "cesium";
import { useGlobeController } from "@/components/providers/GlobeControllerProvider";
import { getWmsLayer } from "@/components/utils/utils.ts";
import { TerrainUrlState } from "@/recoils/Terrain.ts";
import { useRecoilState, useRecoilValue } from "recoil";
import { CurrentLayerMapState, LayerMapType } from "@/recoils/Layer.ts";

export const useCreateViewer = (containerRef: RefObject<HTMLDivElement>) => {
  const { globeController } = useGlobeController();
  const [terrainUrl] = useRecoilState<string>(TerrainUrlState);
  const [currentMap, setCurrentMap] = useRecoilState<LayerMapType>(CurrentLayerMapState);
  const viewerRef = useRef<Cesium.Viewer | null>(null);
  const baseLayerRef = useRef<Cesium.ImageryLayer | null>(null);
  useEffect(() => {
    if (!containerRef.current) return;

    let nowMap = currentMap;

    if (localStorage.getItem('RIPA_MAP')) {
        const ripa_map = localStorage.getItem('RIPA_MAP')
        if (!ripa_map) return;
        nowMap = JSON.parse(ripa_map);
        setCurrentMap(nowMap);
    }

    const initializeViewer = async () => {
      const terrainProvider = await Cesium.CesiumTerrainProvider.fromUrl(import.meta.env.VITE_TERRAIN_SERVER_URL);
      let _layer;
      if (nowMap.type === "osm") {
        _layer = new Cesium.ImageryLayer(
            new Cesium.OpenStreetMapImageryProvider({
              url: nowMap.url,
            }),
            { show: true }
        );
      } else if (nowMap.type === "vworld") {
        _layer = new Cesium.ImageryLayer(
            new Cesium.WebMapTileServiceImageryProvider({
                url: nowMap.url,
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
        _layer = getWmsLayer(nowMap.url);
      }

      viewerRef.current = globeController.createViewer(containerRef.current as HTMLDivElement, {
        baseLayer: _layer,
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
      baseLayerRef.current = _layer;

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerRef]);

  useEffect(() => {
    if (terrainUrl && viewerRef.current) {
      changeTerrainByUrl(terrainUrl);
    }
  }, [terrainUrl]);

  const changeTerrainByUrl = (newTerrainUrl: string) => {
    if (viewerRef.current) {
      Cesium.CesiumTerrainProvider.fromUrl(newTerrainUrl)
          .then((terrainProvider) => {
            viewerRef.current!.terrainProvider = terrainProvider;
            viewerRef.current!.scene.globe.terrainProvider = terrainProvider;
            viewerRef.current!.scene.requestRender();
          })
          .catch((error) => {
            console.error("지형 로드 실패:", error);
          });
    }
  };

  // 최적화된 baseLayer 변경 처리
  useEffect(() => {
    if (viewerRef.current && baseLayerRef.current) {
      const viewer = viewerRef.current;
      let newLayer;

      if (currentMap.type === "osm") {
        newLayer = new Cesium.ImageryLayer(
            new Cesium.OpenStreetMapImageryProvider({
              url: currentMap.url,
            }),
            { show: true }
        );
      } else if (currentMap.type === "vworld") {
          newLayer = new Cesium.ImageryLayer(
              new Cesium.WebMapTileServiceImageryProvider({
                  url: currentMap.url,
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
        newLayer = getWmsLayer(currentMap.url);
      }

      viewer.scene.imageryLayers.remove(baseLayerRef.current);  // 이전 baseLayer 제거
      viewer.scene.imageryLayers.add(newLayer);                 // 새로운 baseLayer 추가
      baseLayerRef.current = newLayer;                          // baseLayerRef 업데이트
      viewer.scene.requestRender();                             // 씬 다시 렌더링
    }
  }, [currentMap]);
};
