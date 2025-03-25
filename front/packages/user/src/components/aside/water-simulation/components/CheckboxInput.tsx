import React from 'react';

type CheckboxInputProps = {
  label: string;
  name: string;
  checked?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const CheckboxInput = ({ label, name, checked, onChange }: CheckboxInputProps) => (
  <div>
    <label>
      <input type="checkbox" name={name} checked={checked} onChange={onChange} />
      {label}
    </label>
  </div>
);

export default CheckboxInput;
