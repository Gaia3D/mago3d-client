import { mainMenuState } from "@/recoils/MainMenuState.tsx";
import { useRecoilValue } from "recoil";
import {AsideLayers} from "@/components/aside/layer/AsideLayer.tsx";
import AsideAssets from "@/components/aside/asset/AsideAssets.tsx";
import {AsideProps} from "@/components/aside/prop/AsideProps.tsx";
import AsideTerrains from "@/components/aside/terrain/AsideTerrain.tsx";

export interface AsideDisplayProps {
    display: boolean;
}

export const AsidePanel = () => {
    const menu = useRecoilValue(mainMenuState);

    return (
        <>
            <AsideAssets display={menu.SelectedId === "assets"} />
            <AsideLayers display={menu.SelectedId === "layers"} />
            <AsideTerrains display={menu.SelectedId === "terrains"} />
            <AsideProps display={menu.SelectedId === "props"} />
        </>
    );
};
