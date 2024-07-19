import { useGlobeController } from "@/components/providers/GlobeControllerProvider";
import  * as Cesium from "cesium";
import dayjs from "dayjs";
import { download } from "@mnd/shared";
import { useRecoilState, useSetRecoilState } from "recoil";
import { LoadingStateType, loadingState } from "@/recoils/Spinner";
import {
  MeasureAngleOpenState,
  MeasureAreaOpenState,
  MeasureComplexOpenState,
  MeasureDistanceOpenState,
  Options,
  OptionsState,
  PrintPotalOpenState,
  SearchCoordinateOpenState,
  ToolStatus,
  ToolStatusState,
} from "@/recoils/Tool";
import {useEffect, useRef, useState} from "react";
import {EllipsoidTerrainProvider, Fullscreen} from "cesium";
import {getWmsLayer} from "@/components/utils/utils.ts";
import {MagoSSAORender, offSSAO, onSSAO} from "@/api/rendering/magoSsaoRender.ts";
import {MagoEdgeRender, offEdge, onEdge} from "@/api/rendering/magoEdgeRender.ts";

export const useMapTool = () => {
  const {globeController, initialized} = useGlobeController();
  const [toolStatus, setToolStatus] = useRecoilState<ToolStatus>(ToolStatusState);
  const setLoadingState = useSetRecoilState<LoadingStateType>(loadingState);
  const [printPortalOpen, setPrintPortalOpen] = useRecoilState(PrintPotalOpenState);
  const setMeasureDistanceOpen = useSetRecoilState(MeasureDistanceOpenState);
  const setMeasureAreaOpen = useSetRecoilState(MeasureAreaOpenState);
  const setMeasureAngleOpen = useSetRecoilState(MeasureAngleOpenState);
  const setMeasureComplexOpen = useSetRecoilState(MeasureComplexOpenState);
  const setSearchCoordinateOpen = useSetRecoilState(SearchCoordinateOpenState);
  const [options, setOptions] = useRecoilState(OptionsState);

  const [angle, setAngle] = useState(0);

  const clockInterval = useRef<number  | undefined>(undefined);

  useEffect(() => {
    initWebStorage();
  }, []);

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

  const initWebStorage = () => {
    const renderOptionsString = localStorage.getItem('renderOptions');
    if (!renderOptionsString) {
      localStorage.setItem('renderOptions', JSON.stringify(options.renderOptions));
    } else {
      try {
        const storedOptions = JSON.parse(renderOptionsString);
        setOptions((prevOptions) => ({
          ...prevOptions,
          renderOptions: storedOptions,
        }));

        const interval = setInterval(() => {
          const { viewer } = globeController;
          if (viewer !== undefined) {
            clearInterval(interval);
            applyStoredOptions(storedOptions);
          }
        }, 1000);
      } catch (error) {
        console.error('Error parsing renderOptions from localStorage:', error);
        localStorage.removeItem('renderOptions');
      }
    }
  };
  const applyStoredOptions = (storedOptions: any) => {
    toggleShadow(storedOptions.isShadow);
    toggleSSAO(storedOptions.isSSAO);
    toggleEdge(storedOptions.isEdge);
    toggleLighting(storedOptions.isLighting);
    toggleFxaa(storedOptions.isFxaa);
    setShadowQuality(storedOptions.shadowQuality);
    setResolution(storedOptions.renderQuality);
  };

  const saveWebStorage = (updatedOptions: Options) => {
    console.log(updatedOptions.renderOptions);
    localStorage.setItem('renderOptions', JSON.stringify(updatedOptions.renderOptions));
  };

  const resetWebStorage = () => {
    localStorage.setItem('renderOptions', JSON.stringify(options.defaultRenderOptions));
    initWebStorage();
  };

  const onClickCompas = () => {
    const {viewer} = globeController;
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
    const {viewer} = globeController;
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
  }

  const onClickExpand = () => {
    const {viewer} = globeController;
    if (!viewer) return;

    viewer.camera.zoomIn(20000);
    setToolStatus(null);
  }

  const onClickReduce = () => {
    const {viewer} = globeController;
    if (!viewer) return;

    viewer.camera.zoomOut(20000);
    setToolStatus(null);
  }

  const onClickLength = () => {
    setToolStatus((prev) => (prev === "length" ? null : "length"));
    setMeasureDistanceOpen((prev) => !prev);
  }

  const onClickArea = () => {
    setToolStatus((prev) => (prev === "area" ? null : "area"));
    setMeasureAreaOpen((prev) => !prev);
  }

  const onClickAngle = () => {
    setToolStatus((prev) => (prev === "angles" ? null : "angles"));
    setMeasureAngleOpen((prev) => !prev);
  }

  const onClickComplex = () => {
    setToolStatus((prev) => (prev === "composite" ? null : "composite"));
    setMeasureComplexOpen((prev) => !prev);
  }

  const onClickSearch = () => {
    setToolStatus((prev) => (prev === "search" ? null : "search"));
    setSearchCoordinateOpen((prev) => !prev)
  }

  const onClickSave = () => {
    const {viewer} = globeController;
    if (!viewer || !viewer.scene) return;
    const targetResolutionScale = 1.0;
    const timeout = 1000; // in ms

    const {scene} = viewer;

    // define callback functions
    const prepareScreenshot = function(){
      viewer.resolutionScale = targetResolutionScale;
      scene.preRender.removeEventListener(prepareScreenshot);
      // take snapshot after defined timeout to allow scene update (ie. loading data)
      setTimeout(function(){
          scene.postRender.addEventListener(takeScreenshot);
      }, timeout);
    }

    const takeScreenshot = function(){
      scene.postRender.removeEventListener(takeScreenshot);
      const canvas = scene.canvas;
      try {
        canvas.toBlob(function(blob){
            if (!blob) return;
            download(blob, "snapshot-" + dayjs().format("YYYYMMDDHHmmss") + ".png");
            // reset resolutionScale
            viewer.resolutionScale = 1.0;
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingState({loading: false, msg: '스냅샷을 저장하는 중입니다.'});
      }
    }
    setLoadingState({loading: true, msg: '스냅샷을 저장하는 중입니다.'});
    scene.preRender.addEventListener(prepareScreenshot);
  }

  const onClickPrint = () => {
    setPrintPortalOpen(!printPortalOpen);
  }

  const toggleFullscreen = () => {
    if (!Fullscreen.enabled) {
      alert('Fullscreen is not supported')
      return
    }
    if(!options.isFullscreen){
      Fullscreen.requestFullscreen(document.querySelector('#container'))
    } else {
      Fullscreen.exitFullscreen()
    }
    setOptions((prevOptions) => ({
      ...prevOptions,
      isFullscreen: !prevOptions.isFullscreen
    }));
  }

  const resetDirection = () => {
    const {viewer} = globeController;
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
          roll: viewer.camera.roll
        }
    });

    setToolStatus(null);
  }

  function isEllipsoidTerrainProvider(provider: any): provider is EllipsoidTerrainProvider {
    return provider instanceof EllipsoidTerrainProvider;
  }

  const toggleDefaultTerrain = async () => {
    const {viewer} = globeController;
    if (!viewer) return;

    if (viewer?.terrainProvider === undefined || isEllipsoidTerrainProvider(viewer.terrainProvider)) {
      viewer.terrainProvider = await Cesium.CesiumTerrainProvider.fromUrl(import.meta.env.VITE_TERRAIN_SERVER_URL);
    } else {
      viewer.terrainProvider = new Cesium.EllipsoidTerrainProvider();
    }

    setOptions((prevOptions) => ({
      ...prevOptions,
      isTerrain: !prevOptions.isTerrain
    }));
  };

  const toggleTerrainTranslucent = () => {
    const { viewer } = globeController;
    if (!viewer) return;

    const globe = viewer.scene.globe;
    const isTranslucent = options.isTerrainTranslucent;

    globe.translucency.enabled = !isTranslucent;

    if (!isTranslucent) {
      globe.translucency.frontFaceAlpha = 0.6;
      globe.translucency.backFaceAlpha = 0.6;
      globe.undergroundColorAlphaByDistance.nearValue = 1.0;
      globe.undergroundColorAlphaByDistance.farValue = 1.0;
      globe.undergroundColor = Cesium.Color.BLACK;
    }
    setOptions((prevOptions) => {
      const updatedOptions = {
        ...prevOptions,
        isTerrainTranslucent: !prevOptions.isTerrainTranslucent
      };
      saveWebStorage(updatedOptions);
      return updatedOptions;
    });
  };

  const initDate = () => {
    const { viewer } = globeController;
    if (!viewer) return;

    const dateObject = new Date();
    setOptions((prevOptions) => ({
      ...prevOptions,
      date: paddedDate(dateObject),
      time: paddedTime(dateObject),
      dateObject: dateObject,
    }));

    const today = dateObject;
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const start = Cesium.JulianDate.fromIso8601(today.toISOString());
    const stop = Cesium.JulianDate.fromIso8601(tomorrow.toISOString());
    const clock = viewer.clock;
    clock.startTime = start;
    clock.stopTime = stop;
    clock.currentTime = start;
    clock.clockRange = Cesium.ClockRange.UNBOUNDED;
    clock.multiplier = options.speed;
  };

  const paddedDate = (date: Date) => {
    const dd = String(date.getDate()).padStart(2, '0')
    const mm = String(date.getMonth() + 1).padStart(2, '0')
    const yyyy = String(date.getFullYear()).padStart(4, '0')
    return `${yyyy}-${mm}-${dd}`
  }

  const paddedTime = (date: Date) => {
    const hh = String(date.getHours()).padStart(2, '0')
    const mm = String(date.getMinutes()).padStart(2, '0')
    const ss = String(date.getSeconds()).padStart(2, '0')
    return `${hh}:${mm}:${ss}`
  }

  const changedDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = event.target;
    setOptions((prevOptions) => ({
      ...prevOptions,
      [name]: value,
    }));

    const { viewer } = globeController;
    if (!viewer) return;
    const clock = viewer.clock;
    const date = options.date.split('-');
    const time = options.time.split(':');
    const dateObject = new Date(
        parseInt(date[0]),
        parseInt(date[1]) - 1,
        parseInt(date[2]),
        parseInt(time[0]),
        parseInt(time[1]),
        parseInt(time[2])
    );
    clock.currentTime = Cesium.JulianDate.fromDate(dateObject);
  };

  const changedSpeed = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setOptions((prevOptions) => ({
      ...prevOptions,
      speed: parseInt(value),
    }));

    const { viewer } = globeController;
    if (!viewer) return;

    const clock = viewer.clock
    clock.multiplier = options.speed
  };

  const slowAnimation = () => {
    const { viewer } = globeController;
    if (!viewer) return;
    if (options.speed <= 1) {
      return;
    } else {
      const multiplier = Math.round(viewer.clock.multiplier / 2);
      viewer.clock.multiplier = multiplier;
      setOptions((prevOptions) => ({
        ...prevOptions,
        speed: multiplier,
      }));
    }
  };

  const fastAnimation = () => {
    const { viewer } = globeController;
    if (!viewer) return;
    if (options.speed >= 4096) {
      return;
    } else {
      const multiplier = Math.round(viewer.clock.multiplier * 2);
      viewer.clock.multiplier = multiplier;
      setOptions((prevOptions) => ({
        ...prevOptions,
        speed: multiplier,
      }));
    }
  };

  const toggleAnimation = () => {
    const { viewer } = globeController;
    if (!viewer) return;
    if (options.isAnimation) {
      viewer.clock.shouldAnimate = false;
      clearInterval(clockInterval.current);
      setOptions((prevOptions) => ({
        ...prevOptions,
        isAnimation: false,
        playText: '▶',
      }));
    } else {
      viewer.clock.shouldAnimate = true;
      clockInterval.current = window.setInterval(() => {
        const date = Cesium.JulianDate.toDate(viewer.clock.currentTime);
        setOptions((prevOptions) => ({
          ...prevOptions,
          dateObject: date,
          date: paddedDate(date),
          time: paddedTime(date),
        }));
      }, 1000);
      setOptions((prevOptions) => ({
        ...prevOptions,
        isAnimation: true,
        playText: '■',
      }));
    }
  };


  const toggleClock = () => {
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

  const toggleSetting = () => {
    setOptions((prevOptions) => ({
      ...prevOptions,
      isSetting: !prevOptions.isSetting,
    }));
  }

  const toggleShadow = (on: boolean) => {
    console.log("is shadow")
    console.log(on)
    console.log("is shadow")
    if (on !== undefined) {
      setOptions((prevOptions) => ({
        ...prevOptions,
        renderOptions: {
          ...prevOptions.renderOptions,
          isShadow: !on,
        },
      }));
    }

    const { viewer } = globeController;
    if (!viewer) return;

    if(on) {
      if (options.dateObject === undefined) {
        initDate();
      }
      viewer.scene.shadowMap.enabled = true;
      viewer.scene.shadowMap.darkness = 0.5;
    } else {
      viewer.scene.shadowMap.enabled = false;
    }
    setOptions((prevOptions) => {
      const updatedOptions = {
        ...prevOptions,
        renderOptions: {
          ...prevOptions.renderOptions,
          isShadow: !prevOptions.renderOptions.isShadow,
        },
      };
      saveWebStorage(updatedOptions);
      return updatedOptions;
    });
  };

  const setShadowQuality = (quality: string) => {
    const { viewer } = globeController;
    if (!viewer) return;
    if (quality === 'very-low') {
      viewer.shadowMap.size = 256
    } else if (quality === 'low') {
      viewer.shadowMap.size = 512
    } else if (quality === 'mid') {
      viewer.shadowMap.size = 1024
    } else if (quality === 'high') {
      viewer.shadowMap.size = 2048
    } else if (quality === 'very-high') {
      viewer.shadowMap.size = 4096
    }
    setOptions((prevOptions) => {
      const updatedOptions = {
        ...prevOptions,
        renderOptions: {
          ...prevOptions.renderOptions,
          shadowQuality: quality,
        },
      };
      saveWebStorage(updatedOptions);
      return updatedOptions;
    });
  };

  const setResolution = (quality: string) => {
    const { viewer } = globeController;
    if (!viewer) return;
    if (quality === 'very-low') {
      viewer.resolutionScale = 0.25
    } else if (quality === 'low') {
      viewer.resolutionScale = 0.5
    } else if (quality === 'mid') {
      viewer.resolutionScale = 0.75
    } else if (quality === 'high') {
      viewer.resolutionScale = 1.0
    } else if (quality === 'very-high') {
      viewer.resolutionScale = 1.5
    }
    setOptions((prevOptions) => {
      const updatedOptions = {
        ...prevOptions,
        renderOptions: {
          ...prevOptions.renderOptions,
          renderQuality: quality,
        },
      };
      saveWebStorage(updatedOptions);
      return updatedOptions;
    });
  };

  const toggleLighting = (on: boolean) => {
    if (on !== undefined) {
      setOptions((prevOptions) => ({
        ...prevOptions,
        renderOptions: {
          ...prevOptions.renderOptions,
          isLighting: !on,
        },
      }));
    }

    const { viewer } = globeController;
    if (!viewer) return;

    viewer.scene.globe.enableLighting = !on;
    setOptions((prevOptions) => {
      const updatedOptions = {
        ...prevOptions,
        renderOptions: {
          ...prevOptions.renderOptions,
          isLighting: !prevOptions.renderOptions.isLighting,
        },
      };
      saveWebStorage(updatedOptions);
      return updatedOptions;
    });
  };

  const toggleSSAO = (on: boolean) => {
    if (on !== undefined) {
      setOptions((prevOptions) => ({
        ...prevOptions,
        renderOptions: {
          ...prevOptions.renderOptions,
          isSSAO: !on,
        },
      }));
    }
    const { viewer } = globeController;
    if (!viewer) return;

    if (options.magoSsao === undefined) {
      setOptions((prevOptions) => ({
        ...prevOptions,
        magoSsao : MagoSSAORender(viewer)
      }));
    }

    if (on) {
      onSSAO();
    } else {
      offSSAO();
    }
    setOptions((prevOptions) => {
      const updatedOptions = {
        ...prevOptions,
        renderOptions: {
          ...prevOptions.renderOptions,
          isSSAO: !prevOptions.renderOptions.isSSAO,
        },
      };
      saveWebStorage(updatedOptions);
      return updatedOptions;
    });
  };

  const toggleFxaa = (on: boolean) => {
    if (on !== undefined) {
      setOptions((prevOptions) => ({
        ...prevOptions,
        renderOptions: {
          ...prevOptions.renderOptions,
          isFxaa: !on,
        },
      }));
    }

    const { viewer } = globeController;
    if (!viewer) return;

    viewer.scene.postProcessStages.fxaa.enabled = on;
    setOptions((prevOptions) => {
      const updatedOptions = {
        ...prevOptions,
        renderOptions: {
          ...prevOptions.renderOptions,
          isFxaa: !prevOptions.renderOptions.isFxaa,
        },
      };
      saveWebStorage(updatedOptions);
      return updatedOptions;
    });
  };

  const toggleEdge = (on: boolean) => {
    if (on !== undefined) {
      setOptions((prevOptions) => ({
        ...prevOptions,
        renderOptions: {
          ...prevOptions.renderOptions,
          isEdge: !on,
        },
      }));
    }
    const { viewer } = globeController;
    if (!viewer) return;

    if (options.magoEdge === undefined) {
      setOptions((prevOptions) => ({
        ...prevOptions,
        magoEdge : MagoEdgeRender(viewer)
      }));
    }

    if (on) {
      onEdge();
    } else {
      offEdge();
    }
    setOptions((prevOptions) => {
      const updatedOptions = {
        ...prevOptions,
        renderOptions: {
          ...prevOptions.renderOptions,
          isEdge: !prevOptions.renderOptions.isEdge,
        },
      };
      saveWebStorage(updatedOptions);
      return updatedOptions;
    });
  };


  return {angle, onClickCompas, onClickHome, onClickExpand, onClickReduce, onClickLength, onClickArea, onClickAngle, onClickSave, onClickPrint, onClickComplex, onClickSearch, toggleFullscreen, resetDirection, toggleDefaultTerrain, toggleTerrainTranslucent, toggleClock, changedDate, changedSpeed, toggleAnimation, slowAnimation, fastAnimation, toggleSetting, toggleShadow, setShadowQuality, setResolution, toggleLighting, toggleSSAO, toggleFxaa, toggleEdge, initWebStorage, toolStatus, options, setOptions};
  }