import { NavLinkList } from "../../../layout";
import { NavLinkListProps } from "../../../types/Common";
import { useLocation } from "react-router-dom";
import YearSelector from "./YearSelector";
import MonthSelector from "./MonthSelector";
import DaySelector from "./DaySelector";

function SidebarWithSelect({
  divClassName,
  navLinkPropsArray,
}: {
  divClassName: string;
  navLinkPropsArray: NavLinkListProps[];
}) {
  const location = useLocation();
  const nowPath = location.pathname.includes("year")
    ? "year"
    : location.pathname.includes("month")
    ? "month"
    : location.pathname.includes("day")
    ? "day"
    : "";

  return (
    <>
      <div className={divClassName}>
        <ul>
          {navLinkPropsArray.map((navLinkProps, index) => (
            <NavLinkList key={index} {...navLinkProps} />
          ))}
          {nowPath === "year" ? (
            <YearSelector />
          ) : nowPath === "month" ? (
            <MonthSelector />
          ) : nowPath === "day" ? (
            <DaySelector />
          ) : (
            ""
          )}
        </ul>
        <div className="warning">
          선택 기간에 따라 조회 시간이 길어질 수 있습니다.
        </div>
      </div>
    </>
  );
}

export default SidebarWithSelect;
