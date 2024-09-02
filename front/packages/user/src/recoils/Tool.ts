import { atom } from "recoil";
import {Cartesian3} from "cesium";

const ATOM_KEYS = {
  PRINT_PORTAL_OPEN: 'PrintPotalOpenState',
  MEASURE_POSITION_OPEN: 'MeasurePositionOpenState',
  MEASURE_RADIUS_OPEN: 'MeasureRadiusOpenState',
  MEASURE_DISTANCE_OPEN: 'MeasureDistanceOpenState',
  MEASURE_AREA_OPEN: 'MeasureAreaOpenState',
  MEASURE_ANGLE_OPEN: 'MeasureAngleOpenState',
  MEASURE_COMPLEX_OPEN: 'MeasureComplexOpenState',
  SEARCH_COORDINATE_OPEN: 'SearchCoordinateOpenState',
  OPTIONS_STATE: 'OptionsState',
  TOOL_STATUS_STATE: 'ToolStatusState',
};

interface RenderOptions {
  isFxaa: boolean;
  isShadow: boolean;
  isSSAO: boolean;
  isEdge: boolean;
  isLighting: boolean;
  shadowQuality: string;
  renderQuality: string;
}

interface ViewOptions {
  isOpenCameraInfo: boolean;
  longitude: number,
  latitude: number,
  height: number,
  heading: number,
  compass: string,
}

interface PickedObject {
  id: string,
  name: string,
  position: Cartesian3 | undefined,
}

const DEFAULT_RENDER_OPTIONS = {
  isFxaa: true,
  isShadow: true,
  isSSAO: false,
  isEdge: false,
  isLighting: true,
  shadowQuality: 'mid',
  renderQuality: 'high',
};

const DEFAULT_VIEW_OPTIONS = {
  isOpenCameraInfo: false,
  longitude: 0,
  latitude: 0,
  height: 0,
  heading: 360,
  compass: 'N',
}

const DEFAULT_PICKED_OBJECT = {
  id: '',
  name: '',
  position: undefined,
}

export const PrintPotalOpenState = atom<boolean>({
  key: ATOM_KEYS.PRINT_PORTAL_OPEN,
  default: false,
});

export const MeasurePositionOpenState = atom<boolean>({
  key: ATOM_KEYS.MEASURE_POSITION_OPEN,
  default: false,
});

export const MeasureRadiusOpenState = atom<boolean>({
  key: ATOM_KEYS.MEASURE_RADIUS_OPEN,
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

export type Options = {
  layer: number;
  selectedMapLayer?: any;
  isProjection2D: boolean;
  isFullscreen: boolean;
  isTerrain: boolean;
  isTerrainTranslucent: boolean;
  isOpenClock: boolean;
  isOpenSetting: boolean;
  isOpenObjectTool: boolean;
  isAnimation: boolean;
  isSetting: boolean;
  isColoring: boolean;
  renderOptions: RenderOptions;
  defaultRenderOptions: RenderOptions;
  viewOptions: ViewOptions;
  pickedObject: PickedObject;
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
    isOpenObjectTool: false,
    isAnimation: false,
    isSetting: false,
    isColoring: false,
    renderOptions: { ...DEFAULT_RENDER_OPTIONS },
    defaultRenderOptions: { ...DEFAULT_RENDER_OPTIONS },
    viewOptions: { ...DEFAULT_VIEW_OPTIONS },
    pickedObject: { ...DEFAULT_PICKED_OBJECT },
    magoSsao: undefined,
    magoEdge: undefined,
    dateObject: undefined,
    date: '0001-01-01',
    time: '00:00:00',
    speed: 1,
    playText: '▶',
  }
})

export type ToolStatus = "position" | "radius" | "angles" | "length" | "area" | "composite" | "search" | null;

export const ToolStatusState = atom<ToolStatus>({
  key: 'ToolStatusState',
  default: null
});

export const CurrentCreatePropIdState = atom<string>({
  key: 'CurrentCreatePropIdState',
  default: ''
})