import React, { useMemo } from "react";
import { zoomIn } from "@/components/tool/actions/zoomIn";
import { zoomOut } from "@/components/tool/actions/zoomOut";
import { useGlobeController } from "@/components/providers/GlobeControllerProvider";
import MeasureLocation from "@/components/tool/actions/MeasureLocation.tsx";
import { enterFullScreen, exitFullScreen } from "@/components/tool/actions/fullScreen.ts";
import { useTerrainController } from "@/components/tool/actions/useTerrainController.ts";
import {MeasureLength} from "@/components/tool/actions/MeasureLength.tsx";
import {MeasureArea} from "@/components/tool/actions/MeasureArea.tsx";
import {MeasureAngle} from "@/components/tool/actions/MeasureAngle.tsx";
import {MeasureRadius} from "@/components/tool/actions/MeasureRadius.tsx";
import {IndoorView} from "@/components/tool/actions/IndoorView.tsx";
import {PersonView} from "@/components/tool/actions/PersonView.tsx";
import {LocationView} from "@/components/tool/actions/LocationView.tsx";
import {AxisView} from "@/components/tool/actions/AxisView.tsx";
import CameraInfo from "@/components/tool/actions/CameraInfo.tsx";
import LayerInfo from "@/components/tool/actions/LayerInfo.tsx";

export interface ToolConfig {
    id: string;
    type: "default" | "toggle" | "exclusive";
    onSelect?: () => void;
    onDeselect?: () => void;
    component?: React.ReactNode;
}

export const useToolConfig = (): ToolConfig[] => {
    const { globeController, initialized } = useGlobeController();
    const { enableTerrain, disableTerrain } = useTerrainController({ globeController });

    return useMemo(() => {
        if (!initialized) return [];

        return [
            {
                id: "person-view",
                type: "toggle",
                component: <PersonView globeController={globeController} />
            },
            {
                id: "indoor-view",
                type: "exclusive",
                component: <IndoorView globeController={globeController} />
            },
            {
                id: "location-view",
                type: "exclusive",
                component: <LocationView globeController={globeController} />
            },
            {
                id: "axis-view",
                type: "exclusive",
                component: <AxisView globeController={globeController} />
            },
            {
                id: "camera-info",
                type: "toggle",
                component: <CameraInfo globeController={globeController} unit={"m"} />,
            },
            {
                id: "measure-location",
                type: "exclusive",
                component: <MeasureLocation globeController={globeController} unit={"m"} />,
            },
            {
                id: "measure-length",
                type: "exclusive",
                component: <MeasureLength globeController={globeController} unit={"m"} />,
            },
            {
                id: "measure-area",
                type: "exclusive",
                component: <MeasureArea globeController={globeController} unit={"m²"} />,
            },
            {
                id: "measure-angle",
                type: "exclusive",
                component: <MeasureAngle globeController={globeController} />,
            },
            {
                id: "measure-radius",
                type: "exclusive",
                component: <MeasureRadius globeController={globeController} unit={"m"} />,
            },
            {
                id: "terrain-controller",
                type: "toggle",
                onSelect: enableTerrain,
                onDeselect: disableTerrain,
            },
            {
                id: "full-screen",
                type: "toggle",
                onSelect: enterFullScreen,
                onDeselect: exitFullScreen,
            },
            {
                id: "zoom-in",
                type: "default",
                onSelect: () => zoomIn(globeController),
            },
            {
                id: "zoom-out",
                type: "default",
                onSelect: () => zoomOut(globeController),
            },
            {
                id: "layer-info",
                type: "exclusive",
                component: <LayerInfo globeController={globeController} />,
            },
        ];
    }, [globeController, initialized]);
};
