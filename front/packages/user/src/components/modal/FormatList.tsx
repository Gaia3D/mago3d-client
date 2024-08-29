import React from 'react';

interface FormatListProps {
    name: string;
    selected: string;
    onSelect: (key: string, format: string) => void;
    formats: {text: string, value: string}[];
}

const FormatList: React.FC<FormatListProps> = ({ name, selected, onSelect, formats }) => (
    <ul className="format-list">
        {formats.map(format => (
            <li
                key={format.value}
                className={selected === format.value ? "selected" : ""}
                onClick={() => onSelect(name, format.value)}
            >
                {format.text}
            </li>
        ))}
    </ul>
);


export default FormatList;