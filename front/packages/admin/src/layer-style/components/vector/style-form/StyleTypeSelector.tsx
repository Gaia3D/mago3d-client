import React from 'react';
import { LayerType } from '@src/layer-style/models/EditableContextModel';

type Props = {
  selectedType: LayerType;
  onSelectType: (type: LayerType) => void;
};

const AVAILABLE_TYPES = [
  LayerType.POINT,
  LayerType.LINE,
  LayerType.POLYGON,
  LayerType.ATTRIBUTE
];

const StyleTypeSelector = ({ selectedType, onSelectType }: Props) => (
  <div className="style-type-button-group">
    {AVAILABLE_TYPES.map(type => (
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
