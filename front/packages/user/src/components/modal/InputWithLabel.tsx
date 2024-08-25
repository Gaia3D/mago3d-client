import React, { ChangeEvent, FC } from 'react';

interface InputWithLabelProps {
    id: string;
    value: number | string;
    onChange: (key: string, value: string | number | boolean) => void;
    label: string;
    isDetail?: boolean;
    type: 'text' | 'number';
}

const InputWithLabel: FC<InputWithLabelProps> = ({ id, value, type, onChange, label, isDetail = false }) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        onChange(id, value);
    };

    return (
        <>
            {!isDetail && <label htmlFor={id} className="title">{label}</label>}
            <div className={isDetail ? "" : "value"}>
                <input
                    id={id}
                    type={type}
                    className={isDetail ? "width-140" : "modal-full-width"}
                    value={value}
                    onChange={handleChange}
                />
                {isDetail && <label htmlFor={id}>{label}</label>}
            </div>
        </>
    );
};

export default InputWithLabel;
