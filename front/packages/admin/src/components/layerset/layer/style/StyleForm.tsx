import React from 'react';
import {StyleType} from "@mnd/shared/src/types/layerset/gql/graphql";
import PointForm from "@src/components/layerset/layer/style/PointForm";
import LineForm from "@src/components/layerset/layer/style/LineForm";
import PolygonForm from "@src/components/layerset/layer/style/PolygonForm";
import {ClassifyAttributeQuery} from "@src/generated/gql/layerset/graphql";
import {useRecoilState, useRecoilValue} from "recoil";
import {layerStylesState, selectedLayerStyleState} from "@src/recoils/LayerStyle";

const StyleForm = () => {
  const layerStyles = useRecoilValue(layerStylesState);
  const [selectedLayerStyle, setSelectedLayerStyle] = useRecoilState(selectedLayerStyleState);

  const style = selectedLayerStyle.context;
  const handleChangeType = (type: StyleType) => {
    setSelectedLayerStyle(prev => ({
      ...prev,
      type
    }));
  };

  const handleChangeContext = (key: keyof typeof style, value: string | number | boolean | ClassifyAttributeQuery) => {
    setSelectedLayerStyle(prev => ({
      ...prev,
      context: {
        ...prev.context,
        [key]: value
      }
    }));
  };

  const save = () => {
    console.log("저장");
    setSelectedLayerStyle(undefined);
  }

  const cancel = () => {
    console.log("취소")
    setSelectedLayerStyle(undefined);
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
        {selectedLayerStyle.type === StyleType.Point && <PointForm style={style} handleChangeContext={handleChangeContext}/>}
        {selectedLayerStyle.type === StyleType.Line && <LineForm style={style} handleChangeContext={handleChangeContext}/>}
        {selectedLayerStyle.type === StyleType.Polygon && <PolygonForm style={style} handleChangeContext={handleChangeContext}/>}
      </div>
    </>
  );
};

export default StyleForm;

