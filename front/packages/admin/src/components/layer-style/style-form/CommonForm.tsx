import React from 'react';
import {useRecoilState} from "recoil";
import {globalStyleContextState, selectedLayerStyleState} from "@src/recoils/LayerStyle";
import {StyleType} from "@mnd/shared/src/types/layerset/gql/graphql";
import {StyleInputRow} from "@src/components/layerset/layer/style/StyleInputRow";
import {StyleContextType} from "@src/types/StyleContext";

interface CommonFormProps {
  handleChangeContext: <K extends keyof StyleContextType>(key: K, value: StyleContextType[K]) => void;
}

const CommonForm = ({handleChangeContext}: CommonFormProps) => {
  const [selectedLayerStyle, setSelectedLayerStyle] = useRecoilState(selectedLayerStyleState);
  const [globalStyleContext, setGlobalStyleContext] = useRecoilState(globalStyleContextState);

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

  return (
    <div>
      <div>
        <button onClick={() => handleChangeType(StyleType.Point)}>Point</button>
        <button onClick={() => handleChangeType(StyleType.Line)}>Line</button>
        <button onClick={() => handleChangeType(StyleType.Polygon)}>Polygon</button>
        <button onClick={() => handleChangeType(StyleType.Attribute)}>Attribute</button>
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
        min={0}
        value={globalStyleContext.minScale}
        onChange={val => handleChangeContext("minScale", Number(val))}
      />
      <StyleInputRow
        title="최대 스케일"
        type="number"
        min={0}
        value={globalStyleContext.maxScale}
        onChange={val => handleChangeContext("maxScale", Number(val))}
      />
    </div>
  );
};

export default CommonForm;