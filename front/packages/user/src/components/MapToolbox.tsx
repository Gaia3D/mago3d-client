import { useMapTool } from "@/hooks/useMapTool";
import { ToolStatus, ToolStatusState } from "@/recoils/Tool";
import { useRecoilState } from "recoil";
import NavigationRoundedIcon from '@mui/icons-material/NavigationRounded';
import { useMemo } from "react";

export interface MapTool {
  className: string;
  label: string;
  active?: boolean;
  toggle?: boolean;
  onClick?: () => void;
}

type ToolClicked = (tool: MapTool) => void;


export const MapToolbox = ({ onToolClick }: { onToolClick: ToolClicked }) => {
  const {angle, onClickCompas, onClickHome, onClickExpand, onClickReduce, onClickArea, onClickLength, onClickSearch, onClickAngle, onClickSave, onClickPrint, onClickComplex, toggleFullscreen, resetDirection, toggleDefaultTerrain, toggleTerrainTranslucent, toggleClock, toggleSetting} = useMapTool();
  // 현재 선택된 도구 상태를 관리하는 상태
  const [selectedTool, setSelectedTool] = useRecoilState<ToolStatus>(ToolStatusState);

  // 각 도구의 클릭 핸들러 함수
  const handleToolClick = (tool: MapTool) => {
    onToolClick(tool);

    const { onClick } = tool;
    if (onClick) {
      onClick();
    }
  };

  // 툴 버튼 컴포넌트화
  const ToolButton = ({ tool, handleClick }: { tool: MapTool, handleClick: (tool: MapTool) => void }) => (
      <button
          key={tool.className}
          type="button"
          className={`${tool.className} ${(tool.toggle && selectedTool === tool.className) ? "active" : ""}`}
          onClick={() => handleClick(tool)}
      >
        <div className="toolbox-txt">
          <div className="title">{tool.label}</div>
          <div className="rect"></div>
        </div>
      </button>
  );

  // Toolbox에 표시할 도구 목록
  const tools = useMemo(() => [
    { className: "home", label: "초기화", onClick: onClickHome },
    { className: "length", label: "길이측정", active: false, toggle: true, onClick: onClickLength },
    { className: "area", label: "면적측정", active: false, toggle: true, onClick: onClickArea },
    { className: "angles", label: "각도", active: false, toggle: true, onClick: onClickAngle },
    { className: "composite", label: "복합거리", active: false, toggle: true, onClick: onClickComplex },
    { className: "save", label: "저장하기", onClick: onClickSave },
    { className: "fullscreen", label: "전체화면", active: false, toggle: true, onClick: toggleFullscreen },
    { className: "reset-direction", label: "방향초기화", onClick: resetDirection },
    { className: "set-terrain", label: "지형설정", active: false, toggle: true, onClick: toggleDefaultTerrain },
    { className: "set-terrain-trans", label: "지형불투명설정", active: false, toggle: true, onClick: toggleTerrainTranslucent },
    { className: "open-clock-tool", label: "시간도구", active: false, toggle: true, onClick: toggleClock },
    { className: "open-setting-tool", label: "설정도구", active: false, toggle: true, onClick: toggleSetting },
  ], []);

  const tools2 = useMemo(() => [
    { className: "expand", label: "확대", onClick: onClickExpand },
    { className: "reduce", label: "축소", onClick: onClickReduce },
  ], []);

  return (
      <>
        <div id="toolbox">
          <button type="button" onClick={onClickCompas} style={{backgroundColor: 'rgba(0,0,0,0.8)'}}>
            <NavigationRoundedIcon style={{color: '#FCFCFD', transform: `rotate(${angle}deg)`}}/>
          </button>
          {tools.map(tool => <ToolButton key={tool.className} tool={tool} handleClick={handleToolClick}/>)}
        </div>
        <div id="toolbox-view">
          {tools2.map(tool => <ToolButton key={tool.className} tool={tool} handleClick={handleToolClick}/>)}
        </div>
      </>
  );
};

// export type { Tool };
