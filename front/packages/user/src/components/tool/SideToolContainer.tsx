import React, { useState } from "react";
import ToolButton from "@/components/tool/ToolButton";
import { useGlobeController } from "@/components/providers/GlobeControllerProvider";
import { createToolActions, removeToolActions, TOOL_IDS } from "@/components/tool/actions";

interface ButtonSetting {
    id: string;
    toggleYn: boolean;
    groupYn: boolean;
    groupId?: string;
}

const SIDE_BUTTONS: ButtonSetting[] = [
    { id: "set-person-view", toggleYn: true, groupYn: true, groupId: "mouse-left-click" },
    { id: "set-indoor-view", toggleYn: true, groupYn: true, groupId: "mouse-left-click" },
    { id: "set-location-view", toggleYn: true, groupYn: true, groupId: "mouse-left-click" },
    { id: "set-axis-view", toggleYn: true, groupYn: true, groupId: "mouse-left-click" },
    { id: "show-camera-info", toggleYn: true, groupYn: false },
    { id: "measure-location", toggleYn: true, groupYn: true, groupId: "mouse-left-click" },
    { id: "measure-length", toggleYn: true, groupYn: true, groupId: "mouse-left-click" },
    { id: "measure-area", toggleYn: true, groupYn: true, groupId: "mouse-left-click" },
    { id: "measure-angle", toggleYn: true, groupYn: true, groupId: "mouse-left-click" },
    { id: "measure-complex-distance", toggleYn: true, groupYn: true, groupId: "mouse-left-click" },
    { id: "measure-radius", toggleYn: true, groupYn: true, groupId: "mouse-left-click" },
    { id: "select-object", toggleYn: true, groupYn: true, groupId: "mouse-left-click" },
    { id: "show-temperature", toggleYn: true, groupYn: false },
    { id: "show-wind", toggleYn: true, groupYn: false },
    { id: "configure-terrain", toggleYn: true, groupYn: false },
    { id: "set-terrain-transparency", toggleYn: true, groupYn: false },
    { id: "toggle-full-screen", toggleYn: false, groupYn: false },
    { id: "configure-time", toggleYn: true, groupYn: false },
    { id: "zoom-in", toggleYn: false, groupYn: false },
    { id: "zoom-out", toggleYn: false, groupYn: false },
];

const SideToolContainer: React.FC = () => {
    const { globeController } = useGlobeController();
    const [activeTools, setActiveTools] = useState<Record<string, boolean>>({});
    const TOOL_ACTIONS = createToolActions(globeController);
    const TOOL_REMOVE_ACTIONS = removeToolActions(globeController);

    const handleToolClick = async (toolId: string) => {
        const buttonSetting = SIDE_BUTTONS.find((btn) => btn.id === toolId);
        if (!buttonSetting) return;

        const { toggleYn, groupYn, groupId } = buttonSetting;

        if (toggleYn) {
            // 항상 OFF를 먼저 수행
            await new Promise<void>((resolve) => {
                setActiveTools((prev) => {
                    const updatedTools = { ...prev };

                    // 현재 버튼 OFF
                    if (updatedTools[toolId]) {
                        TOOL_REMOVE_ACTIONS[toolId]?.(); // OFF
                        delete updatedTools[toolId];
                        return updatedTools;
                    }

                    // 같은 그룹의 다른 버튼 OFF
                    if (groupYn && groupId) {
                        Object.keys(updatedTools).forEach((id) => {
                            const groupBtn = SIDE_BUTTONS.find((btn) => btn.id === id);
                            if (groupBtn?.groupId === groupId && id !== toolId) {
                                TOOL_REMOVE_ACTIONS[id]?.(); // OFF
                                delete updatedTools[id];
                            }
                        });
                    }

                    resolve();
                    return updatedTools;
                });
            });

            // ON 수행
            setActiveTools((prev) => {
                const updatedTools = { ...prev };
                TOOL_ACTIONS[toolId]?.(); // ON
                updatedTools[toolId] = true;
                return updatedTools;
            });
        } else {
            // 항상 ON 동작
            TOOL_ACTIONS[toolId]?.();
        }
    };

    return (
        <div className="side-tool-container">
            {TOOL_IDS.map((toolId) => (
                <ToolButton
                    key={toolId}
                    toolId={toolId}
                    selected={!!activeTools[toolId]}
                    onClick={() => handleToolClick(toolId)}
                />
            ))}
        </div>
    );
};

export default SideToolContainer;
