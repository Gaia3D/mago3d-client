import React, {Dispatch, SetStateAction} from 'react';
import StyleRow from "@src/components/layerset/layer/style/StyleRow";
import {LayerStyle} from "@mnd/shared/src/types/layerset/gql/graphql";
import {StyleMode} from "@src/types/Layer";
import {DefaultLayerStyle} from "@src/constants/defaultStyle";

interface StyleListProps {
  layerStyles: LayerStyle[];
  setLayerStyles: Dispatch<SetStateAction<LayerStyle[]>>
  setStyleMode: Dispatch<SetStateAction<StyleMode>>
}

const StyleList = ({layerStyles, setLayerStyles, setStyleMode}: StyleListProps) => {

  const styleCreate = () => {
    setLayerStyles([ ...layerStyles, DefaultLayerStyle]);
  }

  const styleToggle = (styleId: string) => {
    console.log("toggle", styleId);
  };

  const styleUpdate = (style: LayerStyle) => {
    setLayerStyles([style]);
    setStyleMode(StyleMode.Edit);
  };

  const styleDelete = (styleId: string) => {
    console.log("delete", styleId);
  };

  return (
    <>
      <div className="section-header">
        <div>스타일 목록</div>
        <div>
          <button onClick={styleCreate}>추가</button>
        </div>
      </div>
      <div className="section-body">
        {layerStyles.map((style, index) => (
          <StyleRow
            key={index}
            style={style}
            onToggle={styleToggle}
            onUpdate={() => styleUpdate(style)}
            onDelete={styleDelete}
          />
        ))}
      </div>
    </>
  );
};

export default StyleList;