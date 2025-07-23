import { mainMenuState } from "@/recoils/MainMenuState.tsx";
import { useRecoilValue } from "recoil";
import {AsideLayers} from "@/components/aside/layer/AsideLayer.tsx";
import AsideAssets from "@/components/aside/asset/AsideAssets.tsx";
import {useEffect, useState} from "react";
import {assetsRefetchTriggerState} from "@/recoils/Assets.ts";
import {AsideSimulation} from "@/components/aside/simulation/AsideSimulation.tsx";
import AsideWaterSimulation from "@/components/aside/water-simulation/AsideWaterSimulation.tsx";
import AsidePrintArea from "@/components/aside/print-area/AsidePrintArea.tsx";

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
            <AsideSimulation display={menu.SelectedId === "simulation"} />
            <AsideWaterSimulation display={menu.SelectedId === "water-simulation"} />
            <AsidePrintArea display={menu.SelectedId === "print-area"} />
            {/*<AsideTerrains display={menu.SelectedId === "terrains"} />*/}
            {/*<AsideProps display={menu.SelectedId === "props"} />*/}
        </>
    );
};
