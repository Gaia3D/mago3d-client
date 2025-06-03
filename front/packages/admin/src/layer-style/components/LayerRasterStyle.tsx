import React from 'react';
import {useRecoilValue} from "recoil";
import {editingStyleState} from "@src/layer-style/recoils/layerStyle";
import StyleList from "@src/layer-style/components/vector/StyleList";
import StyleForm from "@src/layer-style/components/vector/StyleForm";
import PreviewPanel from "@src/layer-style/components/raster/PreviewPanel";

const LayerRasterStyle = () => {
  const editingStyle = useRecoilValue(editingStyleState);

  return (
    <div className="style-container">
      <div className="left-section">
        {editingStyle ? <StyleForm/> : <StyleList/>}
      </div>
      <div className="right-section">
        <PreviewPanel />
      </div>
    </div>
  );
};

export default LayerRasterStyle;
