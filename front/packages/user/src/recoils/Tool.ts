import { atom } from "recoil";

const ATOM_KEYS = {
  PRINT_PORTAL_OPEN: 'PrintPotalOpenState',
  MEASURE_DISTANCE_OPEN: 'MeasureDistanceOpenState',
  MEASURE_AREA_OPEN: 'MeasureAreaOpenState',
  MEASURE_ANGLE_OPEN: 'MeasureAngleOpenState',
  MEASURE_COMPLEX_OPEN: 'MeasureComplexOpenState',
  SEARCH_COORDINATE_OPEN: 'SearchCoordinateOpenState',
  OPTIONS_STATE: 'OptionsState',
  TOOL_STATUS_STATE: 'ToolStatusState',
};

// 기본 렌더 옵션 상수
const DEFAULT_RENDER_OPTIONS = {
  isFxaa: true,
  isShadow: true,
  isSSAO: false,
  isEdge: false,
  isLighting: true,
  shadowQuality: 'mid',
  renderQuality: 'high',
};

export const PrintPotalOpenState = atom<boolean>({
  key: ATOM_KEYS.PRINT_PORTAL_OPEN,
  default: false,
});

export const MeasureDistanceOpenState = atom<boolean>({
  key: ATOM_KEYS.MEASURE_DISTANCE_OPEN,
  default: false,
});

export const MeasureAreaOpenState = atom<boolean>({
  key: ATOM_KEYS.MEASURE_AREA_OPEN,
  default: false,
});

export const MeasureAngleOpenState = atom<boolean>({
  key: ATOM_KEYS.MEASURE_ANGLE_OPEN,
  default: false,
});

export const MeasureComplexOpenState = atom<boolean>({
  key: ATOM_KEYS.MEASURE_COMPLEX_OPEN,
  default: false,
});

export const SearchCoordinateOpenState = atom<boolean>({
  key: ATOM_KEYS.SEARCH_COORDINATE_OPEN,
  default: false,
});

interface RenderOptions {
  isFxaa: boolean;
  isShadow: boolean;
  isSSAO: boolean;
  isEdge: boolean;
  isLighting: boolean;
  shadowQuality: string;
  renderQuality: string;
}

export type Options = {
  layer: number;
  selectedMapLayer?: any;
  isProjection2D: boolean;
  isFullscreen: boolean;
  isTerrain: boolean;
  isTerrainTranslucent: boolean;
  isOpenClock: boolean;
  isOpenSetting: boolean;
  isAnimation: boolean;
  isSetting: boolean;
  renderOptions: RenderOptions;
  defaultRenderOptions: RenderOptions;
  magoSsao?: any;
  magoEdge?: any;
  dateObject?: any;
  date: string;
  time: string;
  speed: number;
  playText: string;
};

export const OptionsState = atom<Options>({
  key: ATOM_KEYS.OPTIONS_STATE,
  default: {
    layer: 0,
    selectedMapLayer: undefined,
    isProjection2D: false,
    isFullscreen: false,
    isTerrain: false,
    isTerrainTranslucent: false,
    isOpenClock: false,
    isOpenSetting: false,
    isAnimation: false,
    isSetting: false,
    renderOptions: { ...DEFAULT_RENDER_OPTIONS },
    defaultRenderOptions: { ...DEFAULT_RENDER_OPTIONS },
    magoSsao: undefined,
    magoEdge: undefined,
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