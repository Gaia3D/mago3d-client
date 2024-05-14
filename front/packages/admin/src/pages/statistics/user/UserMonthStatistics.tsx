import { Suspense } from "react";
import { AppLoader } from "@mnd/shared";
import Statistics from "../../../components/statistics/user/Month";

function userMonthStatistics() {
  return (
    <Suspense fallback={<AppLoader />}>
      <Statistics />
    </Suspense>
  );
}
export default userMonthStatistics;
