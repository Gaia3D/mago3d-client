import { useCreateViewer } from "@/hooks/useCreateViewer";
import { useRef } from "react";
import MapFunction from "./MapFunction";
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

const Globe = () => {
    const cesiumContainer = useRef<HTMLDivElement>(null);
    useCreateViewer(cesiumContainer);
    return (
        <div id="globe" ref={cesiumContainer} style={{float:"right", height:"100vh", width:"calc( 100% - 350px)", backgroundColor:"gray"}}>
            <MapFunction />
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
        </div>
    )
}

export default Globe;