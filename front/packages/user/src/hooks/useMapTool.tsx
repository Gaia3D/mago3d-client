import { useState, useEffect, useRef } from "react";
import { useGlobeController } from "@/components/providers/GlobeControllerProvider";
import { useRecoilState, useSetRecoilState } from "recoil";
import { LoadingStateType, loadingState } from "@/recoils/Spinner";
import {
  MeasureAngleOpenState,
  MeasureAreaOpenState,
  MeasureComplexOpenState,
  MeasureDistanceOpenState, MeasurePositionOpenState, MeasureRadiusOpenState,
  Options,
  OptionsState,
  PrintPotalOpenState,
  SearchCoordinateOpenState,
  ToolStatusState,
} from "@/recoils/Tool";
import * as Cesium from "cesium";
import { Fullscreen } from "cesium";
import dayjs from "dayjs";
import { download } from "@mnd/shared";
import {useClockTool} from "@/hooks/useMapTool/useClockTool.ts";
import {useWebStorage} from "@/hooks/useMapTool/useWebStorage.ts";

export const useMapTool = () => {
  const { globeController, initialized } = useGlobeController();
  const [toolStatus, setToolStatus] = useRecoilState(ToolStatusState);
  const setLoadingState = useSetRecoilState<LoadingStateType>(loadingState);
  const [printPortalOpen, setPrintPortalOpen] = useRecoilState(PrintPotalOpenState);
  const setMeasurePositionOpen = useSetRecoilState(MeasurePositionOpenState);
  const setMeasureRadiusOpen = useSetRecoilState(MeasureRadiusOpenState);
  const setMeasureDistanceOpen = useSetRecoilState(MeasureDistanceOpenState);
  const setMeasureAreaOpen = useSetRecoilState(MeasureAreaOpenState);
  const setMeasureAngleOpen = useSetRecoilState(MeasureAngleOpenState);
  const setMeasureComplexOpen = useSetRecoilState(MeasureComplexOpenState);
  const setSearchCoordinateOpen = useSetRecoilState(SearchCoordinateOpenState);
  const [options, setOptions] = useRecoilState(OptionsState);
  const { initDate } = useClockTool();
  const { initWebStorage, saveWebStorage } = useWebStorage();

  const [angle, setAngle] = useState(0);

  useEffect(() => {
    if (!initialized) return;
    const { viewer } = globeController;
    const scene = viewer?.scene;
    if (!scene) return;

    scene.camera.changed.addEventListener(() => {
      const heading = Cesium.Math.toDegrees(scene.camera.heading);
      setAngle(-heading);
    });
  }, [globeController, initialized]);

  useEffect(() => {
    const { viewer } = globeController;
    if (!viewer) return;
    const clock = viewer.clock;
    clock.multiplier = options.speed;
  }, [options.speed, globeController]);

  useEffect(() => {
    initWebStorage();
  }, []);


  const onClickCompas = () => {
    const { viewer } = globeController;
    if (!viewer) return;

    const camera = viewer.camera;
    const viewRectangle = camera.computeViewRectangle();

    if (!viewRectangle) return;
    const center = Cesium.Rectangle.center(viewRectangle);

    camera.flyTo({
      destination: Cesium.Cartesian3.fromRadians(center.longitude, center.latitude, camera.positionCartographic.height),
      orientation: {
        heading: 0.0,
        pitch: -Cesium.Math.PI_OVER_TWO,
        roll: 0.0,
      },
      duration: 0.8,
    });

    setToolStatus(null);
  }

  const onClickHome = () => {
    const { viewer } = globeController;
    if (!viewer) return;

    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(Number(import.meta.env.VITE_START_LONGITUDE), Number(import.meta.env.VITE_START_LATITUDE), Number(import.meta.env.VITE_START_HEIGHT)),
      orientation: {
        heading: Cesium.Math.toRadians(0.0),
        pitch: Cesium.Math.toRadians(-60.0),
      },
      duration: 0.8,
    });

    setToolStatus(null);
    setMeasureDistanceOpen(false);
    setMeasureAreaOpen(false);
    setMeasureAngleOpen(false);
    setMeasureComplexOpen(false);
    setSearchCoordinateOpen(false);
  };

  const onClickExpand = () => {
    const { viewer } = globeController;
    if (!viewer) return;

    viewer.camera.zoomIn(20000);
    setToolStatus(null);
  };

  const onClickReduce = () => {
    const { viewer } = globeController;
    if (!viewer) return;

    viewer.camera.zoomOut(20000);
    setToolStatus(null);
  };

  const toggleCoordinate = () => {
    setToolStatus((prev) => (prev === "position" ? null : "position"));
    setMeasurePositionOpen((prev) => !prev);
  }

  const toggleMeasureRadius = () => {
    setToolStatus((prev) => (prev === "radius" ? null : "radius"));
    setMeasureRadiusOpen((prev) => !prev);
  }

  const onClickLength = () => {
    setToolStatus((prev) => (prev === "length" ? null : "length"));
    setMeasureDistanceOpen((prev) => !prev);
  };

  const onClickArea = () => {
    setToolStatus((prev) => (prev === "area" ? null : "area"));
    setMeasureAreaOpen((prev) => !prev);
  };

  const onClickAngle = () => {
    setToolStatus((prev) => (prev === "angles" ? null : "angles"));
    setMeasureAngleOpen((prev) => !prev);
  };

  const onClickComplex = () => {
    setToolStatus((prev) => (prev === "composite" ? null : "composite"));
    setMeasureComplexOpen((prev) => !prev);
  };

  const onClickSearch = () => {
    setToolStatus((prev) => (prev === "search" ? null : "search"));
    setSearchCoordinateOpen((prev) => !prev);
  };

  const onClickSave = () => {
    const { viewer } = globeController;
    if (!viewer || !viewer.scene) return;
    const targetResolutionScale = 1.0;
    const timeout = 1000; // in ms

    const { scene } = viewer;

    // define callback functions
    const prepareScreenshot = function () {
      viewer.resolutionScale = targetResolutionScale;
      scene.preRender.removeEventListener(prepareScreenshot);
      // take snapshot after defined timeout to allow scene update (ie. loading data)
      setTimeout(function () {
        scene.postRender.addEventListener(takeScreenshot);
      }, timeout);
    };

    const takeScreenshot = function () {
      scene.postRender.removeEventListener(takeScreenshot);
      const canvas = scene.canvas;
      try {
        canvas.toBlob(function (blob) {
          if (!blob) return;
          download(blob, "snapshot-" + dayjs().format("YYYYMMDDHHmmss") + ".png");
          // reset resolutionScale
          viewer.resolutionScale = 1.0;
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingState({ loading: false, msg: '스냅샷을 저장하는 중입니다.' });
      }
    };
    setLoadingState({ loading: true, msg: '스냅샷을 저장하는 중입니다.' });
    scene.preRender.addEventListener(prepareScreenshot);
  };

  const onClickPrint = () => {
    setPrintPortalOpen(!printPortalOpen);
  };

  const toggleFullscreen = () => {
    if (!Fullscreen.enabled) {
      alert('Fullscreen is not supported');
      return;
    }
    if (!Cesium.Fullscreen.fullscreen) {
      Fullscreen.requestFullscreen(document.querySelector('#container'));
    } else {
      Fullscreen.exitFullscreen();
    }
  };

  const resetDirection = () => {
    const { viewer } = globeController;
    if (!viewer) return;

    const camera = viewer.camera;
    const viewRectangle = camera.computeViewRectangle();

    if (!viewRectangle) return;

    camera.flyTo({
      destination: viewer.camera.positionWC,
      duration: 1.0,
      orientation: {
        heading: 0,
        pitch: viewer.camera.pitch,
        roll: viewer.camera.roll,
      },
    });
  };

  function isEllipsoidTerrainProvider(provider: any): provider is Cesium.EllipsoidTerrainProvider {
    return provider instanceof Cesium.EllipsoidTerrainProvider;
  }

  const toggleDefaultTerrain = async () => {
    const { viewer } = globeController;
    if (!viewer) return;

    if (viewer?.terrainProvider === undefined || isEllipsoidTerrainProvider(viewer.terrainProvider)) {
      viewer.terrainProvider = await Cesium.CesiumTerrainProvider.fromUrl(import.meta.env.VITE_TERRAIN_SERVER_URL);
    } else {
      viewer.terrainProvider = new Cesium.EllipsoidTerrainProvider();
    }

    setOptions((prevOptions) => ({
      ...prevOptions,
      isTerrain: !prevOptions.isTerrain,
    }));
  };

  const toggleTerrainTranslucent = () => {
    const { viewer } = globeController;
    if (!viewer) return;

    const globe = viewer.scene.globe;
    const isTranslucent = !globe.translucency.enabled;

    globe.translucency.enabled = isTranslucent ;

    if (isTranslucent ) {
      globe.translucency.frontFaceAlpha = 0.6;
      globe.translucency.backFaceAlpha = 0.6;
      globe.undergroundColorAlphaByDistance.nearValue = 1.0;
      globe.undergroundColorAlphaByDistance.farValue = 1.0;
      globe.undergroundColor = Cesium.Color.BLACK;
    }
    setOptions((prevOptions) => {
      const updatedOptions = {
        ...prevOptions,
        isTerrainTranslucent: !prevOptions.isTerrainTranslucent,
      };
      saveWebStorage(updatedOptions);
      return updatedOptions;
    });
  };

  const onClockTool = () => {
    setOptions((prevOptions) => ({
      ...prevOptions,
      isOpenClock: !prevOptions.isOpenClock,
    }));

    const { viewer } = globeController;
    if (!viewer) return;

    if (options.dateObject === undefined) {
      initDate();
    }
  };

  const onSettingTool = () => {
    setOptions((prevOptions) => ({
      ...prevOptions,
      isSetting: !prevOptions.isSetting,
    }));
  };

  // 후에 props 전달 방식으로 변경
  const toggleTheme = () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
  }

  return { toggleCoordinate, toggleMeasureRadius, angle, onClickCompas, onClickHome, onClickExpand, onClickReduce, onClickLength, onClickArea, onClickAngle, onClickSave, onClickPrint, onClickComplex, onClickSearch, toggleFullscreen, resetDirection, toggleDefaultTerrain, toggleTerrainTranslucent, onClockTool, onSettingTool, toggleTheme, initWebStorage, toolStatus};
};