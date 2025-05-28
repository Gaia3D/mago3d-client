import React from 'react';
import {useRecoilValue} from "recoil";
import {styleModeState} from "@src/layer-style/recoils/layerStyle";
import StyleList from "@src/layer-style/components/vector/StyleList";

const LayerVectorStyle = () => {
  const mode = useRecoilValue(styleModeState);

  return (
    <div className="style-container">
      <div className="left-section">
        <StyleList />
        {/*{mode === "edit" ? <StyleForm /> : <StyleList />}*/}
      </div>
      <div className="right-section">
        {/*<PreviewPanel />*/}
      </div>
    </div>
  );
};

export default LayerVectorStyle;