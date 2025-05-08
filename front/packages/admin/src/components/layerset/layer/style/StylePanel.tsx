import React, {Dispatch, SetStateAction, useState} from 'react';
import {LayerStyle} from "@mnd/shared/src/types/layerset/gql/graphql";
import {StyleMode} from "@src/types/Layer";
import StyleList from "@src/components/layerset/layer/style/StyleList";
import StyleForm from "@src/components/layerset/layer/style/StyleForm";

interface StyleListPanelProps {
  layerStyles: LayerStyle[];
  setLayerStyles: Dispatch<SetStateAction<LayerStyle[]>>
}

const StylePanel = ({layerStyles, setLayerStyles}: StyleListPanelProps) => {

  const [styleMode, setStyleMode] = useState<StyleMode>(StyleMode.List);

  return (
    <>
      {styleMode === StyleMode.List ?
        <StyleList
          layerStyles={layerStyles}
          setLayerStyles={setLayerStyles}
          setStyleMode={setStyleMode}
        /> :
        <StyleForm
          layerStyles={layerStyles}
          setLayerStyles={setLayerStyles}
          setStyleMode={setStyleMode}
        />
      }
    </>
  );
};

export default StylePanel;