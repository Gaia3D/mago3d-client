import {
  SelectedDateType,
  SelectedYearStateType,
} from "../../../types/statistics";
import dayjs, { OpUnitType } from "dayjs";
export const currentYear = new Date().getFullYear();

const calculateYearDifference = (year: string) => {
  const selectedYear = parseInt(year);
  if (currentYear === selectedYear) {
    return 0;
  } else {
    return currentYear - selectedYear;
  }
};

export const yearConverter = (selectedYear: SelectedYearStateType) => {
  // 년별 필터에 사용하기 위해 선택된 년도와 현재년도와의 차이 값을 구해 반환
  const from = calculateYearDifference(selectedYear.from);
  const to = calculateYearDifference(selectedYear.to);

  return { from, to };
};

const dateToISOString = (fromDate: dayjs.Dayjs, toDate: dayjs.Dayjs) => {
  // date 를 형식에 맞게 반환
  return { from: fromDate.toISOString(), to: toDate.toISOString() };
};

export const monthOrDayConverter = (
  selectedDate: SelectedDateType,
  type: OpUnitType
) => {
  // 월별 및 일별 필터에 사용하기 위해 선택된 월,일을 date 문자열으로 반환
  const fromDate = dayjs(selectedDate.from).startOf(type);
  const toDate = dayjs(selectedDate.to).endOf(type);

  return dateToISOString(fromDate, toDate);
};
