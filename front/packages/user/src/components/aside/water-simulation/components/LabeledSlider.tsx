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

  <div className="water-setup">
    <div className="stitle">{label}</div>
    <div className="slider">
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
    </div>
    <div className="input-number">
      <input onChange={onChange} type="number" value={value}/>
    </div>
  </div>
)
;

export default LabeledSlider;
