import React from 'react';
import {useRecoilValue} from "recoil";
import {editingStyleState} from "@src/layer-style/recoils/layerStyle";
import StyleList from "@src/layer-style/components/vector/StyleList";
import PreviewPanel from "@src/layer-style/components/vector/PreviewPanel";

const LayerVectorStyle = () => {
  const editingStyle = useRecoilValue(editingStyleState);

  return (
    <div className="style-container">
      <div className="left-section">
        <StyleList />
        {/*{editingStyle === "edit" ? <StyleForm /> : <StyleList />}*/}
      </div>
      <div className="right-section">
        <PreviewPanel />
      </div>
    </div>
  );
};

export default LayerVectorStyle;