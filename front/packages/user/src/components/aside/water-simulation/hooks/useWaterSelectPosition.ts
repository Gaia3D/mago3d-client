import { useEffect, useRef } from "react";
import { useGlobeController } from "@/components/providers/GlobeControllerProvider";
import * as Cesium from "cesium";
import {createGuidePolygonEntity} from "@/utils/entityUtils.ts";
import {waterSimulationOptionsType} from "@/components/aside/water-simulation/utils/types.ts";

export const useWaterSelectPosition = (
  active: boolean,
  setLonLat: (lon: number, lat: number) => void,
  optionsRef: React.MutableRefObject<waterSimulationOptionsType>
) => {
  const { initialized, globeController } = useGlobeController();
  const polygonEntityRef = useRef<Cesium.Entity | null>(null);
  const mousePositionRef = useRef<Cesium.Cartesian2 | null>(null);

  useEffect(() => {
    if (!initialized || !globeController?.viewer || !globeController?.handler || !active) return;

    const { viewer, handler } = globeController;
    const canvas = viewer.scene.canvas;
    canvas.style.cursor = "crosshair";

    handler.setInputAction((movement: Cesium.ScreenSpaceEventHandler.MotionEvent) => {
      mousePositionRef.current = movement.endPosition;
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    polygonEntityRef.current = createGuidePolygonEntity(globeController, mousePositionRef, optionsRef);

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
  }, [initialized, active]);
};
