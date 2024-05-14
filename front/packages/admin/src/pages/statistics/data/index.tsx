import { Outlet } from "react-router-dom";
import SidebarWithSelect from "../../../components/statistics/common/SidebarWithSelect";

function DataStatisticsIndex() {
  const sidebarPropsArray = [
    { path: "/statistics/data/year", text: "연도별" },
    { path: "/statistics/data/month", text: "월별" },
  ];
  return (
    <div className="contents">
      <h2>데이터 통계</h2>
      <SidebarWithSelect
        divClassName="tabmenu"
        navLinkPropsArray={sidebarPropsArray}
      />
      <Outlet />
    </div>
  );
}

export default DataStatisticsIndex;
