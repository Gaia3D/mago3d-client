import {Suspense} from "react";
import {AppLoader} from "@mnd/shared";
import List from "../../../components/symbol/symbol/SymbolList"

export function SymbolList() {
    return (
        <Suspense fallback={<AppLoader/>}>
            <List />
        </Suspense>
    )
}
