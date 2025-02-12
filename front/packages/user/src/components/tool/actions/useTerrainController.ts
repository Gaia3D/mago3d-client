import { GlobeController } from "@/api/GlobeController.ts";
import * as Cesium from "cesium";
import { useEffect, useRef, useCallback } from "react";
import { useRecoilState } from "recoil";
import { TerrainUrlState } from "@/recoils/Terrain.ts";

interface ConfigureTerrainProps {
    globeController: GlobeController;
}

function isEllipsoidTerrainProvider(provider: Cesium.TerrainProvider){
    return provider?.constructor?.name === "EllipsoidTerrainProvider";
}

export const useTerrainController = ({ globeController }: ConfigureTerrainProps) => {
    const { viewer } = globeController;
    const [terrainUrl] = useRecoilState(TerrainUrlState);
    const terrainUrlRef = useRef<string | null>(terrainUrl);

    // 최신 terrainUrl을 유지
    useEffect(() => {
        terrainUrlRef.current = terrainUrl;
    }, [terrainUrl]);

    const enableTerrain = useCallback(async () => {
        if (!viewer || !terrainUrlRef.current) return;

        const terrainUrl = terrainUrlRef.current;
        try {
            viewer.terrainProvider = await Cesium.CesiumTerrainProvider.fromUrl(
                `${import.meta.env.VITE_API_URL}${terrainUrl}`
            );
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
