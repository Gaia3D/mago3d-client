import { mainMenuState } from "@/recoils/MainMenuState";
import { useRecoilValue } from "recoil";
import {AsideLayers} from "@/components/AsideLayer";
import AsideAssets from "@/components/AsideAssets.tsx";
import {AsideProps} from "@/components/AsideProps.tsx";

export interface AsideDisplayProps {
    display: boolean;
}

export const AsidePanel = () => {
  const menu = useRecoilValue(mainMenuState);

  return (
      <>
        <AsideAssets display={menu.SelectedId === "assets"} />
        <AsideLayers display={menu.SelectedId === "layers"} />
        {/*<AsideProps display={menu.SelectedId === "props"} />*/}
      </>
  );
};
