import React from 'react';

interface SearchProps {
    value: string;
    change: (value: string) => void;
}

const SearchInput: React.FC<SearchProps> = ({ value, change }) => {

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        change(e.target.value);
    };

    return (
        <div className="search-container">
            <button type="button" className="button search"></button>
            <input
                id="searchInput"
                value={value}
                onChange={handleChange}
            />
        </div>
    );
};
export default SearchInput;