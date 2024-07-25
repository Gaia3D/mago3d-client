import { useMapTool } from "@/hooks/useMapTool";
import { useState, useMemo, useCallback } from "react";
import NavigationRoundedIcon from '@mui/icons-material/NavigationRounded';
import { useViewTool } from "@/hooks/useViewTool.tsx";

export interface MapTool {
    toolBoxIndex: number;
    className: string;
    label: string;
    active?: boolean;
    toggle?: boolean;
    group?: string;
    onClick: () => void;
}

type ToolClicked = (tool: MapTool) => void;

const TOOLBOX_SEP = "sep";
const CLICK_EVENT_GROUP = "clickEvent";

const ToolButton = ({ tool, handleClick }: { tool: MapTool, handleClick: (tool: MapTool) => void }) => (
    <button
        key={tool.className}
        type="button"
        className={`${tool.className} ${tool.active ? 'active' : ''}`}
        onClick={() => handleClick(tool)}
    >
        <div className="toolbox-txt">
            <div className="title">{tool.label}</div>
            <div className="rect"></div>
        </div>
    </button>
);

export const MapToolbox = ({ onToolClick }: { onToolClick: ToolClicked }) => {
    const {
        angle, onClickCompas, onClickHome, onClickExpand, onClickReduce, onClickArea,
        onClickLength, onClickAngle, onClickSave, onClickPrint, onClickComplex,
        toggleFullscreen, resetDirection, toggleDefaultTerrain, toggleTerrainTranslucent,
        toggleClock, toggleSetting
    } = useMapTool();
    const {
        toggleFirstPersonView, toggleViewCenter, toggleViewPoint,
        toggleViewAxis, toggleCameraTool
    } = useViewTool();

    const initialTools: MapTool[] = useMemo(() => [
        { toolBoxIndex: 1, className: "home", label: "초기화", group: TOOLBOX_SEP, onClick: onClickHome },
        { toolBoxIndex: 1, className: "length", label: "길이측정", group: CLICK_EVENT_GROUP, toggle: true, onClick: onClickLength },
        { toolBoxIndex: 1, className: "area", label: "면적측정", group: CLICK_EVENT_GROUP, toggle: true, onClick: onClickArea },
        { toolBoxIndex: 1, className: "angles", label: "각도", group: CLICK_EVENT_GROUP, toggle: true, onClick: onClickAngle },
        { toolBoxIndex: 1, className: "composite", label: "복합거리", group: CLICK_EVENT_GROUP, toggle: true, onClick: onClickComplex },
        { toolBoxIndex: 1, className: "save", label: "저장하기", group: TOOLBOX_SEP, onClick: onClickSave },
        { toolBoxIndex: 2, className: "expand", label: "확대", group: TOOLBOX_SEP, onClick: onClickExpand },
        { toolBoxIndex: 2, className: "reduce", label: "축소", group: TOOLBOX_SEP, onClick: onClickReduce },
        { toolBoxIndex: 3, className: "fullscreen", label: "전체화면", group: TOOLBOX_SEP, toggle: true, onClick: toggleFullscreen },
        { toolBoxIndex: 3, className: "reset-direction", label: "방향초기화", group: TOOLBOX_SEP, onClick: resetDirection },
        { toolBoxIndex: 3, className: "set-terrain", label: "지형설정", group: TOOLBOX_SEP, toggle: true, onClick: toggleDefaultTerrain },
        { toolBoxIndex: 3, className: "set-terrain-trans", label: "지형불투명설정", group: TOOLBOX_SEP, toggle: true, onClick: toggleTerrainTranslucent },
        { toolBoxIndex: 3, className: "open-clock-tool", label: "시간도구", group: TOOLBOX_SEP, toggle: true, onClick: toggleClock },
        { toolBoxIndex: 3, className: "open-setting-tool", label: "설정도구", group: TOOLBOX_SEP, toggle: true, onClick: toggleSetting },
        { toolBoxIndex: 4, className: "first-person-view", label: "사람시점", group: TOOLBOX_SEP, onClick: toggleFirstPersonView },
        { toolBoxIndex: 4, className: "indoors", label: "실내시점", group: CLICK_EVENT_GROUP, onClick: toggleViewCenter },
        { toolBoxIndex: 4, className: "go-to-point", label: "시점이동", group: CLICK_EVENT_GROUP, onClick: toggleViewPoint },
        { toolBoxIndex: 4, className: "axis-view", label: "축시점", group: CLICK_EVENT_GROUP, onClick: toggleViewAxis },
        { toolBoxIndex: 4, className: "camera-info", label: "카메라정보", group: TOOLBOX_SEP, onClick: toggleCameraTool },
    ], [onClickHome, onClickLength, onClickArea, onClickAngle, onClickComplex, onClickSave, onClickExpand, onClickReduce, toggleFullscreen, resetDirection, toggleDefaultTerrain, toggleTerrainTranslucent, toggleClock, toggleSetting, toggleFirstPersonView, toggleViewCenter, toggleViewPoint, toggleViewAxis, toggleCameraTool]);

    const [tools, setTools] = useState<MapTool[]>(initialTools);
    const [expandedTools, setExpandedTools] = useState<{ [key: string]: boolean }>({
        "toolbox-cesium-map-tool": false,
        "toolbox-view-tool": false
    });

    const handleToolClick = useCallback((clickedTool: MapTool) => {
        setTools(prevState =>
            prevState.map(tool => {
                if (tool.group === clickedTool.group && tool.className !== clickedTool.className && tool.active && clickedTool.group !== TOOLBOX_SEP) {
                    tool.onClick?.();  // 이전 활성화된 도구의 onClick 호출
                }
                return tool.group === clickedTool.group && tool.className !== clickedTool.className && clickedTool.group !== TOOLBOX_SEP
                    ? { ...tool, active: false }
                    : tool.className === clickedTool.className
                        ? { ...tool, active: !tool.active }
                        : tool;
            })
        );

        clickedTool.onClick();
        onToolClick(clickedTool);
    }, [onToolClick]);

    const toggleExpand = useCallback((eleId: string) => {
        setExpandedTools(prevState => ({
            ...prevState,
            [eleId]: !prevState[eleId]
        }));
    }, []);

    return (
        <>
            <div id="toolbox">
                <button type="button" onClick={onClickCompas} style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
                    <NavigationRoundedIcon style={{ color: '#FCFCFD', transform: `rotate(${angle}deg)` }} />
                </button>
                {tools.filter(tool => tool.toolBoxIndex === 1).map(tool => (
                    <ToolButton key={tool.className} tool={tool} handleClick={handleToolClick} />
                ))}
            </div>
            <div id="toolbox-view">
                {tools.filter(tool => tool.toolBoxIndex === 2).map(tool => (
                    <ToolButton key={tool.className} tool={tool} handleClick={handleToolClick} />
                ))}
            </div>
            <div id="cesium-map-tool-expand-button" className='expand-button' onClick={() => toggleExpand("toolbox-cesium-map-tool")}></div>
            <div id="toolbox-cesium-map-tool" className={`expand-tool-box ${expandedTools["toolbox-cesium-map-tool"] ? 'expand' : ''}`}>
                {tools.filter(tool => tool.toolBoxIndex === 3).map(tool => (
                    <ToolButton key={tool.className} tool={tool} handleClick={handleToolClick} />
                ))}
            </div>
            <div id="view-tool-expand-button" className='expand-button' onClick={() => toggleExpand("toolbox-view-tool")}></div>
            <div id="toolbox-view-tool" className={`expand-tool-box ${expandedTools["toolbox-view-tool"] ? 'expand' : ''}`}>
                {tools.filter(tool => tool.toolBoxIndex === 4).map(tool => (
                    <ToolButton key={tool.className} tool={tool} handleClick={handleToolClick} />
                ))}
            </div>
        </>
    );
};
