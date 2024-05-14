import {Suspense} from "react";
import {AppLoader} from "@mnd/shared";
import List from "../../../components/layerset/group/LayerGroupList";

export function LayerGroupList() {
  return (
    <Suspense fallback={<AppLoader/>}>
      <List/>
    </Suspense>
  )
}
