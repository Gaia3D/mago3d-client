import React from 'react';
import StyleRow from "@src/components/layerset/layer/style/StyleRow";
import {LayerStyle} from "@mnd/shared/src/types/layerset/gql/graphql";
import {DefaultLayerStyle} from "@src/constants/defaultStyle";
import {useRecoilState, useSetRecoilState} from "recoil";
import {layerStylesState, selectedLayerStyleState} from "@src/recoils/LayerStyle";

const StyleList = () => {
  const [layerStyles, setLayerStyles] = useRecoilState(layerStylesState);
  const setSelectedLayerStyle = useSetRecoilState(selectedLayerStyleState);

  const styleCreate = () => {
    setLayerStyles([ ...layerStyles, DefaultLayerStyle]);
  }

  const styleToggle = (styleId: string) => {
    console.log("toggle", styleId);
  };

  const styleUpdate = (style: LayerStyle) => {
    setSelectedLayerStyle(style);
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