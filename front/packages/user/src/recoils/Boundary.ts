import { BoundarySearchItem } from "@mnd/shared/src/types/search-gen-type";
import { atom } from "recoil";

export const selectedSidoState = atom<BoundarySearchItem | undefined>({
  key: 'selectedSidoState',
  default: undefined
});

export const selectedSggState = atom<BoundarySearchItem | undefined>({
  key: 'selectedSggState',
  default: undefined
});

export const selectedUmdState = atom<BoundarySearchItem | undefined>({
  key: 'selectedUmdState',
  default: undefined
});
