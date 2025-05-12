import React, {Dispatch, SetStateAction} from 'react';
import {LayerStyle, StyleType} from "@mnd/shared/src/types/layerset/gql/graphql";
import {StyleMode} from "@src/types/Layer";
import PointForm from "@src/components/layerset/layer/style/PointForm";
import LineForm from "@src/components/layerset/layer/style/LineForm";
import PolygonForm from "@src/components/layerset/layer/style/PolygonForm";

interface StyleFormProps {
  layerStyles: LayerStyle[];
  setLayerStyles: Dispatch<SetStateAction<LayerStyle[]>>
  setStyleMode: Dispatch<SetStateAction<StyleMode>>
}

const StyleForm = ({layerStyles, setLayerStyles, setStyleMode}: StyleFormProps) => {

  const style = layerStyles[0].context;
  const handleChangeType = (type: StyleType) => {
    setLayerStyles(prev => {
      const next = [...prev];
      next[0] = {
        ...next[0],
        type
      }
      return next;
    })
  }

  const handleChangeContext = (key: keyof typeof style, value: string | number) => {
    setLayerStyles(prev => {
      const next = [...prev];
      next[0] = {
        ...next[0],
        context: {
          ...next[0].context,
          [key]: value,
        },
      };
      return next;
    });
  };

  const save = () => {
    console.log("저장");
    setStyleMode(StyleMode.List);
  }

  const cancel = () => {
    console.log("취소")
    setStyleMode(StyleMode.List);
  }

  return (
    <>
      <div className="section-header">
        <div>스타일 수정</div>
        <div>
          <button onClick={save}>저장</button>
          <button onClick={cancel}>취소</button>
        </div>
      </div>
      <div className="section-body">
        <div>
          <button onClick={() => handleChangeType(StyleType.Point)}>Point</button>
          <button onClick={() => handleChangeType(StyleType.Line)}>Line</button>
          <button onClick={() => handleChangeType(StyleType.Polygon)}>Polygon</button>
        </div>
        {layerStyles[0].type === StyleType.Point && <PointForm style={style} handleChangeContext={handleChangeContext}/>}
        {layerStyles[0].type === StyleType.Line && <LineForm style={style} handleChangeContext={handleChangeContext}/>}
        {layerStyles[0].type === StyleType.Polygon && <PolygonForm style={style} handleChangeContext={handleChangeContext}/>}
      </div>
    </>
  );
};

export default StyleForm;

