import { selectedMonthState } from "../../../recoils/Statistics";
import useSelector from "./useDateSelector";

function MonthSelector() {
  const { selected, handleChange } = useSelector(selectedMonthState);

  return (
    <li>
      <input
        type="month"
        value={selected.from}
        onChange={(e) => handleChange(e, "from")}
      />
      <span> ~ </span>
      <input
        type="month"
        value={selected.to}
        onChange={(e) => handleChange(e, "to")}
      />
    </li>
  );
}
export default MonthSelector;
