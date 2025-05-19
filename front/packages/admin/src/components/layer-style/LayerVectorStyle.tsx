import React from 'react';
import {useRecoilValue} from "recoil";
import {selectedLayerStyleState} from "@src/recoils/LayerStyle";
import StyleList from "@src/components/layer-style/panels/StyleList";
import PreviewPanel from "@src/components/layer-style/panels/PreviewPanel";
import StyleForm from "@src/components/layer-style/panels/StyleForm";

const LayerVectorStyle = () => {
  const selectedLayerStyle = useRecoilValue(selectedLayerStyleState);

  return (
    <div className="style-container">
      <div className="left-section">
        {selectedLayerStyle ?
          <StyleForm /> :
          <StyleList />}
      </div>
      <div className="right-section">
        <PreviewPanel />
      </div>
    </div>
  );
};

export default LayerVectorStyle;