import React from 'react';

type ColorPickerProps = {
  label: string;
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const ColorPicker = ({ label, value, onChange }: ColorPickerProps) => (
  <div>
    <label>{label}:
      <input type="color" value={value} onChange={onChange} />
    </label>
  </div>
);

export default ColorPicker;
