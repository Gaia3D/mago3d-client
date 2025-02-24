import { useEffect } from "react";
import {useRecoilCallback, useRecoilValue, useSetRecoilState} from "recoil";
import { layersState, userLayerAssetArrState } from "@/recoils/Layer";
import { useGlobeController } from "@/components/providers/GlobeControllerProvider";
import keycloak from "@/api/keycloak";
import { useLayerToggle } from "./useLayerToggle";
import { createImageryLayer } from "@/services/imageryProviders/createImageryLayer";
import { addLayerToCache, clearLayerCache } from "@/utils/layerCache";
import {loadingState} from "@/recoils/Spinner.ts";

export const useLayerManagement = () => {
    const { token } = keycloak;
    const { initialized, globeController } = useGlobeController();
    const setLoadingState = useSetRecoilState(loadingState);
    const toggleLayerVisibility = useLayerToggle(setLoadingState);
    const userLayerAssetArr = useRecoilValue(userLayerAssetArrState);
    const layers = useRecoilValue(layersState);
    const resetUserLayerAssets = useRecoilCallback(({ set }) => () => set(userLayerAssetArrState, []), []);

    useEffect(() => {
        if(userLayerAssetArr.length === 0) return;

        userLayerAssetArr.forEach(toggleLayerVisibility);
        resetUserLayerAssets();
    }, [userLayerAssetArr, toggleLayerVisibility, resetUserLayerAssets]);

    useEffect(() => {
        if (!initialized || !globeController?.viewer) return;

        const { viewer, tilesPrimitives } = globeController;
        if (!viewer || !tilesPrimitives) return;

        clearLayerCache(viewer);

        layers.slice().reverse().forEach(layer => {
            createImageryLayer(layer, viewer, setLoadingState, tilesPrimitives, token)
                .then(createdLayer => {
                    if (createdLayer) {
                        addLayerToCache(layer.assetId, createdLayer);
                    }
                });
        });

    }, [initialized, layers]);
};
