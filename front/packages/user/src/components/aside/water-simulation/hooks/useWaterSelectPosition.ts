import { useEffect } from "react";
import { useGlobeController } from "@/components/providers/GlobeControllerProvider";
import * as Cesium from "cesium";

export const useWaterSelectPosition = (
  active: boolean,
  setLonLat: (lon: number, lat: number) => void
) => {
  const { initialized, globeController } = useGlobeController();

  useEffect(() => {
    if (!initialized || !active) return;

    const { viewer, handler } = globeController;
    if (!viewer || !handler) return;
    viewer.scene.canvas.style.cursor = "crosshair";

    handler.setInputAction((clicked: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
      const cartesian = globeController.pickPosition(clicked.position);
      if (!cartesian) return;

      const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
      const lon = Cesium.Math.toDegrees(cartographic.longitude);
      const lat = Cesium.Math.toDegrees(cartographic.latitude);

      setLonLat(lon, lat);
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    return () => {
      handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
      handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
      viewer.scene.canvas.style.cursor = "default";
    };
  }, [initialized, active]);
};
