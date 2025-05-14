import React from "react";

interface StyleInputRowProps {
  title: string;
  type: 'text' | 'number' | 'color' | 'range';
  value: string | number;
  onChange: (value: string | number) => void;
  min?: number;
  max?: number;
  step?: number;
}

export const StyleInputRow = ({ title, type, value, onChange, min, max, step }: StyleInputRowProps) => {
  return (
    <div className="input-row">
      <div className="title">{title}</div>
      {type === 'range' && <span style={{ marginLeft: 8 }}>{value}</span>}
      <div className="value">
        <input
          type={type}
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={e => {
            const val = type === 'number' || type === 'range'
              ? parseFloat(e.target.value)
              : e.target.value;
            onChange(val);
          }}
        />
      </div>
    </div>
  );
};