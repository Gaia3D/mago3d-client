import React from 'react';

type ColorPickerProps = {
  label: string;
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const ColorPicker = ({ label, value, onChange }: ColorPickerProps) => (
  <div className="flex">
    <div className="stitle">{label}</div>
    <label className="color-picker">
      <span className="swatch"></span>
      <input type="color" id="real-color" value={value} onChange={onChange}/>
    </label>
  </div>
)
;

export default ColorPicker;
