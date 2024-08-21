import React from 'react';

interface ToggleSettingProps {
    text?: string;
    id: string;
    onChange: (key: string, value: boolean) => void;
    checked: boolean;
}

const ToggleSetting: React.FC<ToggleSettingProps> = ({ text, id, checked, onChange }) => {
    return (
        <div className="toggle-setting-container">
            <div className="checkbox-wrapper-9">
                <input
                    checked={checked}
                    onChange={() => onChange(id, !checked)}
                    className="tgl tgl-flat"
                    id={id}
                    type="checkbox"
                />
                <label className="tgl-btn" htmlFor={id}></label>
            </div>
            {text ?? <span>{text}</span>}
        </div>
    );
};

export default ToggleSetting;
