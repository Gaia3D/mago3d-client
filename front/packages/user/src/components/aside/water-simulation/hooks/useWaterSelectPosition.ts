import {Dispatch, SetStateAction, useEffect, useRef} from "react";
import {waterSimulationOptionsType} from "@/components/aside/water-simulation/utils/types.ts";
import {useGlobeController} from "@/components/providers/GlobeControllerProvider.tsx";
import {createGuidePolygonEntity} from "@/utils/entityUtils.ts";
import * as Cesium from "cesium";

export const useWaterSelectPosition = (
  positionSelecting: boolean,
  setPositionSelecting: Dispatch<SetStateAction<boolean>>,
  options: waterSimulationOptionsType,
  setOptions: Dispatch<SetStateAction<waterSimulationOptionsType>>
) => {
  const { initialized, globeController } = useGlobeController();
  const polygonEntityRef = useRef<Cesium.Entity | null>(null);
  const mousePositionRef = useRef<Cesium.Cartesian2 | null>(null);

  const setLonLat = (lon: number, lat: number) => {
    setOptions((prev) => ({
      ...prev,
      lon,
      lat,
    }));
    setPositionSelecting(false); // 선택 종료
  };

  useEffect(() => {
    if (!initialized || !globeController?.viewer || !globeController?.handler || !positionSelecting) return;

    const { viewer, handler } = globeController;
    const canvas = viewer.scene.canvas;
    canvas.style.cursor = "crosshair";

    handler.setInputAction((movement: Cesium.ScreenSpaceEventHandler.MotionEvent) => {
      mousePositionRef.current = movement.endPosition;
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    polygonEntityRef.current = createGuidePolygonEntity(globeController, mousePositionRef, options);

    handler.setInputAction((clicked: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
      const cartesian = globeController.pickPosition(clicked.position);
      if (!cartesian) return;

      const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
      const lon = Cesium.Math.toDegrees(cartographic.longitude);
      const lat = Cesium.Math.toDegrees(cartographic.latitude);
      setLonLat(lon, lat);
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    return () => {
      handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
      handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
      canvas.style.cursor = "default";
      if (polygonEntityRef.current) {
        viewer.entities.remove(polygonEntityRef.current);
        polygonEntityRef.current = null;
      }
    };
  }, [initialized, positionSelecting]);
}