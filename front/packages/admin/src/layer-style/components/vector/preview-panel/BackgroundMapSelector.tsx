import React from 'react';
import { BackgroundMaps, BackgroundMapType } from "@src/constants/backgroundMap";

interface BackgroundMapSelectorProps {
  currentMap: BackgroundMapType;
  onClick: (map: BackgroundMapType) => void;
}

const BackgroundMapSelector = ({ currentMap, onClick }: BackgroundMapSelectorProps) => {
  return (
    <div className="preview-bottom-button-container">
      <div>
        {BackgroundMaps.map((backgroundMap) => (
          <button
            key={backgroundMap.id}
            onClick={() => onClick(backgroundMap)}
            className={backgroundMap.name === currentMap.name ? "active" : ""}
          >
            {backgroundMap.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BackgroundMapSelector;
