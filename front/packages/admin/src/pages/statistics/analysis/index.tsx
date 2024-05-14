import { Outlet } from "react-router-dom";
import SidebarWithSelect from "../../../components/statistics/common/SidebarWithSelect";

function GeospatialStatisticsIndex() {
  const sidebarPropsArray = [
    { path: "/statistics/analysis/year", text: "연도별" },
    { path: "/statistics/analysis/month", text: "월별" },
    { path: "/statistics/analysis/day", text: "일별" },
  ];
  return (
    <div className="contents">
      <h2>공간분석 서비스 통계</h2>
      <SidebarWithSelect divClassName="tabmenu" navLinkPropsArray={sidebarPropsArray} />
      <Outlet />
    </div>
  );
}
export default GeospatialStatisticsIndex;
