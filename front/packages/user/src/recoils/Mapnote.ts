import { Coordinate } from "@/api/Coordinate";
import { atom } from "recoil";

export const IsSymbolDefineState = atom<boolean>({
  key: 'IsSymbolDefineState',
  default: false
});

export const SymbolPageState = atom<number>({
  key: 'SymbolPageState',
  default: 0
});

export const CurrentSymbolThumbnailState = atom<string>({
  key: 'CurrentSymbolThumbnailState',
  default: `${import.meta.env.VITE_SYMBOL_THUMBNAIL_DOWNLOAD_URL}/0`
});

export const CurrentSymbolId = atom<number>({
  key: 'CurrentSymbolIdState',
  default: 0
});

export const MapNoteCurrentPageState = atom<number>({
  key: 'MapNoteCurrentPageState',
  default: 0,
});

export const CoordinateFromReadCoordinateState = atom<Coordinate | null>({
  key: 'CoordinateFromReadCoordinateState',
  default: null,
});
  