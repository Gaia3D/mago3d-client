import React, { useState, useEffect } from "react";
import {ToolConfig, useToolConfig} from "@/components/utils/toolConfig.tsx";
import ToolHelper from "@/components/tool/ToolHelper.tsx";
import ResetDirection from "@/components/tool/actions/ResetDirection.tsx";

const SideToolContainer: React.FC = () => {
    const TOOLS = useToolConfig();
    const [selectedTools, setSelectedTools] = useState<Record<string, boolean>>({});
    const [exclusiveSelected, setExclusiveSelected] = useState<string | null>(null);

    useEffect(() => {
        const initialStates = TOOLS.reduce((acc, button) => {
            acc[button.id] = false;
            return acc;
        }, {} as Record<string, boolean>);
        setSelectedTools(initialStates);
    }, [TOOLS]);

    const handleClick = (button: ToolConfig) => {
        const { id, type, onSelect, onDeselect } = button;

        if (type === "default") {
            onSelect?.();
            return;
        }

        if (type === "toggle") {
            setSelectedTools((prev) => {
                const newState = !prev[id];
                if (newState) {
                    onSelect?.();
                } else {
                    onDeselect?.();
                }
                return { ...prev, [id]: newState };
            });
        }

        if (type === "exclusive") {
            setSelectedTools((prev) => {
                const newState = { ...prev };

                // 현재 선택된 exclusive 버튼 해제
                if (exclusiveSelected && exclusiveSelected !== id) {
                    newState[exclusiveSelected] = false;
                    const previousTool = TOOLS.find((b) => b.id === exclusiveSelected);
                    previousTool?.onDeselect?.();
                }

                // 새로운 exclusive 버튼 선택
                if (prev[id]) {
                    onDeselect?.(); // 선택된 상태 해제
                    setExclusiveSelected(null);
                } else {
                    onSelect?.(); // 새로운 상태 선택
                    setExclusiveSelected(id);
                }

                newState[id] = !prev[id];
                return newState;
            });
        }
    };

    return (
        <div className="side-tool-container">
            {TOOLS.map((config) => {
                const isSelected = selectedTools[config.id];

                return (
                    <div
                        className={`tool-container ${isSelected ? "selected" : ""}`}
                        key={config.id}
                    >
                        <button
                            className={`tool-button icon ${config.id}`}
                            onClick={() => handleClick(config)}
                            title={config.title}
                        />
                        {isSelected && config.component}
                    </div>
                );
            })}

            <div className="tool-helper-container">
                {TOOLS.filter((config) => selectedTools[config.id] && config.helper)
                    .map((config) => (
                        <ToolHelper key={config.id} helper={config.helper}/>
                    ))}
            </div>

            <ResetDirection/>
        </div>


    );
};

export default SideToolContainer;
