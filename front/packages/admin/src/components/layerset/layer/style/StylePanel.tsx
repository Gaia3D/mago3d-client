import React, {Dispatch, SetStateAction} from 'react';
import StyleRow from "@src/components/layerset/layer/style/StyleRow";
import {LayerStyle} from "@mnd/shared/src/types/layerset/gql/graphql";

interface StyleListPanelProps {
  layerStyles: LayerStyle[];
  setLayerStyles: Dispatch<SetStateAction<LayerStyle[]>>
}

const StylePanel = ({layerStyles, setLayerStyles}: StyleListPanelProps) => {
  const styleToggle = (styleId: string) => {
    console.log("toggle", styleId);
  };

  const styleUpdate = (styleId: string) => {
    console.log("update", styleId);
  };

  const styleDelete = (styleId: string) => {
    console.log("delete", styleId);
  };
  return (
    <div>
      {layerStyles.map(style => (
        <StyleRow
          key={style.id}
          style={style}
          onToggle={styleToggle}
          onUpdate={styleUpdate}
          onDelete={styleDelete}
        />
      ))}
    </div>
  );
};

export default StylePanel;