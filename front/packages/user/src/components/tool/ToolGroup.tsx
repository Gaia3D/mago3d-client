import React, {ReactNode, useState} from "react";

interface ToolGroupProps {
    style: string;
    children?: ReactNode;
}

const ToolGroup = ({ style, children }: ToolGroupProps) => {
    const [isSelected, setIsSelected] = useState(false);

    return (
        <div className="tool-group-container">
            <div className={`tool-group ${isSelected ? "" : "hide" }`}>
                {children}
            </div>
            <div
                onClick={() => setIsSelected(!isSelected)}
                className={`tool-container ${isSelected ? "selected" : ""}`}>
                <button className={`tool-button icon ${style}`}>
                </button>
            </div>
        </div>
    );
};

export default ToolGroup;
