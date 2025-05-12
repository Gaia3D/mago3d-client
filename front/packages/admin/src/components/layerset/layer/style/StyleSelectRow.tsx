import React from "react";

interface StyleSelectRowProps {
  title: string;
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
}

export const StyleSelectRow = ({ title, value, onChange, options }: StyleSelectRowProps) => {
  return (
    <div className="row">
      <div className="title">{title}</div>
      <div className="value">
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
        >
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
