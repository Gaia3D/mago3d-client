import {Outlet} from "react-router-dom";
import LayerSidebar from "../../layout/sidebar/layerset/LayerSideBar";

function LayerIndex() {
  return (
    <main>
      <LayerSidebar/>
      <Outlet/>
    </main>
  )
}

export default LayerIndex;

export * from './group/List';
export * from './group/UpdateLayerGroupIndex';
export * from './group/UpdateLayerGroupBasic';
export * from './group/UpdateLayerGroupData';
export * from './layer/List';
export * from './layer/Detail';
export * from './publish/Publish';
export * from './map/List';
