import { useEffect, useState } from "react";
import { useGlobeController } from "@/components/providers/GlobeControllerProvider";
import { onCameraInformation } from "@/api/camera/magoCameraInformation";
import {useRecoilValue} from "recoil";
import {userLayerAssetArrState} from "@/recoils/Layer.ts";

type idActive = {
  id: string;
  active: boolean;
}

const PitchVisibilityController = () => {
  const { globeController, initialized } = useGlobeController();
  const viewer = globeController?.viewer;
  const {primitiveMap} = globeController;

  const [minPitch, setMinPitch] = useState(-90);
  const [maxPitch, setMaxPitch] = useState(-20);
  const [currentPitch, setCurrentPitch] = useState(0);
  const userLayerAssetArr = useRecoilValue(userLayerAssetArrState);

  const [layerIdActive, setLayerIdActive] = useState<idActive[]>([]);

  useEffect(() => {
    setLayerIdActive((prev) => {
      const updated = [...prev];

      userLayerAssetArr.forEach((layerAsset) => {
        const index = updated.findIndex((item) => item.id === layerAsset.assetId);

        if (index === -1) {
          updated.push({
            id: layerAsset.assetId,
            active: layerAsset.visible ?? false,
          });
        } else {
          updated[index] = {
            ...updated[index],
            active: layerAsset.visible ?? false,
          };
        }
      });

      return updated;
    });
  }, [userLayerAssetArr, primitiveMap]);

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
    primitiveMap.forEach((
      {
        billboardCollection,
        labelCollection,
        nearBillboardCollection,
        nearLabelCollection
      },
      primitiveId // ← Map의 key 값
    ) => {
      const layer = layerIdActive.find((item) => item.id === primitiveId);

      if (layer && !layer.active) return;

      billboardCollection.show = visible;
      labelCollection.show = visible;
      nearBillboardCollection.show = !visible;
      nearLabelCollection.show = !visible;
    });
  }, [visible, layerIdActive]);

  if (!initialized || !viewer) return null;

  return (
    <></>
    // <div style={{position: "absolute", bottom: 100, left: 10, backgroundColor: "black"}}>
    //   <div>현재 Pitch: <b>{currentPitch}°</b></div>
    //   <div>
    //     <label>
    //       최소 Pitch:
    //       <input
    //         type="number"
    //         value={minPitch}
    //         onChange={(e) => setMinPitch(Number(e.target.value))}
    //         min={-90}
    //         max={0}
    //       />
    //     </label>
    //   </div>
    //   <div>
    //     <label>
    //       최대 Pitch:
    //       <input
    //         type="number"
    //         value={maxPitch}
    //         onChange={(e) => setMaxPitch(Number(e.target.value))}
    //         min={-90}
    //         max={0}
    //       />
    //     </label>
    //   </div>
    // </div>
  );
};

export default PitchVisibilityController;
