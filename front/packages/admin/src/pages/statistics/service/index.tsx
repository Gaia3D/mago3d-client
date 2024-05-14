import SidebarWithSelect from "@src/components/statistics/common/SidebarWithSelect";
import {Outlet} from "react-router-dom";

function ServiceStatisticsIndex() {
  const sidebarPropsArray = [
    { path: "/statistics/service/day", text: "일별"}
  ];
  return (
    <div className="contents">
      <h2>서비스 이용 통계</h2>
      <SidebarWithSelect divClassName="tabmenu" navLinkPropsArray={sidebarPropsArray} />
      <Outlet />
    </div>
  )
}
export default ServiceStatisticsIndex;
