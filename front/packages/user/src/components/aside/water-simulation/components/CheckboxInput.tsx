import React from 'react';

type CheckboxInputProps = {
  label: string;
  name: string;
  checked?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const CheckboxInput = ({ label, name, checked, onChange }: CheckboxInputProps) => (
  <>
    <div className="stitle">{label}</div>
    <div className="toggle-switch">
      <input type="checkbox" id={name} name={name} checked={checked} onChange={onChange}/>
      <label htmlFor={name}></label>
    </div>
  </>
);

export default CheckboxInput;
