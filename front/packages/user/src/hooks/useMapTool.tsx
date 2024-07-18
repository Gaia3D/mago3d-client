import { useGlobeController } from "@/components/providers/GlobeControllerProvider";
import  * as Cesium from "cesium";
import dayjs from "dayjs";
import { download } from "@mnd/shared";
import { useRecoilState, useSetRecoilState } from "recoil";
import { LoadingStateType, loadingState } from "@/recoils/Spinner";
import { MeasureAngleOpenState, MeasureAreaOpenState, MeasureComplexOpenState, MeasureDistanceOpenState, PrintPotalOpenState, SearchCoordinateOpenState, ToolStatus, ToolStatusState } from "@/recoils/Tool";
import { useEffect, useState } from "react";
import {Fullscreen} from "cesium";

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

  const [fullscreenOpen, setFullscreenOpen] = useState(false);
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

  const onClickFullscreen = () => {
    if (!Fullscreen.enabled) {
      alert('Fullscreen is not supported')
      return
    }
    if(!fullscreenOpen){
      Fullscreen.requestFullscreen(document.querySelector('#container'))
    } else {
      Fullscreen.exitFullscreen()
    }
    setFullscreenOpen((prev) => !prev);
  }

  return {angle, onClickCompas, onClickHome, onClickExpand, onClickReduce, onClickLength, onClickArea, onClickAngle, onClickSave, onClickPrint, onClickComplex, onClickSearch, toolStatus, onClickFullscreen};
}