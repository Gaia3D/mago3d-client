import React from 'react';

interface RadioGroupProps {
    name: string;
    value: string;
    onChange: (key:string, value: string) => void;
    options: {text: string, value: string}[];
}

const RadioGroup: React.FC<RadioGroupProps> = ({ name, value, onChange, options }) => (
    <>
        {options.map(option => (
            <label key={option.value} className="radio-label">
                <input
                    type="radio"
                    name={name}
                    value={option.value}
                    checked={value === option.value}
                    onChange={() => onChange(name, option.value)}
                />
                <span className="custom-radio"></span> {option.text}
            </label>
        ))}
    </>
);
export default RadioGroup;