import React from 'react';
import {useRecoilState, useRecoilValue} from "recoil";
import {backgroundsState, selectedBackgroundState} from "@src/layer-style/recoils/layerStyle";

const BackgroundMapSelector = () => {

  const backgrounds = useRecoilValue(backgroundsState)
  const [selectedBackground, setSelectedBackground] = useRecoilState(selectedBackgroundState);

  if (!backgrounds?.length) return;

  return (
    <div className="preview-bottom-button-container">
      <div>
        {backgrounds.map((backgroundMap) => (
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
