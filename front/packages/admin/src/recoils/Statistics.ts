import { atom } from "recoil";
import { SelectedDateType, SelectedYearStateType } from "../types/statistics";
import { currentYear } from "../components/statistics/common/TimeConverter";
import dayjs from "dayjs";

export const selectedYearState = atom<SelectedYearStateType>({
  key: "selectedYearState",
  default: {
    from: (currentYear - 5).toString(),
    to: currentYear.toString(),
  },
});

export const selectedMonthState = atom<SelectedDateType>({
  key: "SelectedMonthState",
  default: {
    from: `${currentYear}-01`,
    to: `${currentYear}-12`,
  },
});

const today = dayjs();
const formattedToday = today.format("YYYY-MM-DD");
const formattedLastWeek = today.subtract(7, "day").format("YYYY-MM-DD");

export const selectedDateState = atom<SelectedDateType>({
  key: "SelectedDateState",
  default: {
    from: formattedLastWeek,
    to: formattedToday,
  },
});
