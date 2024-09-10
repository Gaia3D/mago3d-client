import React from 'react';
import {useTranslation} from "react-i18next";

interface RadioGroupProps {
    name: string;
    value: string;
    onChange: (key:string, value: string) => void;
    options: {text: string, value: string}[];
    translate?: boolean
}

const RadioGroup: React.FC<RadioGroupProps> = ({ name, value, onChange, options, translate = false }) => {
    const {t} = useTranslation();
    return (
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
                <span className="custom-radio"></span> {translate? t(option.text): option.text}
            </label>
        ))}
    </>
)};
export default RadioGroup;