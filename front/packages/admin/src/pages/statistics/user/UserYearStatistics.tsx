import { Suspense } from "react";
import { AppLoader } from "@mnd/shared";
import Statistics from "../../../components/statistics/user/Year";

function UserYearStatistics() {
  return (
    <Suspense fallback={<AppLoader />}>
      <Statistics />
    </Suspense>
  );
}
export default UserYearStatistics;
