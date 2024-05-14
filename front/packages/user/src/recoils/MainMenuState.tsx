import { atom } from "recoil";

type MainMenuState = {
  SelectedId: string;
};

export const mainMenuState = atom<MainMenuState>({
  key: "MainMenuState",
  default: {
    SelectedId: "layer",
  },
});
