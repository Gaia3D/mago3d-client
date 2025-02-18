import React from "react";
import { ToolConfig } from "@/components/utils/toolConfig.tsx";

interface ToolButtonProps {
    config: ToolConfig;
    isSelected: boolean;
    onClick: (config: ToolConfig) => void;
}

const ToolButton: React.FC<ToolButtonProps> = ({ config, isSelected, onClick }) => {
    return (
        <div className={`tool-container ${isSelected ? "selected" : ""}`} key={config.id}>
            <button
                className={`tool-button icon ${config.id}`}
                onClick={() => onClick(config)}
                title={config.title}
            />
            {isSelected && config.component}
        </div>
    );
};

export default ToolButton;
