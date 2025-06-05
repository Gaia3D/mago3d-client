import { useEffect } from "react";
import {useRecoilValue, useSetRecoilState} from "recoil";
import { layersState } from "@/recoils/Layer";
import { useGlobeController } from "@/components/providers/GlobeControllerProvider";
import keycloak from "@/api/keycloak";
import { createImageryLayer } from "@/services/imageryProviders/createImageryLayer";
import { addLayerToCache, clearLayerCache } from "@/utils/layerCache";
import {loadingState} from "@/recoils/Spinner.ts";

export const useLayerManagement = () => {
    const { token } = keycloak;
    const { initialized, globeController } = useGlobeController();
    const setLoadingState = useSetRecoilState(loadingState);
    const layers = useRecoilValue(layersState);

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
