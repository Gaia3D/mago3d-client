import { useGlobeController } from "@/components/providers/GlobeControllerProvider";
import {UserLayerAsset} from "@mnd/shared/src/types/layerset/gql/graphql";
import { getLayerFromCache } from "@/utils/layerCache";
import { loadIconLayer } from "@/services/imageryProviders/providers/loadIconLayer";
import { SetterOrUpdater } from "recoil";
import { LoadingStateType } from "@/recoils/Spinner";

export const useLayerVisibilitySetter = (setLoadingState: SetterOrUpdater<LoadingStateType>) => {
  const { globeController } = useGlobeController();

  return async (layerAsset: UserLayerAsset, visible: boolean) => {
    const viewer = globeController?.viewer;
    if (!viewer || viewer.isDestroyed()) return;
    const imageryLayer = getLayerFromCache(layerAsset.assetId);
    if (imageryLayer) {
      imageryLayer.show = visible;
    } else {
      const primitive = globeController.primitiveMap.get(layerAsset.assetId);

      if (primitive) {
        primitive.billboardCollection.show = visible;
        primitive.labelCollection.show = visible;
        primitive.nearBillboardCollection.show = visible;
        primitive.nearLabelCollection.show = visible;
      } else {
        await loadIconLayer({ ...layerAsset, visible }, viewer, setLoadingState);
      }
    }
  };
};
