import { atom } from "recoil";

export const PrintPotalOpenState = atom<boolean>({
  key: 'PrintPotalOpenState',
  default: false
});

export const MeasureDistanceOpenState = atom<boolean>({
  key: 'MeasureDistanceOpenState',
  default: false
});

export const MeasureAreaOpenState = atom<boolean>({
  key: 'MeasureAreaOpenState',
  default: false
});

export const MeasureAngleOpenState = atom<boolean>({
  key: 'MeasureAngleOpenState',
  default: false
});

export const MeasureComplexOpenState = atom<boolean>({
  key: 'MeasureComplexOpenState',
  default: false
});

export const SearchCoordinateOpenState = atom<boolean>({
  key: 'SearchCoordinateOpenState',
  default: false
});

export type Options = {
  isFullscreen: boolean;
  isTerrain: boolean;
  isTerrainTranslucent: boolean;
  isOpenClock: boolean;
  isOpenSetting: boolean;
  isAnimation: boolean;
  dateObject?: Date;
  date: string;
  time: string;
  speed: number;
  playText: string;
};

export const OptionsState = atom<Options>({
  key: 'OptionsState',
  default: {
    isFullscreen: false,
    isTerrain: false,
    isTerrainTranslucent: false,
    isOpenClock: false,
    isOpenSetting: false,
    isAnimation: false,
    dateObject: undefined,
    date: '0001-01-01',
    time: '00:00:00',
    speed: 1,
    playText: '▶',
  }
})

export type ToolStatus = "angles" | "length" | "area" | "composite" | "search" | null;

export const ToolStatusState = atom<ToolStatus>({
  key: 'ToolStatusState',
  default: null
});