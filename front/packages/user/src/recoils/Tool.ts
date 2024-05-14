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

export type ToolStatus = "angles" | "length" | "area" | "composite" | "search" | null;

export const ToolStatusState = atom<ToolStatus>({
  key: 'ToolStatusState',
  default: null
});