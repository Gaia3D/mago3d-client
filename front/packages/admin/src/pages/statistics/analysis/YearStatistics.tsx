import { Suspense } from "react";
import { AppLoader } from "@mnd/shared";
import Statistics from "../../../components/statistics/analysis/Year";

function YearStatistics() {
  return (
    <Suspense fallback={<AppLoader />}>
      <Statistics />
    </Suspense>
  );
}
export default YearStatistics;
