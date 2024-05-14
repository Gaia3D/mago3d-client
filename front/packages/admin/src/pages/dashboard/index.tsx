import {AppLoader} from "@mnd/shared";
import {Suspense} from "react";
import Board from "../../components/dashboard/Dashboard";

function Dashboard() {
    return (
        <main>
            <Suspense fallback={<AppLoader/>}>
                <Board />
            </Suspense>
        </main>
    )
}
export default Dashboard;