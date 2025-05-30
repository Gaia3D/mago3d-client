import React from 'react';

type StyleTypeSelectorProps<T extends string> = {
  selectedType: T;
  onSelectType: (type: T) => void;
  types: T[];
};

const StyleTypeSelector = <T extends string>({
   selectedType,
   onSelectType,
   types,
 }: StyleTypeSelectorProps<T>) => (
  <div className="style-type-button-group">
    {types.map((type) => (
      <button
        key={type}
        className={selectedType === type ? 'selected' : ''}
        onClick={() => onSelectType(type)}
      >
        {type}
      </button>
    ))}
  </div>
);

export default StyleTypeSelector;
