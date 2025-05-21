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
      <div className="style-type-button-group">
        <button
          className={editingStyle.type === StyleType.Point ? 'selected' : ''}
          onClick={() => handleChangeType(StyleType.Point)}
        >
          Point
        </button>
        <button
          className={editingStyle.type === StyleType.Line ? 'selected' : ''}
          onClick={() => handleChangeType(StyleType.Line)}
        >
          Line
        </button>
        <button
          className={editingStyle.type === StyleType.Polygon ? 'selected' : ''}
          onClick={() => handleChangeType(StyleType.Polygon)}
        >
          Polygon
        </button>
        <button
          className={editingStyle.type === StyleType.Attribute ? 'selected' : ''}
          onClick={() => handleChangeType(StyleType.Attribute)}
        >
          Attribute
        </button>
      </div>
    </div>
  );
};

export default CommonForm;