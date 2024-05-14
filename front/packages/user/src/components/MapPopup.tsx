import { FC } from "react";
import ReactDOM from "react-dom";
import { atom, useRecoilState, useRecoilValue } from "recoil";

export const popupState = atom<React.ReactNode | null>({
  key: "MapPopup",
  default: null,
  effects: [
    ({ onSet }) => {
      onSet((newID) => {
        console.debug("Current popup ID:", newID);
      });
    },
  ],
});

export const MapPopup = () => {
  const [children] = useRecoilState(popupState);
  const el = document.querySelector("#map");

  return el && children ? ReactDOM.createPortal(children, el) : null;
};
