import React from 'react';

type SelectInputProps = {
  label: string;
  name: string;
  value?: string | number;
  options: (string | number)[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

const SelectInput = ({ label, name, value, options, onChange }: SelectInputProps) => (
  <>
    <div className="stitle">{label}</div>
    <select name={name} value={value} onChange={onChange}>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </>
);

export default SelectInput;
