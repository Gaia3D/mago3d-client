import React from "react";

interface StyleSelectRowProps {
  title: string;
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
}

export const StyleSelectRow = ({ title, value, onChange, options }: StyleSelectRowProps) => {
  return (
    <div className="select-row">
      <div className="title">{title}</div>
      <div className="value">
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
        >
          <option value="" hidden>{title} 선택</option>
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
