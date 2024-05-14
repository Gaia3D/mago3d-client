import {Outlet} from "react-router-dom";
import DataSidebar from "../../../layout/sidebar/dataset/DataSideBar";
import {useDataRecoilInit} from "../../../recoils/Data";
import {useEffect} from "react";

export function DatasetAssetIndex() {
  const reset = useDataRecoilInit();
  useEffect(() => {
    return () => reset();
  }, []);
  return (
    <main>
      <DataSidebar/>
      <Outlet/>
    </main>
  )
}

export * from './Create3D';
export * from './CreateAssetIndex';
export * from './CreateAssetRaster';
export * from './CreateAssetVector';
export * from './Detail';
export * from './List';
export * from './UpdateAsset3d';
export * from './UpdateAssetIndex';
export * from './UpdateAssetRaster';
export * from './UpdateAssetVector';