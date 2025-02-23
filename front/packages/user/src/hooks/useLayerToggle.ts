import { useGlobeController } from "@/components/providers/GlobeControllerProvider";
import { UserLayerAsset } from "@mnd/shared/src/types/layerset/gql/graphql";
import { getLayerFromCache } from "@/utils/layerCache";
import { LayerAssetType } from "@mnd/shared/src/types/layerset/gql/graphql";

export const useLayerToggle = () => {
    const { globeController } = useGlobeController();

    return (layerAsset: UserLayerAsset) => {
        const viewer = globeController?.viewer;
        if (!viewer || viewer.isDestroyed()) return;

        if (layerAsset.type === LayerAssetType.Icon) {
            const dataSources = viewer.dataSources.getByName(layerAsset.assetId);
            dataSources.forEach(ds => ds.show = !!layerAsset.visible);
        } else {
            const imageryLayer = getLayerFromCache(layerAsset.assetId);
            if (imageryLayer) imageryLayer.show = !!layerAsset.visible;
            else console.warn(`Cache miss: ${layerAsset.assetId}`);
        }
    };
};