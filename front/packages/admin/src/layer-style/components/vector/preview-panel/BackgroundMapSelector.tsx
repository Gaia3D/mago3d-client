import React from 'react';
import { BackgroundMaps } from "@src/constants/backgroundMap";
import {useRecoilState} from "recoil";
import {selectedBackgroundState} from "@src/layer-style/recoils/layerStyle";

const BackgroundMapSelector = () => {
  const [selectedBackground, setSelectedBackground] = useRecoilState(selectedBackgroundState);

  return (
    <div className="preview-bottom-button-container">
      <div>
        {BackgroundMaps.map((backgroundMap) => (
          <button
            key={backgroundMap.id}
            onClick={() => setSelectedBackground(backgroundMap)}
            className={backgroundMap.name === selectedBackground.name ? "active" : ""}
          >
            {backgroundMap.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BackgroundMapSelector;
