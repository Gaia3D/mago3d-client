import React, {useMemo, useState} from "react";
import { zoomIn } from "@/components/tool/actions/zoomIn";
import { zoomOut } from "@/components/tool/actions/zoomOut";
import { useGlobeController } from "@/components/providers/GlobeControllerProvider";
import MeasureLocation from "@/components/tool/actions/MeasureLocation.tsx";
import { enterFullScreen } from "@/components/tool/actions/fullScreen.ts";
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
import Watercourse from "@/components/tool/actions/Watercourse.tsx";
import Legend from "@/components/Legend.tsx";

export interface ToolConfig {
    id: string;
    type: "default" | "toggle" | "exclusive";
    title: string;
    group?: string;
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
                id: "view-point",
                title: "카메라 고정",
                type: "exclusive",
                group: "view",
                component: <PersonView globeController={globeController} />,
                helper: "카메라가 고정됩니다.",
            },
            {
                id: "location-view",
                type: "exclusive",
                title: "지점 이동",
                group: "view",
                component: <LocationView globeController={globeController} />,
                helper: "클릭한 위치로 이동합니다."
            },
            {
                id: "axis-view",
                type: "exclusive",
                title: "축 이동",
                group: "view",
                component: <AxisView globeController={globeController} />,
                helper: "클릭한 방향을 바라봅니다.\n첫번째 클릭: 위치 선택\n두번째 클릭: 방향 선택"
            },
            {
                id: "camera-info",
                type: "toggle",
                title: "카메라 정보",
                component: <CameraInfo globeController={globeController} />,
                helper: "카메라 정보를 표시합니다."
            },
            {
                id: "layer-info",
                type: "exclusive",
                title: "레이어 정보",
                component: <LayerInfo globeController={globeController} />,
                helper: "클릭한 위치의 레이어 정보를 표시합니다."
            },
            {
                id: "measure-location",
                type: "exclusive",
                title: "위치 측정",
                group: "measure",
                component: <MeasureLocation globeController={globeController} />,
                helper: "클릭한 위치의 위도, 경도, 고도 값을 표시합니다."
            },
            {
                id: "measure-length",
                type: "exclusive",
                title: "길이 측정",
                group: "measure",
                component: <MeasureLength globeController={globeController} />,
                helper: "길이를 측정합니다.\n클릭: 길이 측정 지점 선택\nESC: 초기화"
            },
            {
                id: "measure-area",
                type: "exclusive",
                title: "면적 측정",
                group: "measure",
                component: <MeasureArea globeController={globeController}/>,
                helper: "면적을 측정합니다.\n클릭: 면적 측정 지점 선택\nESC: 초기화"
            },
            {
                id: "measure-angle",
                type: "exclusive",
                title: "각도 측정",
                group: "measure",
                component: <MeasureAngle globeController={globeController} />,
                helper: "각도를 측정합니다.\n클릭: 각도 측정 지점 선택\nESC: 초기화"
            },
            {
                id: "measure-radius",
                type: "exclusive",
                title: "반지름 측정",
                group: "measure",
                component: <MeasureRadius globeController={globeController} />,
                helper: "반지름을 측정하고 구 범위를 표시합니다.\n클릭: 반지름 측정 지점 선택\nESC: 초기화"
            },
            {
                id: "terrain-delete",
                type: "toggle",
                title: "지형 제거",
                group: "terrain",
                onSelect: disableTerrain,
                onDeselect: enableTerrain,
                helper: "지형을 제거합니다."
            },
            {
                id: "terrain-trans",
                type: "toggle",
                title: "지형 불투명",
                group: "terrain",
                onSelect: enableTerrainTrans,
                onDeselect: disableTerrainTrans,
                helper: "지형을 불투명하게 설정합니다."
            },{
                id: "water",
                title: "물줄기 표시",
                type: "toggle",
                group: "terrain",
                component: <Watercourse />,
                helper: "물줄기가 표시됩니다.",
            },
            {
                id: "legend",
                type: "toggle",
                title: "범례",
                component: <Legend />,
                helper: "범례를 표시합니다."
            },
            {
                id: "full-screen",
                type: "default",
                title: "전체 화면",
                onSelect: enterFullScreen,
                helper: "전체화면을 표시합니다."
            },
            {
                id: "zoom-in",
                type: "default",
                title: "줌인",
                onSelect: () => zoomIn(globeController),
                helper: "줌 인 합니다."
            },
            {
                id: "zoom-out",
                type: "default",
                title: "줌아웃",
                onSelect: () => zoomOut(globeController),
                helper: "줌 아웃 합니다."
            },
        ];
    }, [globeController, initialized]);
};
