import StatisticsIndex from "../pages/statistics/index";
import ServiceStatistics from "../pages/statistics/service/statistics";
import DataStatisticsIndex from "../pages/statistics/data";
import DataYearStatistics from "../pages/statistics/data/DataYearStatistics";
import DataMonthStatistics from "../pages/statistics/data/DataMonthStatistics";
import UserStatisticsIndex from "../pages/statistics/user";
import UserYearStatistics from "../pages/statistics/user/UserYearStatistics";
import UserMonthStatistics from "../pages/statistics/user/UserMonthStatistics";
import YearStatistics from "../pages/statistics/analysis/YearStatistics";
import MonthStatistics from "../pages/statistics/analysis/MonthStatistics";
import DayStatistics from "../pages/statistics/analysis/DayStatistics";
import GeospatialStatisticsIndex from "../pages/statistics/analysis";
import { Navigate } from "react-router-dom";
import ServiceStatisticsIndex from "../pages/statistics/service";

export default {
  path: "/statistics/*",
  element: <StatisticsIndex />,
  children: [
    { element: <Navigate to="data/year" replace />, index: true },
    {
      path: "data/*",
      element: <DataStatisticsIndex />,
      children: [
        { path: "year", element: <DataYearStatistics /> },
        { path: "month", element: <DataMonthStatistics /> },
      ],
    },
    {
      path: "user/*",
      element: <UserStatisticsIndex />,
      children: [
        { path: "year", element: <UserYearStatistics /> },
        { path: "month", element: <UserMonthStatistics /> },
      ],
    },
    {
      path: "service/*",
      element: <ServiceStatisticsIndex />,
      children: [
        { path: "day", element: <ServiceStatistics /> }
      ],
    },
    {
      path: "analysis/*",
      element: <GeospatialStatisticsIndex />,
      children: [
        { path: "year", element: <YearStatistics /> },
        { path: "month", element: <MonthStatistics /> },
        { path: "day", element: <DayStatistics /> },
      ],
    },
  ],
};
