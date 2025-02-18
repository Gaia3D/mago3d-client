import React, { useState, useEffect } from "react";
import { ToolConfig, useToolConfig } from "@/components/utils/toolConfig.tsx";
import ToolHelper from "@/components/tool/ToolHelper.tsx";
import ResetDirection from "@/components/tool/actions/ResetDirection.tsx";
import ToolGroup from "@/components/tool/ToolGroup.tsx";

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

                if (exclusiveSelected && exclusiveSelected !== id) {
                    newState[exclusiveSelected] = false;
                    const previousTool = TOOLS.find((b) => b.id === exclusiveSelected);
                    previousTool?.onDeselect?.();
                }

                if (prev[id]) {
                    onDeselect?.();
                    setExclusiveSelected(null);
                } else {
                    onSelect?.();
                    setExclusiveSelected(id);
                }

                newState[id] = !prev[id];
                return newState;
            });
        }
    };

    // 그룹별로 툴을 필터링
    const measureTools = TOOLS.filter((config) => config.group === "measure");
    const viewTools = TOOLS.filter((config) => config.group === "view");
    const terrainTools = TOOLS.filter((config) => config.group === "terrain");
    const otherTools = TOOLS.filter((config) => !config.group || (config.group !== "measure" && config.group !== "view" && config.group !== "terrain"));

    return (
        <div className="side-tool-container">
            {/* View 그룹 */}
            {viewTools.length > 0 && (
                <ToolGroup style="view">
                    {viewTools.map((config) => {
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
                </ToolGroup>
            )}

            {/* Measure 그룹 */}
            {measureTools.length > 0 && (
                <ToolGroup style="measure">
                    {measureTools.map((config) => {
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
                </ToolGroup>
            )}

            {/* Terrain 그룹 */}
            {terrainTools.length > 0 && (
                <ToolGroup style="terrain">
                    {terrainTools.map((config) => {
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
                </ToolGroup>
            )}

            {/* 그룹에 속하지 않은 기타 툴 */}
            {otherTools.map((config) => {
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

            {/* Helper 컨테이너 */}
            <div className="tool-helper-container">
                {TOOLS.filter((config) => selectedTools[config.id] && config.helper)
                    .map((config) => (
                        <ToolHelper key={config.id} helper={config.helper} />
                    ))}
            </div>

            <ResetDirection />
        </div>
    );
};

export default SideToolContainer;
