import {Suspense} from "react";
import {AppLoader} from "@mnd/shared";
import Form from '../../../components/symbol/register/SymbolRegisterForm'

export function SymbolRegisterForm() {
    return (
        <Suspense fallback={<AppLoader/>}>
            <Form />
        </Suspense>
    )
}
