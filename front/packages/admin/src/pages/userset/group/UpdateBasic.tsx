import {Suspense} from "react";
import {AppLoader} from "@mnd/shared";
import {UpdateBasic} from "@src/components/userset/group";

export function GroupUpdateBasic() {
  return (
    <Suspense fallback={<AppLoader/>}>
      <UpdateBasic/>
    </Suspense>
  )
}

