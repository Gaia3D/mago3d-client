import { selectedYearState } from "../../../recoils/Statistics";
import { useEffect, useState } from "react";
import useSelector from "./useDateSelector";

function YearSelector() {
  const currentYear = new Date().getFullYear();
  const [yearOptions, setYearOptions] = useState<number[]>([]);
  const { selected, handleChange } = useSelector(selectedYearState);

  useEffect(() => {
    const years = Array.from({ length: 10 }, (_, index) => currentYear - index);
    setYearOptions(years);
  }, [currentYear]);

  return (
    <li>
      <select value={selected.from} onChange={(e) => handleChange(e, "from")}>
        {yearOptions.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
      <span> ~ </span>
      <select value={selected.to} onChange={(e) => handleChange(e, "to")}>
        {yearOptions.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </li>
  );
}

export default YearSelector;
