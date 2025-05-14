import React from "react";
import StylePanel from "@src/components/layerset/layer/style/StylePanel";
import PreviewPanel from "@src/components/layerset/layer/style/PreviewPanel";
import {useRecoilState, useRecoilValue} from "recoil";
import {layerStylesState, selectedAssetState} from "@src/recoils/LayerStyle";

const LayerVectorStyle = () => {
  const asset = useRecoilValue(selectedAssetState);
  const [layerStyles, setLayerStyles] = useRecoilState(layerStylesState);

  const save = () => {
    console.log("저장", layerStyles);
  }

  const reset = () => {
    setLayerStyles(asset.styles);
  }

  return (
    <div className="style-container">
      <div className="left-section">
        <StylePanel />
      </div>
      <div className="right-section">
        <PreviewPanel />
        <div className="section-footer">
          <button onClick={save}>저장</button>
          <button onClick={reset}>초기화</button>
        </div>
      </div>
    </div>
  );
};

export default LayerVectorStyle;
