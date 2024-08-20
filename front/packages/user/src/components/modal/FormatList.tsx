import React from 'react';

interface FormatListProps {
    selected: string;
    onSelect: (format: string) => void;
    formats: {text: string, value: string}[];
}

const FormatList: React.FC<FormatListProps> = ({ selected, onSelect, formats }) => (
    <ul className="format-list">
        {formats.map(format => (
            <li
                key={format.value}
                className={selected === format.value ? "selected" : ""}
                onClick={() => onSelect(format.value)}
            >
                {format.text}
            </li>
        ))}
    </ul>
);


export default FormatList;