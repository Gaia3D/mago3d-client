import { Suspense } from "react";
import { AppLoader } from "@mnd/shared";
import Statistics from "../../../components/statistics/data/Month";

function DataMonthStatistics() {
  return (
    <Suspense fallback={<AppLoader />}>
      <Statistics />
    </Suspense>
  );
}
export default DataMonthStatistics;
