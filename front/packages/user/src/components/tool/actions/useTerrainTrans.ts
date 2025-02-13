import { GlobeController } from "@/api/GlobeController.ts";
import * as Cesium from "cesium";
import { useCallback } from "react";

interface TerrainTransProps {
    globeController: GlobeController;
}

export const useTerrainTrans = ({ globeController }: TerrainTransProps) => {
    const enableTerrainTrans = useCallback(() => {
        const viewer = globeController.viewer;
        if (!viewer) return;

        const globe = viewer.scene.globe;
        Object.assign(globe.translucency, {
            enabled: true,
            frontFaceAlpha: 0.6,
            backFaceAlpha: 0.6
        });

        Object.assign(globe.undergroundColorAlphaByDistance, {
            nearValue: 1.0,
            farValue: 1.0
        });

        globe.undergroundColor = Cesium.Color.BLACK;
    }, [globeController]);

    const disableTerrainTrans = useCallback(() => {
        const viewer = globeController.viewer;
        if (!viewer) return;

        viewer.scene.globe.translucency.enabled = false;
    }, [globeController]);

    return { enableTerrainTrans, disableTerrainTrans };
};
