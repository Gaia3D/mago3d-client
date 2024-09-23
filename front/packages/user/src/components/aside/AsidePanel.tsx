import { mainMenuState } from "@/recoils/MainMenuState.tsx";
import { useRecoilValue } from "recoil";
import {AsideLayers} from "@/components/aside/layer/AsideLayer.tsx";
import AsideAssets from "@/components/aside/asset/AsideAssets.tsx";
import {AsideProps} from "@/components/aside/prop/AsideProps.tsx";
import AsideTerrains from "@/components/aside/terrain/AsideTerrain.tsx";
import {useEffect, useState} from "react";
import {assetsRefetchTriggerState} from "@/recoils/Assets.ts";

export interface AsideDisplayProps {
    display: boolean;
}

export const AsidePanel = () => {
    const menu = useRecoilValue(mainMenuState);
    const assetsRefetchTrigger = useRecoilValue(assetsRefetchTriggerState);

    const [key, setKey] = useState(0);

    useEffect(() => {
        setKey((prev) => prev + 1);
    }, [assetsRefetchTrigger]);

    return (
        <>
            <AsideAssets key={key} display={menu.SelectedId === "assets"} />
            <AsideLayers display={menu.SelectedId === "layers"} />
            <AsideTerrains display={menu.SelectedId === "terrains"} />
            <AsideProps display={menu.SelectedId === "props"} />
        </>
    );
};
