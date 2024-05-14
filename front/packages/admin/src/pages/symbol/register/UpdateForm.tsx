import {Suspense} from "react";
import {AppLoader} from "@mnd/shared";
import Form from '../../../components/symbol/register/SymbolUpdateForm'

export function SymbolUpdateForm() {
    return (
        <Suspense fallback={<AppLoader/>}>
            <Form />
        </Suspense>
    )
}
