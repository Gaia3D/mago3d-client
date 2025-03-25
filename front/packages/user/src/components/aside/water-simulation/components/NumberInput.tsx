import React from 'react';

type NumberInputProps = {
  label: string;
  name: string;
  value?: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const NumberInput= ({label, name, value, min, max, step, onChange}: NumberInputProps) => (
  <div>
    <label>{label}:
      <input
        type="number"
        name={name}
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={onChange}
      />
    </label>
  </div>
);

export default NumberInput;
