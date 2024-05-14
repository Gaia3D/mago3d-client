import Sidebar from "../Sidebar";

function StatisticsSideBar() {
  const sidebarPropsArray = [
    { path: "/statistics/data/year", className: "statistic-data", text: "데이터" },
    { path: "/statistics/user/year", className: "statistic-user", text: "사용자" },
    { path: "/statistics/service/day", className: "statistic-service", text: "서비스 이용" },
    { path: "/statistics/analysis/year", className: "statistic-geospatial", text: "공간분석 서비스" },
  ];
  return (
    <Sidebar divClassName="side-bar" navLinkPropsArray={sidebarPropsArray} />
  );
}
export default StatisticsSideBar;
