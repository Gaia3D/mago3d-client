import { mainMenuState } from "@/recoils/MainMenuState";
import { useRecoilValue } from "recoil";
import { AsideLayer } from "@/components/AsideLayer";
import { AsideTimeSeries } from "@/components/AsideTimeSeries";
import { AsideSearch } from "@/components/AsideSearch";
import { AsideAnalysis } from "@/components/AsideAnalysis";
import { AsideCoord } from "@/components/AsideCoord";
import { AsideMapNote } from "./AsideMapNote";

export const AsidePanel = () => {
  const menu = useRecoilValue(mainMenuState);

  switch (menu.SelectedId) {
    case "layer":
      return <AsideLayer />; // 레이어
    case "search":
      return <AsideSearch />; // 검색
    default:
      return <></>;
  }
};
