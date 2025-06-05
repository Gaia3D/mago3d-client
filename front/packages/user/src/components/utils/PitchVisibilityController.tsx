import { useEffect, useState } from "react";
import { useGlobeController } from "@/components/providers/GlobeControllerProvider";
import { onCameraInformation } from "@/api/camera/magoCameraInformation";
import {useRecoilState} from "recoil";
import {Maybe, UserLayerGroup} from "@mnd/shared/src/types/layerset/gql/graphql.ts";
import {UserLayerGroupState} from "@/recoils/Layer.ts";

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

  const [layerIdActive, setLayerIdActive] = useState<idActive[]>([]);
  const [visible, setVisible] = useState(true);
  const [userLayerGroups, setUserLayerGroups] = useRecoilState<Maybe<UserLayerGroup>[]>(UserLayerGroupState);

  useEffect(() => {
    setLayerIdActive(() => {
      const updated: idActive[] = [];

      userLayerGroups.forEach(group => {
        if (!group) return;

        group.assets.forEach(asset => {
          updated.push({
            id: asset.assetId,
            active: asset.visible ?? false,
          });
        });
      });

      return updated;
    });
  }, [userLayerGroups]);

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
