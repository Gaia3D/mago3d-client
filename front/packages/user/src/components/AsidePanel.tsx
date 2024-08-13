import { mainMenuState } from "@/recoils/MainMenuState";
import { useRecoilValue } from "recoil";
import {AsideLayers} from "@/components/AsideLayer";
import AsideProps from "@/components/AsideProps.tsx";
import AsideAssets from "@/components/AsideAssets.tsx";
export const AsidePanel = () => {
  const menu = useRecoilValue(mainMenuState);

  switch (menu.SelectedId) {
    case "assets":
      return <AsideAssets />; // 레이어
    case "layer":
      return <AsideLayers />; // 레이어
    case "props":
      return <AsideProps />; // 검색
    default:
      return <></>;
  }
};
