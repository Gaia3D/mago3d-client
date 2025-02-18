import React, { useState, useEffect } from "react";
import { ToolConfig, useToolConfig } from "@/components/utils/toolConfig.tsx";
import ToolHelper from "@/components/tool/ToolHelper.tsx";
import ResetDirection from "@/components/tool/actions/ResetDirection.tsx";
import ToolGroupContainer from "@/components/tool/ToolGroupContainer.tsx";
import ToolButton from "@/components/tool/ToolButton.tsx";

const SideToolContainer: React.FC = () => {
    const TOOLS = useToolConfig();
    const [selectedTools, setSelectedTools] = useState<Record<string, boolean>>({});
    const [exclusiveSelected, setExclusiveSelected] = useState<string | null>(null);

    useEffect(() => {
        setSelectedTools(
            TOOLS.reduce((acc, button) => ({ ...acc, [button.id]: false }), {} as Record<string, boolean>)
        );
    }, [TOOLS]);

    const handleClick = (button: ToolConfig) => {
        const { id, type, onSelect, onDeselect } = button;

        switch (type) {
            case "default":
                onSelect?.();
                break;
            case "toggle":
                setSelectedTools((prev) => {
                    const newState = !prev[id];
                    newState ? onSelect?.() : onDeselect?.();
                    return { ...prev, [id]: newState };
                });
                break;
            case "exclusive":
                setSelectedTools((prev) => {
                    const newState = { ...prev };

                    if (exclusiveSelected && exclusiveSelected !== id) {
                        newState[exclusiveSelected] = false;
                        TOOLS.find((b) => b.id === exclusiveSelected)?.onDeselect?.();
                    }

                    prev[id] ? onDeselect?.() : onSelect?.();
                    setExclusiveSelected(prev[id] ? null : id);
                    newState[id] = !prev[id];

                    return newState;
                });
                break;
            default:
                break;
        }
    };

    const groupTypes = ["measure", "view", "terrain"];
    const groupedTools = groupTypes.reduce(
        (acc, group) => ({
            ...acc,
            [group]: TOOLS.filter((config) => config.group === group),
        }),
        {} as Record<string, ToolConfig[]>
    );

    const otherTools = TOOLS.filter((config) => !groupTypes.includes(config.group ?? ""));

    return (
        <div className="side-tool-container">
            {groupTypes.map((group) => (
                <ToolGroupContainer
                    key={group}
                    groupName={group}
                    tools={groupedTools[group]}
                    selectedTools={selectedTools}
                    onToolClick={handleClick}
                />
            ))}

            {/* 그룹에 속하지 않은 기타 툴 */}
            {otherTools.map((config) => (
                <ToolButton
                    key={config.id}
                    config={config}
                    isSelected={selectedTools[config.id]}
                    onClick={handleClick}
                />
            ))}

            {/* Helper 컨테이너 */}
            <div className="tool-helper-container">
                {TOOLS.filter((config) => selectedTools[config.id] && config.helper).map((config) => (
                    <ToolHelper key={config.id} helper={config.helper} />
                ))}
            </div>

            <ResetDirection />
        </div>
    );
};

export default SideToolContainer;
