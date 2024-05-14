import {Suspense} from "react";
import {AppLoader} from "@mnd/shared";
import List from '../../../components/symbol/group/GroupList'

export function SymbolGroupList() {
    return (
        <Suspense fallback={<AppLoader/>}>
            <List />
        </Suspense>
    )
}
