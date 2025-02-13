import { GlobeController } from "@/api/GlobeController.ts";
import * as Cesium from "cesium";
import { useCallback } from "react";

interface ConfigureTerrainProps {
    globeController: GlobeController;
}

function isEllipsoidTerrainProvider(provider: Cesium.TerrainProvider){
    return provider?.constructor?.name === "EllipsoidTerrainProvider";
}

export const useTerrainController = ({ globeController }: ConfigureTerrainProps) => {
    const { viewer } = globeController;

    const enableTerrain = useCallback(async () => {
        if (!viewer) return;
        try {
            viewer.terrainProvider = await Cesium.CesiumTerrainProvider.fromUrl(import.meta.env.VITE_TERRAIN_SERVER_URL);
        } catch (error) {
            console.error("Failed to enable terrain:", error);
        }
    }, [viewer]);

    const disableTerrain = useCallback(() => {
        if (!viewer?.terrainProvider || isEllipsoidTerrainProvider(viewer.terrainProvider)) return;

        try {
            viewer.terrainProvider = new Cesium.EllipsoidTerrainProvider();
        } catch (error) {
            console.error("Failed to disable terrain:", error);
        }
    }, [viewer]);

    return { enableTerrain, disableTerrain };
};
