import React from 'react';
import {useRecoilState} from "recoil";
import {editingStyleState} from "@src/recoils/LayerStyle";
import {StyleType} from "@mnd/shared/src/types/layerset/gql/graphql";
import {StyleInputRow} from "@src/components/layerset/layer/style/StyleInputRow";

const CommonForm = () => {
  const [editingStyle, setEditingStyle] = useRecoilState(editingStyleState);

  const handleChangeType = (type: StyleType) => {
    setEditingStyle(prev => ({
      ...prev,
      type
    }));
  };

  const handleChangeName = (name: string) => {
    setEditingStyle(prev => ({
      ...prev,
      name
    }));
  }

  return (
    <div>
      <StyleInputRow
        title="스타일명"
        type="text"
        value={editingStyle.name}
        onChange={val => handleChangeName(val.toString())}
      />
      <div>
        <button onClick={() => handleChangeType(StyleType.Point)}>Point</button>
        <button onClick={() => handleChangeType(StyleType.Line)}>Line</button>
        <button onClick={() => handleChangeType(StyleType.Polygon)}>Polygon</button>
        <button onClick={() => handleChangeType(StyleType.Attribute)}>Attribute</button>
      </div>
    </div>
  );
};

export default CommonForm;