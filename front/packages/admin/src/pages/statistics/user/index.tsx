import { Outlet } from "react-router-dom";
import SidebarWithSelect from "../../../components/statistics/common/SidebarWithSelect";

function UserStatisticsIndex() {
  const sidebarPropsArray = [
    { path: "/statistics/user/year", text: "연도별" },
    { path: "/statistics/user/month", text: "월별" },
  ];
  return (
    <div className="contents">
      <h2>사용자 통계</h2>
      <SidebarWithSelect divClassName="tabmenu" navLinkPropsArray={sidebarPropsArray} />
      <Outlet />
    </div>
  );
}
export default UserStatisticsIndex;
