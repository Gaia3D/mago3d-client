import { atom } from "recoil";

type MainMenuState = {
  SelectedId: string;
};

export const mainMenuState = atom<MainMenuState>({
  key: "MainMenuState",
  default: {
    SelectedId: "",
  },
});

export const newLayerCountState = atom<number>({
  key: "newLayerCountState",
  default: 0
})

export const newTerrainCountState = atom<number>({
  key: "newTerrainCountState",
  default: 0
})
