import { useRecoilState } from "recoil";
import { produce } from "immer";
import { ChangeEvent } from "react";
import {
  selectedYearState,
  selectedMonthState,
  selectedDateState,
} from "../../../recoils/Statistics";

type StateType =
  | typeof selectedYearState
  | typeof selectedMonthState
  | typeof selectedDateState;

function useDateSelector(state: StateType) {
  const [selected, setSelected] = useRecoilState(state);

  const handleChange = (
    event: ChangeEvent<HTMLSelectElement | HTMLInputElement>,
    type: "from" | "to"
  ) => {
    const value = event.target.value;
    setSelected(
      produce((draft) => {
        if (type === "from") {
          draft.from = value;
        } else if (type === "to") {
          draft.to = value;
        }
      })
    );
  };

  return { selected, handleChange };
}

export default useDateSelector;
