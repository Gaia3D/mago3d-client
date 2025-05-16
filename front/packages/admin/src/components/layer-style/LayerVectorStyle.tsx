import React, {useEffect} from 'react';
import {useRecoilState, useRecoilValue} from "recoil";
import {layerStylesState, selectedAssetState, selectedLayerStyleState} from "@src/recoils/LayerStyle";
import StyleList from "@src/components/layer-style/panels/StyleList";
import PreviewPanel from "@src/components/layer-style/panels/PreviewPanel";

const LayerVectorStyle = () => {
  const asset = useRecoilValue(selectedAssetState);
  const [layerStyles, setLayerStyles] = useRecoilState(layerStylesState);
  const selectedLayerStyle = useRecoilValue(selectedLayerStyleState);

  useEffect(() => {
    console.log("selectedLayerStyle", selectedLayerStyle);
  }, [selectedLayerStyle]);

  return (
    <div className="style-container">
      <div className="left-section">
        <StyleList />
        {/*(selectedLayerStyle ? <StyleForm/> : )*/}
        {/*<StylePanel/>*/}
      </div>
      <div className="right-section">
        <PreviewPanel />
      </div>
    </div>
  );
};

export default LayerVectorStyle;