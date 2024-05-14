import { Product } from "@mnd/shared/src/types/timeseries-gen-type";
import dayjs from "dayjs";
import { atom } from "recoil";

type TimeSeriesState = {
  mainTabIndex: number;
  searchMenuIndex: number;
  drawIndex: number;
};

export type TimeSeriesSearchCondition = {
  producting: boolean,
  startDate: string | undefined,
  endDate: string | undefined,
  checkedTimeSeriesType: string[],
  selectedMonth: number[],
  wkt: string | undefined,
  page: number,
  code: string | undefined,
}

export const timeSeriesState = atom<TimeSeriesState>({
  key: "TimeSeriesState",
  default: {
    mainTabIndex: 0,
    searchMenuIndex: 0,
    drawIndex: 0,
  },
});

export const drawedEntityIdState = atom<string | undefined>({
  key: "drawedEntityIdState",
  default: undefined,
});

export const productDetailState = atom<Product | null>({
  key: 'productDetailState',
  default: null,
});

export const timeseriesSearchConditionState = atom<TimeSeriesSearchCondition>({
  key: 'timeseriesSearchConditionState',
  default: {
    producting: false,
    startDate: undefined,
    endDate: dayjs().format('YYYY-MM-DD'),
    checkedTimeSeriesType: [],
    selectedMonth: [],
    wkt: undefined,
    page: 0,
    code: undefined,
  },
});

export const checkedIdsState = atom<string[]>({
  key: 'checkedIdsState',
  default: [],
});

export const batchFootprintState = atom<string[]>({
  key: 'batchFootprintState',
  default: [],
});

export const batchImageState = atom<string[]>({
  key: 'batchImageState',
  default: [],
});