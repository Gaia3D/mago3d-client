import React from "react";
import ToolGroup from "@/components/tool/ToolGroup.tsx";
import { ToolConfig } from "@/components/utils/toolConfig.tsx";
import ToolButton from "@/components/tool/ToolButton.tsx";

interface ToolGroupContainerProps {
    groupName: string;
    tools: ToolConfig[];
    selectedTools: Record<string, boolean>;
    onToolClick: (config: ToolConfig) => void;
}

const ToolGroupContainer: React.FC<ToolGroupContainerProps> = ({ groupName, tools, selectedTools, onToolClick }) => {
    if (tools.length === 0) return null;

    return (
        <ToolGroup style={groupName}>
            {tools.map((config) => (
                <ToolButton
                    key={config.id}
                    config={config}
                    isSelected={selectedTools[config.id]}
                    onClick={onToolClick}
                />
            ))}
        </ToolGroup>
    );
};

export default ToolGroupContainer;
