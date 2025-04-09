import { useEffect, useState } from "react";
import { useGlobeController } from "@/components/providers/GlobeControllerProvider";
import { onCameraInformation } from "@/api/camera/magoCameraInformation";

const PitchVisibilityController = () => {
  const { globeController, initialized } = useGlobeController();
  const viewer = globeController?.viewer;
  const {primitiveMap} = globeController;

  const [minPitch, setMinPitch] = useState(-90);
  const [maxPitch, setMaxPitch] = useState(-20);
  const [currentPitch, setCurrentPitch] = useState(0);

  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!viewer || !initialized) return;

    const remove = onCameraInformation(viewer, (lon, lat, height, heading, pitch) => {
      const pitchDeg = Math.round(pitch * 100) / 100;
      setCurrentPitch(pitchDeg);
      setVisible(pitchDeg >= minPitch && pitchDeg <= maxPitch);
    });

    return () => {
      remove();
    };
  }, [viewer, initialized, minPitch, maxPitch]);

  useEffect(() => {
    primitiveMap.forEach(({ billboardCollection, labelCollection, nearBillboardCollection, nearLabelCollection }) => {
      billboardCollection.show = visible;
      labelCollection.show = visible;
      nearBillboardCollection.show = !visible;
      nearLabelCollection.show = !visible;
    });
  }, [visible]);

  if (!initialized || !viewer) return null;

  return (
    <div style={{position: "absolute", bottom: 100, left: 10, backgroundColor: "black"}}>
      <div>현재 Pitch: <b>{currentPitch}°</b></div>
      <div>
        <label>
          최소 Pitch:
          <input
            type="number"
            value={minPitch}
            onChange={(e) => setMinPitch(Number(e.target.value))}
            min={-90}
            max={0}
          />
        </label>
      </div>
      <div>
        <label>
          최대 Pitch:
          <input
            type="number"
            value={maxPitch}
            onChange={(e) => setMaxPitch(Number(e.target.value))}
            min={-90}
            max={0}
          />
        </label>
      </div>
    </div>
  );
};

export default PitchVisibilityController;
