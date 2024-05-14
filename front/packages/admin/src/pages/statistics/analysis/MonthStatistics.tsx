import { Suspense } from "react";
import { AppLoader } from "@mnd/shared";
import Statistics from "../../../components/statistics/analysis/Month";

function MonthStatistics() {
  return (
    <Suspense fallback={<AppLoader />}>
      <Statistics />
    </Suspense>
  );
}
export default MonthStatistics;
