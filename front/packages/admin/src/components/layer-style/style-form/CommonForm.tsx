import React from 'react';
import {useRecoilState} from "recoil";
import {selectedLayerStyleState} from "@src/recoils/LayerStyle";
import {RuleStyleInput, StyleType} from "@mnd/shared/src/types/layerset/gql/graphql";
import {StyleInputRow} from "@src/components/layerset/layer/style/StyleInputRow";

const CommonForm = () => {
  const [selectedLayerStyle, setSelectedLayerStyle] = useRecoilState(selectedLayerStyleState);

  const handleChangeType = (type: StyleType) => {
    setSelectedLayerStyle(prev => ({
      ...prev,
      type
    }));
  };

  const handleChangeName = (name: string) => {
    setSelectedLayerStyle(prev => ({
      ...prev,
      name
    }));
  }

  const handleChangeContext = (key: keyof typeof selectedLayerStyle.context, value: string | number | boolean | RuleStyleInput[]) => {
    setSelectedLayerStyle(prev => ({
      ...prev,
      context: {
        ...prev.context,
        [key]: value
      }
    }));
  };

  return (
    <div>
      <div>
        <button onClick={() => handleChangeType(StyleType.Point)}>Point</button>
        <button onClick={() => handleChangeType(StyleType.Line)}>Line</button>
        <button onClick={() => handleChangeType(StyleType.Polygon)}>Polygon</button>
      </div>
      <StyleInputRow
        title="스타일명"
        type="text"
        value={selectedLayerStyle.name ?? ""}
        onChange={val => handleChangeName(val.toString())}
      />
      <StyleInputRow
        title="최소 스케일"
        type="number"
        value={selectedLayerStyle.context.minScale ?? 0}
        onChange={val => handleChangeContext("minScale", val)}
      />
      <StyleInputRow
        title="최대 스케일"
        type="number"
        value={selectedLayerStyle.context.maxScale ?? 0}
        onChange={val => handleChangeContext("maxScale", val)}
      />
    </div>
  );
};

export default CommonForm;