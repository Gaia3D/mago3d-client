import React from 'react';

interface ToolButtonProps {
    toolId: string;
    selected: boolean;
    onClick: (toolId: string) => void;
}

const ToolButton: React.FC<ToolButtonProps> = ({ toolId, selected, onClick }) => {
    return (
        <div
            className={`tool-button ${selected ? 'selected' : ''}`}
            onClick={() => onClick(toolId)}
        >
            {toolId}
        </div>
    );
};

export default ToolButton;
