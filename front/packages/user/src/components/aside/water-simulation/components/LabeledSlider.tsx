import React from 'react';

type LabeledSliderProps = {
  label: string;
  name: string;
  min: number;
  max: number;
  step: number;
  value?: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const LabeledSlider = ({ label, name, min, max, step, value, onChange }: LabeledSliderProps) => (
  <div>
    <label>{label}:
      <input
        type="range"
        name={name}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
      />
      <span>{value}</span>
    </label>
  </div>
);

export default LabeledSlider;
