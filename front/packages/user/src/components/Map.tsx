import { useCreateViewer } from "@/hooks/useCreateViewer";
import React, { useRef } from "react";
import RasterProfileChart from "./RasterProfileChart";
import { PrintPortal } from "./maptool/PrintPortal";
import { MeasureDistance } from "./maptool/MeasureDistance";
import { MeasureArea } from "./maptool/MeasureArea";
import { MeasureAngle } from "./maptool/MeasureAngle";
import { MeasureComplex } from "./maptool/MeasureComplex";
import { SearchCoordinate } from "./maptool/SearchCoordinate";
import AnalysisFilter from "./analysis/Filter";
import AnalResult from "./analysis/AnalResult";
import {ClockTool} from "./maptool/ClockTool.tsx";
import {SettingTool} from "./maptool/SettingTool.tsx";
import {CameraInfoDisplay} from "@/components/maptool/CameraInfoDisplay.tsx";
import {ObjectToolbox} from "./ObjectToolbox.tsx";
import {MeasurePosition} from "@/components/maptool/MeasurePosition.tsx";
import {MeasureRadius} from "@/components/maptool/MeasureRadius.tsx";
import {useLayerManagement} from "@/hooks/useLayerManagement.ts";
import {SearchPlaceList} from "@/components/SearchPlaceList.tsx";
import CameraAltitudeLimiter from "@/components/utils/CameraAltitudeLimiter.tsx";
import PitchVisibilityController from "@/components/utils/PitchVisibilityController.tsx";


const Globe = () => {
    const cesiumContainer = useRef<HTMLDivElement>(null);
    useCreateViewer(cesiumContainer);
    useLayerManagement();
    return (
        <div id="globe" className={"globe"} ref={cesiumContainer}>
          <SearchPlaceList />
          <RasterProfileChart />
          <PrintPortal />
          <MeasurePosition />
          <MeasureDistance />
          <MeasureArea />
          <MeasureAngle />
          <MeasureComplex />
          <MeasureRadius />
          <SearchCoordinate />
          <AnalysisFilter />
          <AnalResult />
          <ClockTool />
          <SettingTool />
          <CameraInfoDisplay />
          <ObjectToolbox />
          <CameraAltitudeLimiter />
          <PitchVisibilityController />
        </div>
    )
}

export default Globe;