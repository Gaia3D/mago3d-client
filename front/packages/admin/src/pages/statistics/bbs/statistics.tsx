import {Suspense} from "react";
import {AppLoader} from "@mnd/shared";
import Statistics from "../../../components/statistics/bbs/BbsStatistics"

function BbsStatistics() {
    return (
        <Suspense fallback={<AppLoader />}>
            <Statistics />
        </Suspense>
    )
}
export default BbsStatistics;