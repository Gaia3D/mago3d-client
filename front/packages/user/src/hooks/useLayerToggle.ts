import { useGlobeController } from "@/components/providers/GlobeControllerProvider";
import { UserLayerAsset } from "@mnd/shared/src/types/layerset/gql/graphql";
import { getLayerFromCache } from "@/utils/layerCache";
import { LayerAssetType } from "@mnd/shared/src/types/layerset/gql/graphql";
import {loadIconLayer} from "@/services/imageryProviders/providers/loadIconLayer.ts";
import {SetterOrUpdater} from "recoil";
import {LoadingStateType} from "@/recoils/Spinner.ts";

export const useLayerToggle = (setLoadingState: SetterOrUpdater<LoadingStateType>) => {
    const { globeController } = useGlobeController();

    return async (layerAsset: UserLayerAsset) => {
        const viewer = globeController?.viewer;
        if (!viewer || viewer.isDestroyed()) return;

        if (layerAsset.type === LayerAssetType.Icon) {
            const primitive = globeController.primitiveMap.get(layerAsset.assetId);

            if (primitive) {
                primitive.show = !!layerAsset.visible;
            } else {
                await loadIconLayer(layerAsset, viewer, setLoadingState);
            }
        } else {
            const imageryLayer = getLayerFromCache(layerAsset.assetId);
            if (imageryLayer) imageryLayer.show = !!layerAsset.visible;
            else console.warn(`Cache miss: ${layerAsset.assetId}`);
        }
    };
};