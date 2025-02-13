import React, { useMemo } from "react";
import { zoomIn } from "@/components/tool/actions/zoomIn";
import { zoomOut } from "@/components/tool/actions/zoomOut";
import { useGlobeController } from "@/components/providers/GlobeControllerProvider";
import MeasureLocation from "@/components/tool/actions/MeasureLocation.tsx";
import { enterFullScreen, exitFullScreen } from "@/components/tool/actions/fullScreen.ts";
import { useTerrainSetting } from "@/components/tool/actions/useTerrainSetting.ts";
import {MeasureLength} from "@/components/tool/actions/MeasureLength.tsx";
import {MeasureArea} from "@/components/tool/actions/MeasureArea.tsx";
import {MeasureAngle} from "@/components/tool/actions/MeasureAngle.tsx";
import {MeasureRadius} from "@/components/tool/actions/MeasureRadius.tsx";
import {PersonView} from "@/components/tool/actions/PersonView.tsx";
import {LocationView} from "@/components/tool/actions/LocationView.tsx";
import {AxisView} from "@/components/tool/actions/AxisView.tsx";
import CameraInfo from "@/components/tool/actions/CameraInfo.tsx";
import LayerInfo from "@/components/tool/actions/LayerInfo.tsx";
import {useTerrainTrans} from "@/components/tool/actions/useTerrainTrans.ts";

export interface ToolConfig {
    id: string;
    type: "default" | "toggle" | "exclusive";
    title: string;
    onSelect?: () => void;
    onDeselect?: () => void;
    component?: React.ReactNode;
    helper?: string;
}

export const useToolConfig = (): ToolConfig[] => {
    const { globeController, initialized } = useGlobeController();
    const { enableTerrain, disableTerrain } = useTerrainSetting({ globeController });
    const { enableTerrainTrans, disableTerrainTrans } = useTerrainTrans({ globeController });

    return useMemo(() => {
        if (!initialized) return [];

        return [
            {
                id: "person-view",
                title: "카메라 고정",
                type: "toggle",
                component: <PersonView globeController={globeController} />,
                helper: "카메라가 고정됩니다.",
            },
            // {
            //     id: "indoor-view",
            //     type: "exclusive",
            //     component: <IndoorView globeController={globeController} />
            // },
            {
                id: "location-view",
                type: "exclusive",
                title: "지점 이동",
                component: <LocationView globeController={globeController} />,
            },
            {
                id: "axis-view",
                type: "exclusive",
                title: "축 이동",
                component: <AxisView globeController={globeController} />,
            },
            {
                id: "camera-info",
                type: "toggle",
                title: "카메라 정보",
                component: <CameraInfo globeController={globeController} unit={"m"} />,
            },
            {
                id: "layer-info",
                type: "exclusive",
                title: "레이어 정보",
                component: <LayerInfo globeController={globeController} />,
            },
            {
                id: "measure-location",
                type: "exclusive",
                title: "위치 측정",
                component: <MeasureLocation globeController={globeController} unit={"m"} />,
            },
            {
                id: "measure-length",
                type: "exclusive",
                title: "길이 측정",
                component: <MeasureLength globeController={globeController} unit={"m"} />,
            },
            {
                id: "measure-area",
                type: "exclusive",
                title: "면적 측정",
                component: <MeasureArea globeController={globeController} unit={"m²"} />,
            },
            {
                id: "measure-angle",
                type: "exclusive",
                title: "각도 측정",
                component: <MeasureAngle globeController={globeController} />,
            },
            {
                id: "measure-radius",
                type: "exclusive",
                title: "반지름 측정",
                component: <MeasureRadius globeController={globeController} unit={"m"} />,
            },
            {
                id: "terrain-setting",
                type: "toggle",
                title: "지형 설정",
                onSelect: enableTerrain,
                onDeselect: disableTerrain,
            },
            {
                id: "terrain-trans",
                type: "toggle",
                title: "지형 불투명",
                onSelect: enableTerrainTrans,
                onDeselect: disableTerrainTrans,
            },
            {
                id: "full-screen",
                type: "toggle",
                title: "전체 화면",
                onSelect: enterFullScreen,
                onDeselect: exitFullScreen,
            },
            {
                id: "zoom-in",
                type: "default",
                title: "줌인",
                onSelect: () => zoomIn(globeController),
            },
            {
                id: "zoom-out",
                type: "default",
                title: "줌아웃",
                onSelect: () => zoomOut(globeController),
            },
        ];
    }, [globeController, initialized]);
};
