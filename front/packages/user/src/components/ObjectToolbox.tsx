import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import * as Cesium from 'cesium';
import { useRecoilState } from "recoil";
import { OptionsState } from "@/recoils/Tool.ts";
import { useGlobeController } from "@/components/providers/GlobeControllerProvider.tsx";
import { useObjectTool } from "@/hooks/useObjectTool.tsx";
import {useTranslation} from "react-i18next";

interface MapTool {
    toolBoxIndex: number;
    className: string;
    active?: boolean;
    toggle?: boolean;
    group?: string;
    onClick: () => void;
}

interface ToolButtonProps {
    tool: MapTool;
    handleClick: (tool: MapTool) => void;
    isExpand?: boolean; // 선택적으로 isExpand를 받을 수 있게 합니다.
}

type ToolClicked = (tool: MapTool) => void;

const CLICK_EVENT_GROUP = "clickEvent";

const ToolButton = ({ tool, handleClick }: ToolButtonProps) => {
    const { t } = useTranslation();
    return (
        <button
            type={"button"}
            className={`${tool.className} ${tool.active && tool.toggle ? 'selected' : ''}`}
            onClick={() => handleClick(tool)}
        >
            <div className={`popuplayer-description--content ${tool.className}`}>
                <div className={"title"}>
                    {t(`tool.${tool.className}`)}
                </div>
            </div>
        </button>
    )};


export const ObjectToolbox = () => {
    const [options] = useRecoilState(OptionsState);

    const divRef = useRef<HTMLDivElement>(null);
    const { globeController } = useGlobeController();
    const { viewer } = globeController;

    const { toggleTranslation, toggleRotation, toggleScaling, copyObject, removeObject, objectAddFloor, objectRemoveFloor, toggleColoring, objectColoring } = useObjectTool();

    const initialTools: MapTool[] = useMemo(() => [
        { toolBoxIndex: 1, className: "translation", group: CLICK_EVENT_GROUP, toggle: true, onClick: toggleTranslation },
        { toolBoxIndex: 1, className: "rotation", group: CLICK_EVENT_GROUP, toggle: true, onClick: toggleRotation },
        { toolBoxIndex: 1, className: "scaling", group: CLICK_EVENT_GROUP, toggle: true, onClick: toggleScaling },
        { toolBoxIndex: 1, className: "copy", onClick: copyObject },
        { toolBoxIndex: 1, className: "remove", onClick: removeObject },
        { toolBoxIndex: 1, className: "add-floor", onClick: objectAddFloor },
        { toolBoxIndex: 1, className: "remove-floor", onClick: objectRemoveFloor },
        { toolBoxIndex: 1, className: "coloring", group: CLICK_EVENT_GROUP, toggle: true, onClick: toggleColoring },
    ], [toggleTranslation, toggleRotation, toggleScaling, copyObject, removeObject, objectAddFloor, objectRemoveFloor, toggleColoring ]);


    const [tools, setTools] = useState<MapTool[]>(initialTools);

    const isPrevTool = (tool: MapTool, clickedTool: MapTool) =>
        tool.group !== undefined && tool.className !== clickedTool.className;

    const updateToolActiveState = useCallback((clickedTool: MapTool) => {
        setTools(prevState =>
            prevState.map(tool =>
                isPrevTool(tool, clickedTool)
                    ? { ...tool, active: false }
                    : tool.className === clickedTool.className
                        ? { ...tool, active: !tool.active }
                        : tool
            )
        );
    }, []);

    const deactivatePreviousActiveTool = useCallback((clickedTool: MapTool) => {
        setTools(prevState =>
            prevState.map(tool => {
                if (isPrevTool(tool, clickedTool) && tool.active) {
                    tool.onClick?.();  // 이전 활성화된 도구의 onClick 호출
                }
                return tool;
            })
        );
    }, []);

    const handleToolClick = useCallback((clickedTool: MapTool) => {
        deactivatePreviousActiveTool(clickedTool);
        updateToolActiveState(clickedTool);
        clickedTool.onClick();
    }, [ updateToolActiveState, deactivatePreviousActiveTool]);


    useEffect(() => {
        const labelDiv = divRef.current;
        if (!labelDiv || !viewer) return;

        // 위치 업데이트 함수
        function updateDivPosition() {
            if (!options.pickedObject || !options.pickedObject.position) return;

            const canvasPosition = viewer?.scene.cartesianToCanvasCoordinates(options.pickedObject.position);
            if (Cesium.defined(canvasPosition) && labelDiv) {
                labelDiv.style.left = `${canvasPosition.x}px`;
                labelDiv.style.top = `${canvasPosition.y}px`;
            }
        }

        // 위치 업데이트 및 화면 리사이즈 시에도 위치 갱신
        viewer.scene.postRender.addEventListener(updateDivPosition);
        window.addEventListener('resize', updateDivPosition);

        // Cleanup function
        return () => {
            viewer.scene.postRender.removeEventListener(updateDivPosition);
            window.removeEventListener('resize', updateDivPosition);
        };
    }, [viewer, options.pickedObject?.position]);

    return options.isOpenObjectTool && (
        <div ref={divRef} id="object-toolbox" className={"toolbox-pop-layer object"}>
            {tools.map(tool => (
                <ToolButton key={tool.className} tool={tool} handleClick={handleToolClick} />
            ))}
            {options.isColoring && (
                <input type="color" onChange={objectColoring}/>
            )}
        </div>
    );
};
