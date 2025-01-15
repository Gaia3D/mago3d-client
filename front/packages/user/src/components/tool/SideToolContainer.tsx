import React, { useState } from "react";
import ToolButton from "@/components/tool/ToolButton";
import { useGlobeController } from "@/components/providers/GlobeControllerProvider";
import { createToolActions, TOOL_IDS } from "@/components/tool/actions";

const EXCLUSIVE_BUTTONS = ["set-person-view", "set-indoor-view", "set-location-view"];

const SideToolContainer: React.FC = () => {
    const { globeController } = useGlobeController();
    const [selectedTools, setSelectedTools] = useState<string[]>([]);
    const [exclusiveSelected, setExclusiveSelected] = useState<string | null>(null);

    const TOOL_ACTIONS = createToolActions(globeController);

    const handleToolClick = (toolId: string) => {
        const action = TOOL_ACTIONS[toolId];
        if (!action) return;

        if (EXCLUSIVE_BUTTONS.includes(toolId)) {
            setExclusiveSelected((prev) => {
                if (prev === toolId) {
                    action(); // OFF 동작
                    return null;
                } else {
                    if (prev) TOOL_ACTIONS[prev]?.(); // 이전 버튼 OFF
                    action(); // 새 버튼 ON
                    return toolId;
                }
            });
        } else {
            setSelectedTools((prev) => {
                const isSelected = prev.includes(toolId);
                action(); // 동작 실행
                return isSelected ? prev.filter((id) => id !== toolId) : [...prev, toolId];
            });
        }
    };

    return (
        <div className="side-tool-container">
            {TOOL_IDS.map((toolId) => (
                <ToolButton
                    key={toolId}
                    toolId={toolId}
                    selected={
                        EXCLUSIVE_BUTTONS.includes(toolId)
                            ? exclusiveSelected === toolId
                            : selectedTools.includes(toolId)
                    }
                    onClick={handleToolClick}
                />
            ))}
        </div>
    );
};

export default SideToolContainer;
