import { useEffect, useRef, useState } from "react";
import * as Cesium from "cesium";
import { useGlobeController } from "@/components/providers/GlobeControllerProvider";
import {onCameraInformation} from "@/api/camera/magoCameraInformation.ts";

const CameraAltitudeLimiter = () => {
  const { globeController, initialized } = useGlobeController();
  const viewer = globeController?.viewer;
  const [currentHeight, setCurrentHeight] = useState(0);
  const [minHeight, setMinHeight] = useState(1000);
  const lastValidPositionRef = useRef<Cesium.Cartographic | null>(null);

  useEffect(() => {
    if (!initialized || !viewer) return;

    const remove = onCameraInformation(viewer, (lon, lat, height, heading, pitch) => {
      setCurrentHeight(height);

      if (height < minHeight) {
        viewer.camera.setView({
          destination: Cesium.Cartesian3.fromRadians(
            Cesium.Math.toRadians(lon),
            Cesium.Math.toRadians(lat),
            minHeight
          ),
          orientation: {
            heading: Cesium.Math.toRadians(heading),
            pitch: viewer.camera.pitch,
          },
        });
      } else {
        lastValidPositionRef.current = Cesium.Cartographic.fromDegrees(lon, lat, height);
      }
    });

    return () => {
      remove();
    };
  }, [initialized, viewer, minHeight]);

  if (!initialized || !viewer) return null;

  return (
    <div style={{ position: "absolute", bottom: 40, left: 10, backgroundColor: "black"}}>
      <div>현재 고도(m): {Math.round(currentHeight)}</div>
      <div>
        최소 고도 제한 (m):
        <input
          type="number"
          value={minHeight}
          onChange={(e) => setMinHeight(Number(e.target.value))}
          style={{ width: 80 }}
        />
      </div>
    </div>
  );
};

export default CameraAltitudeLimiter;
