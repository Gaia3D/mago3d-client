import { useEffect } from "react";
import {useRecoilValue, useSetRecoilState} from "recoil";
import {layersState, SelectedBackgroundState, UserLayerGroupState} from "@/recoils/Layer";
import { useGlobeController } from "@/components/providers/GlobeControllerProvider";
import keycloak from "@/api/keycloak";
import { createImageryLayer } from "@/services/imageryProviders/createImageryLayer";
import { addLayerToCache, clearLayerCache } from "@/utils/layerCache";
import {loadingState} from "@/recoils/Spinner.ts";

export const useLayerManagement = () => {
    const { token } = keycloak;
    const { initialized, globeController } = useGlobeController();
    const setLoadingState = useSetRecoilState(loadingState);
    const userLayerGroup = useRecoilValue(UserLayerGroupState);
    const layers = useRecoilValue(layersState);
    const selectedBackground = useRecoilValue(SelectedBackgroundState);

    useEffect(() => {
        if (!initialized || !globeController?.viewer) return;

        const { viewer, tilesPrimitives } = globeController;
        if (!viewer || !tilesPrimitives) return;
        const userLayerAssets = userLayerGroup.flatMap(group => group?.assets ?? []);

        clearLayerCache(viewer);

        userLayerAssets.slice().reverse().forEach(layer => {
            createImageryLayer(layer, viewer, setLoadingState, tilesPrimitives, selectedBackground, token)
                .then(createdLayer => {
                    if (createdLayer) {
                        addLayerToCache(layer.assetId, createdLayer);
                    }
                })
                .catch(error => {
                    // tileset.json 404 등 레이어 로드 실패 시 Uncaught 방지.
                    console.warn(`Failed to load layer ${layer.assetId}.`, error);
                });
        });

    }, [initialized, layers, selectedBackground]);
};
