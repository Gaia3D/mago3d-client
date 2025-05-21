import React from 'react';
import {useRecoilValue} from "recoil";
import StyleList from "@src/components/refactor-layer-style/style-list/StyleList";
import StyleForm from "@src/components/refactor-layer-style/style-form/StyleForm";
import {editingStyleState} from "@src/recoils/LayerStyle";

const LayerVectorStyle = () => {
  const editingStyle = useRecoilValue(editingStyleState);

  return (
    <div className="style-container">
      <div className="left-section">
        { editingStyle ? <StyleForm /> : <StyleList /> }
      </div>
      <div className="right-section">
      </div>
    </div>
  );
};

export default LayerVectorStyle;