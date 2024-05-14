import {Outlet} from "react-router-dom";
import StatisticsSideBar from "../../layout/sidebar/statistics/StatisticsSideBar";

function StatisticsGroup() {
    return (
        <main>
            <StatisticsSideBar />
            <Outlet />
        </main>
    )
}
export default StatisticsGroup;