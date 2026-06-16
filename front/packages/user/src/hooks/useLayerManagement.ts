import { useEffect } from "react";
import {useRecoilValue, useSetRecoilState} from "recoil";
import {layersState, SelectedBackgroundState, UserLayerGroupState} from "@/recoils/Layer";
import { useGlobeController } from "@/components/providers/GlobeControllerProvider";
import keycloak from "@/api/keycloak";
import { createImageryLayer } from "@/services/imageryProviders/createImageryLayer";
import { addLayerToCache, clearLayerCache } from "@/utils/layerCache";
import {loadingState} from "@/recoils/Spinner.ts";
import { toast } from "react-toastify";

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

        const loadResults = userLayerAssets.slice().reverse().map(layer =>
            createImageryLayer(layer, viewer, setLoadingState, tilesPrimitives, selectedBackground, token)
                .then(createdLayer => {
                    if (createdLayer) {
                        addLayerToCache(layer.assetId, createdLayer);
                    }
                })
                .catch(error => {
                    // tileset.json 404 등 레이어 로드 실패. Uncaught는 막되 실패로 집계한다.
                    console.warn(`Failed to load layer ${layer.assetId}.`, error);
                    throw error;
                })
        );

        // 개별 실패마다 toast를 띄우면 도배되므로, 모두 끝난 뒤 실패 개수만 한 번 안내한다.
        Promise.allSettled(loadResults).then(results => {
            const failed = results.filter(r => r.status === "rejected").length;
            if (failed > 0) {
                toast.warn(`일부 지도 레이어를 불러오지 못했습니다. (${failed}개) 네트워크 또는 데이터 상태를 확인해 주세요.`, { autoClose: 5000 });
            }
        });

    }, [initialized, layers, selectedBackground]);
};
