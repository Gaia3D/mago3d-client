import { selectedDateState } from "../../../recoils/Statistics";
import useSelector from "./useDateSelector";

function DaySelector() {
  const { selected, handleChange } = useSelector(selectedDateState);

  return (
    <li>
      <input
        type="date"
        value={selected.from}
        onChange={(e) => handleChange(e, "from")}
      />
      <span> ~ </span>
      <input
        type="date"
        value={selected.to}
        onChange={(e) => handleChange(e, "to")}
      />
    </li>
  );
}
export default DaySelector;
