import React, { useMemo } from "react";
import { zoomIn } from "@/components/tool/actions/zoomIn";
import { zoomOut } from "@/components/tool/actions/zoomOut";
import { useGlobeController } from "@/components/providers/GlobeControllerProvider";
import MeasureLocation from "@/components/tool/actions/MeasureLocation.tsx";
import { enterFullScreen, exitFullScreen } from "@/components/tool/actions/fullScreen.ts";
import { createSetPersonView, removeSetPersonView } from "@/components/tool/actions/setPersonView.ts";
import { createSetIndoorView, removeSetIndoorView } from "@/components/tool/actions/setIndoorView.ts";
import { createSetLocationView, removeSetLocationView } from "@/components/tool/actions/setLocationView.ts";
import { createSetAxisView, removeSetAxisView } from "@/components/tool/actions/setAxisView.ts";
import ShowCameraInfo from "@/components/tool/actions/ShowCameraInfo.tsx";
import { useTerrainController } from "@/components/tool/actions/useTerrainController.ts";
import MeasureLength from "@/components/tool/actions/MeasureLength.tsx";
import {MeasureArea} from "@/components/tool/actions/MeasureArea.tsx";

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
                id: "set-person-view",
                type: "exclusive",
                onSelect: () => createSetPersonView(globeController),
                onDeselect: () => removeSetPersonView(globeController),
            },
            {
                id: "set-indoor-view",
                type: "exclusive",
                onSelect: () => createSetIndoorView(globeController),
                onDeselect: () => removeSetIndoorView(globeController),
            },
            {
                id: "set-location-view",
                type: "exclusive",
                onSelect: () => createSetLocationView(globeController),
                onDeselect: () => removeSetLocationView(),
            },
            {
                id: "set-axis-view",
                type: "exclusive",
                onSelect: () => createSetAxisView(globeController),
                onDeselect: () => removeSetAxisView(globeController),
            },
            {
                id: "show-camera-info",
                type: "toggle",
                component: <ShowCameraInfo globeController={globeController} unit={"m"} />,
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
        ];
    }, [globeController, initialized]);
};
