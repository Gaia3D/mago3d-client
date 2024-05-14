import { Suspense } from "react";
import { AppLoader } from "@mnd/shared";
import { useParams } from "react-router-dom";
import { useNotFindId } from "@src/hooks/common";
import {Update} from "@src/components/userset/user";

export function UserUpdate() {
    const {id} = useParams();
    useNotFindId('/notice');
   
    return (
        <Suspense fallback={<AppLoader/>}>
            <Update id={id ?? ''}/>
        </Suspense>
    )
}
