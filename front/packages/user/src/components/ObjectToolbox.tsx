import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import * as Cesium from 'cesium';
import { useRecoilState } from "recoil";
import { OptionsState } from "@/recoils/Tool.ts";
import { useGlobeController } from "@/components/providers/GlobeControllerProvider.tsx";
import { useObjectTool } from "@/hooks/useObjectTool.tsx";

interface MapTool {
    toolBoxIndex: number;
    className: string;
    label: string;
    active?: boolean;
    toggle?: boolean;
    group?: string;
    onClick: () => void;
}

type ToolClicked = (tool: MapTool) => void;

const CLICK_EVENT_GROUP = "clickEvent";

const ToolButton = ({ tool, handleClick }: { tool: MapTool, handleClick: (tool: MapTool) => void }) => (
    <button
        type="button"
        className={`${tool.className} ${ (tool.active && tool.toggle) ? 'active' : ''}`}
        onClick={() => handleClick(tool)}
    >{tool.label}</button>
);

export const ObjectToolbox = () => {
    const [options] = useRecoilState(OptionsState);
    const SIDE_MENU_WIDTH = 350;

    const divRef = useRef<HTMLDivElement>(null);
    const { globeController } = useGlobeController();
    const { viewer } = globeController;

    const { toggleTranslation, toggleRotation, toggleScaling, copyObject, removeObject, objectAddFloor, objectRemoveFloor, toggleColoring, objectColoring } = useObjectTool();

    const initialTools: MapTool[] = useMemo(() => [
        { toolBoxIndex: 1, className: "translation", label: "이동", group: CLICK_EVENT_GROUP, toggle: true, onClick: toggleTranslation },
        { toolBoxIndex: 1, className: "rotation", label: "회전", group: CLICK_EVENT_GROUP, toggle: true, onClick: toggleRotation },
        { toolBoxIndex: 1, className: "scaling", label: "크기", group: CLICK_EVENT_GROUP, toggle: true, onClick: toggleScaling },
        { toolBoxIndex: 1, className: "copy", label: "복사", group: CLICK_EVENT_GROUP, toggle: true, onClick: copyObject },
        { toolBoxIndex: 1, className: "remove", label: "삭제", onClick: removeObject },
        { toolBoxIndex: 1, className: "add-floor", label: "층+", onClick: objectAddFloor },
        { toolBoxIndex: 1, className: "remove-floor", label: "층-", onClick: objectRemoveFloor },
        { toolBoxIndex: 1, className: "coloring", label: "색상", group: CLICK_EVENT_GROUP, toggle: true, onClick: toggleColoring },
    ], [toggleTranslation, toggleRotation, toggleScaling, copyObject, removeObject, objectAddFloor, objectRemoveFloor, toggleColoring ]);


    const [tools, setTools] = useState<MapTool[]>(initialTools);

    const isPrevTool = (tool: MapTool, clickedTool: MapTool) =>
        tool.group !== undefined && tool.className !== clickedTool.className;

    const updateToolActiveState = useCallback((clickedTool: MapTool) => {
        console.log(clickedTool.className)
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
                labelDiv.style.left = `${canvasPosition.x + SIDE_MENU_WIDTH}px`;
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
        <div ref={divRef} id="object-toolbox">
            {tools.map(tool => (
                <ToolButton key={tool.className} tool={tool} handleClick={handleToolClick} />
            ))}
            {options.isColoring && (
                <input type="color" onChange={objectColoring}/>
            )}
        </div>
    );
};
