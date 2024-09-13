import { useMapTool } from "@/hooks/useMapTool";
import {useState, useMemo, useCallback, useEffect} from "react";
import NavigationRoundedIcon from '@mui/icons-material/NavigationRounded';
import { useViewTool } from "@/hooks/useViewTool.tsx";
import {useObjectTool} from "@/hooks/useObjectTool.tsx";
import {useTranslation} from "react-i18next";
import {Compass} from "@/components/maptool/Compass.tsx";
import {useRecoilState, useRecoilValue} from "recoil";
import {CurrentCreatePropIdState} from "@/recoils/Tool.ts";
import {TerrainUrlState} from "@/recoils/Terrain.ts";

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
        toggleTheme, onClockTool
    } = useMapTool();
    const {
        toggleFirstPersonView, toggleViewCenter, toggleViewPoint,
        toggleViewAxis, toggleCameraTool, toggleBoundingVolume
    } = useViewTool();

    const { toggleSelector } = useObjectTool();
    const terrainUrl = useRecoilValue<string>(TerrainUrlState);
    const initialTools: MapTool[] = useMemo(() => [
        { toolBoxIndex: 0, className: "global-click-event-control", group: CLICK_EVENT_GROUP, onClick: ()=>{console.log()} },
        { toolBoxIndex: 0, className: "home", group: TOOLBOX_SEP, onClick: onClickHome },
        { toolBoxIndex: 0, className: "save", group: TOOLBOX_SEP, onClick: onClickSave },
        { toolBoxIndex: 0, className: "set-terrain-trans", group: TOOLBOX_SEP, toggle: true, onClick: toggleTerrainTranslucent },
        { toolBoxIndex: 1, className: "first-person-view", group: TOOLBOX_SEP, toggle: true, onClick: toggleFirstPersonView },
        { toolBoxIndex: 1, className: "indoor", group: CLICK_EVENT_GROUP, toggle: true, onClick: toggleViewCenter },
        { toolBoxIndex: 1, className: "go-to-point", group: CLICK_EVENT_GROUP, toggle: true, onClick: toggleViewPoint },
        { toolBoxIndex: 1, className: "view-axis", group: CLICK_EVENT_GROUP, toggle: true, onClick: toggleViewAxis },
        { toolBoxIndex: 1, className: "camera-info", group: TOOLBOX_SEP, toggle: true, onClick: toggleCameraTool },
        { toolBoxIndex: 2, className: "point", group: CLICK_EVENT_GROUP, toggle: true, onClick: toggleCoordinate },
        { toolBoxIndex: 2, className: "length", group: CLICK_EVENT_GROUP, toggle: true, onClick: onClickLength },
        { toolBoxIndex: 2, className: "area", group: CLICK_EVENT_GROUP, toggle: true, onClick: onClickArea },
        { toolBoxIndex: 2, className: "angle", group: CLICK_EVENT_GROUP, toggle: true, onClick: onClickAngle },
        { toolBoxIndex: 2, className: "composite", group: CLICK_EVENT_GROUP, toggle: true, onClick: onClickComplex },
        { toolBoxIndex: 2, className: "radius", group: CLICK_EVENT_GROUP, toggle: true, onClick: toggleMeasureRadius },
        { toolBoxIndex: 3, className: "object", group: CLICK_EVENT_GROUP, toggle: true, onClick: toggleSelector },
        { toolBoxIndex: 4, className: "full-screen", group: TOOLBOX_SEP, toggle: true, onClick: toggleFullscreen },
        { toolBoxIndex: 4, className: "terrain", group: TOOLBOX_SEP, active: terrainUrl!=='',  toggle: true, onClick: toggleDefaultTerrain },
        // { toolBoxIndex: 4, className: "theme", group: TOOLBOX_SEP, toggle: true, onClick: toggleTheme },
        { toolBoxIndex: 4, className: "shadow", group: TOOLBOX_SEP, toggle: true, onClick: onClockTool },
        { toolBoxIndex: 5, className: "zoom-in", group: TOOLBOX_SEP, onClick: onClickExpand },
        { toolBoxIndex: 5, className: "zoom-out", group: TOOLBOX_SEP, onClick: onClickReduce },
    ], [onClickHome, onClickLength, onClickArea, onClickAngle, onClickComplex, onClickSave, onClickExpand, onClickReduce, toggleFullscreen, resetDirection, toggleDefaultTerrain, toggleTerrainTranslucent, toggleFirstPersonView, toggleViewCenter, toggleViewPoint, toggleViewAxis, toggleCameraTool, toggleBoundingVolume]);

    const [tools, setTools] = useState<MapTool[]>(initialTools);
    const [expandedTools, setExpandedTools] = useState<{ [key: string]: boolean }>({
        "visible": false,
        "ruler": false
    });
    const [currentCreatePropId, setCurrentCreatePropId] = useRecoilState(CurrentCreatePropIdState);

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
        if (clickedTool.group === CLICK_EVENT_GROUP) setCurrentCreatePropId('')
    }, [setCurrentCreatePropId]);

    useEffect(() => {
        if (currentCreatePropId !== '') {
            setTools(prevState =>
                prevState.map(tool => {
                    if (isSameGroupAndNotSelfAndNotSep(tool, initialTools[0]) && tool.active) {
                        tool.onClick?.();  // 이전 활성화된 도구의 onClick 호출
                    }
                    return {...tool, active: false};
                })
            );
        }
    }, [currentCreatePropId]);

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
            <Compass handleClick={resetDirection} />
        </>
    );
};
