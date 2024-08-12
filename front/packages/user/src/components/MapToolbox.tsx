import { useMapTool } from "@/hooks/useMapTool";
import { useState, useMemo, useCallback } from "react";
import NavigationRoundedIcon from '@mui/icons-material/NavigationRounded';
import { useViewTool } from "@/hooks/useViewTool.tsx";
import {useObjectTool} from "@/hooks/useObjectTool.tsx";
import {useTranslation} from "react-i18next";

interface ToolButtonProps {
    tool: MapTool;
    handleClick: (tool: MapTool) => void;
    isExpand?: boolean; // 선택적으로 isExpand를 받을 수 있게 합니다.
}


export interface MapTool {
    toolBoxIndex: number;
    className: string;
    active?: boolean;
    toggle?: boolean;
    group?: string;
    onClick: () => void;
}

type ToolClicked = (tool: MapTool) => void;

const TOOLBOX_SEP = "sep";
const CLICK_EVENT_GROUP = "clickEvent";

const ToolButton = ({ tool, handleClick, isExpand = false }: ToolButtonProps) => {
    const { t } = useTranslation();
    return (
    <button
        type={"button"}
        className={`${tool.className} ${tool.active && tool.toggle ? 'selected' : ''}`}
        onClick={() => handleClick(tool)}
    >
        <div className={`${isExpand ? 'popuplayer' : 'toolbox' }-description--content ${tool.className}`}>
            <div className={"title"}>
                {t(`tool.${tool.className}`)}
            </div>
        </div>
    </button>
)};

const ExpandableToolBox = ({ tools, toolBoxIndex, handleClick, expanded, toggleExpand, eleId }: { tools: MapTool[], toolBoxIndex: number, handleClick: (tool: MapTool) => void, expanded: boolean, toggleExpand: (eleId: string) => void, eleId: string }) => {
    const { t } = useTranslation();
    return (
        <>
            <button className={`${eleId} ${expanded ? 'selected' : ''}`}
                    onClick={() => toggleExpand(eleId)}>
                <div className={"toolbox-description--content"}>
                    <div className={"title"}>
                        {t(`tool.${eleId}`)}
                    </div>
                </div>
            </button>
            <div className={`toolbox-pop-layer ${eleId} ${expanded ? 'expand' : ''}`}>
                {tools.filter(tool => tool.toolBoxIndex === toolBoxIndex).map(tool => (
                    <ToolButton key={tool.className} tool={tool} handleClick={handleClick} isExpand={true} />
                ))}
            </div>
        </>
    )};

export const MapToolbox = ({onToolClick}: { onToolClick: ToolClicked }) => {
    const {
        onClickHome, onClickExpand, onClickReduce, onClickArea,
        onClickLength, onClickAngle, onClickSave, onClickComplex, toggleCoordinate, toggleMeasureRadius,
        toggleFullscreen, resetDirection, toggleDefaultTerrain, toggleTerrainTranslucent,
        toggleClock, toggleSetting, toggleTheme
    } = useMapTool();
    const {
        toggleFirstPersonView, toggleViewCenter, toggleViewPoint,
        toggleViewAxis, toggleCameraTool, toggleBoundingVolume
    } = useViewTool();

    const { toggleSelector } = useObjectTool();

    const initialTools: MapTool[] = useMemo(() => [
        { toolBoxIndex: 0, className: "home", group: TOOLBOX_SEP, onClick: onClickHome },
        { toolBoxIndex: 0, className: "save", group: TOOLBOX_SEP, onClick: onClickSave },
        { toolBoxIndex: 0, className: "reset-direction", group: TOOLBOX_SEP, onClick: resetDirection },
        { toolBoxIndex: 0, className: "set-terrain-trans", group: TOOLBOX_SEP, toggle: true, onClick: toggleTerrainTranslucent },
        { toolBoxIndex: 0, className: "open-clock-tool", group: TOOLBOX_SEP, toggle: true, onClick: toggleClock },
        { toolBoxIndex: 0, className: "open-setting-tool", group: TOOLBOX_SEP, toggle: true, onClick: toggleSetting },
        { toolBoxIndex: 1, className: "first-person-view", group: TOOLBOX_SEP, toggle: true, onClick: toggleFirstPersonView },
        { toolBoxIndex: 1, className: "indoor", group: CLICK_EVENT_GROUP, toggle: true, onClick: toggleViewCenter },
        { toolBoxIndex: 1, className: "go-to-point", group: CLICK_EVENT_GROUP, toggle: true, onClick: toggleViewPoint },
        { toolBoxIndex: 1, className: "view-axis", group: CLICK_EVENT_GROUP, toggle: true, onClick: toggleViewAxis },
        { toolBoxIndex: 1, className: "camera-info", group: TOOLBOX_SEP, toggle: true, onClick: toggleCameraTool },
        // { toolBoxIndex: 1, className: "bounding-volume", group: TOOLBOX_SEP, onClick: toggleBoundingVolume },
        { toolBoxIndex: 2, className: "point", group: CLICK_EVENT_GROUP, toggle: true, onClick: toggleCoordinate },
        { toolBoxIndex: 2, className: "length", group: CLICK_EVENT_GROUP, toggle: true, onClick: onClickLength },
        { toolBoxIndex: 2, className: "area", group: CLICK_EVENT_GROUP, toggle: true, onClick: onClickArea },
        { toolBoxIndex: 2, className: "angle", group: CLICK_EVENT_GROUP, toggle: true, onClick: onClickAngle },
        { toolBoxIndex: 2, className: "composite", group: CLICK_EVENT_GROUP, toggle: true, onClick: onClickComplex },
        { toolBoxIndex: 2, className: "radius", group: CLICK_EVENT_GROUP, toggle: true, onClick: toggleMeasureRadius },
        { toolBoxIndex: 3, className: "object", group: CLICK_EVENT_GROUP, toggle: true, onClick: toggleSelector },
        { toolBoxIndex: 4, className: "full-screen", group: TOOLBOX_SEP, toggle: true, onClick: toggleFullscreen },
        { toolBoxIndex: 4, className: "terrain", group: TOOLBOX_SEP, toggle: true, onClick: toggleDefaultTerrain },
        { toolBoxIndex: 4, className: "theme", group: TOOLBOX_SEP, toggle: true, onClick: toggleTheme },
        { toolBoxIndex: 5, className: "zoom-in", group: TOOLBOX_SEP, onClick: onClickExpand },
        { toolBoxIndex: 5, className: "zoom-out", group: TOOLBOX_SEP, onClick: onClickReduce },
    ], [onClickHome, onClickLength, onClickArea, onClickAngle, onClickComplex, onClickSave, onClickExpand, onClickReduce, toggleFullscreen, resetDirection, toggleDefaultTerrain, toggleTerrainTranslucent, toggleClock, toggleSetting, toggleFirstPersonView, toggleViewCenter, toggleViewPoint, toggleViewAxis, toggleCameraTool, toggleBoundingVolume]);

    const [tools, setTools] = useState<MapTool[]>(initialTools);
    const [expandedTools, setExpandedTools] = useState<{ [key: string]: boolean }>({
        "visible": false,
        "ruler": false
    });

    const isSameGroupAndNotSelfAndNotSep = (tool: MapTool, clickedTool: MapTool) =>
        tool.group === clickedTool.group && tool.className !== clickedTool.className && clickedTool.group !== TOOLBOX_SEP;

    const updateToolActiveState = useCallback((clickedTool: MapTool) => {
        setTools(prevState =>
            prevState.map(tool =>
                isSameGroupAndNotSelfAndNotSep(tool, clickedTool)
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
                if (isSameGroupAndNotSelfAndNotSep(tool, clickedTool) && tool.active) {
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
        onToolClick(clickedTool);
    }, [onToolClick, updateToolActiveState, deactivatePreviousActiveTool]);

    const toggleExpand = useCallback((eleId: string) => {
        setExpandedTools(prevState => ({
            ...prevState,
            [eleId]: !prevState[eleId]
        }));
    }, []);

    return (
        <>
            <div className={"toolbox control"}>
                <ExpandableToolBox tools={tools} toolBoxIndex={1} handleClick={handleToolClick} expanded={expandedTools["visible"]} toggleExpand={toggleExpand} eleId="visible" />
                <ExpandableToolBox tools={tools} toolBoxIndex={2} handleClick={handleToolClick} expanded={expandedTools["ruler"]} toggleExpand={toggleExpand} eleId="ruler" />
                {tools.filter(tool => tool.toolBoxIndex === 3).map(tool => (
                    <ToolButton key={tool.className} tool={tool} handleClick={handleToolClick} />
                ))}
            </div>
            <div className={"toolbox setup"}>
                {tools.filter(tool => tool.toolBoxIndex === 4).map(tool => (
                    <ToolButton key={tool.className} tool={tool} handleClick={handleToolClick} />
                ))}
            </div>
            <div className={"toolbox zoom"}>
                {tools.filter(tool => tool.toolBoxIndex === 5).map(tool => (
                    <ToolButton key={tool.className} tool={tool} handleClick={handleToolClick} />
                ))}
            </div>
        </>
    );
};
