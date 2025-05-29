import React from 'react';
import {EditableStyleModel} from "@src/layer-style/models/EditableStyleModel";

interface StyleRowProps {
  style: EditableStyleModel;
  onToggle: (styleId: string) => void;
  onUpdate: (styleId: string) => void;
  onDelete: (styleId: string) => void;
}

const StyleRow = ({ style, onToggle, onUpdate, onDelete }: StyleRowProps) => {
  const {context} = style;

  return (
    <div className="style-row">
      <div className="map"></div>
      <div className="name ellipsis">{context.name}</div>
      <div className="button-container">
        <div onClick={() => onToggle(style.id)}>{context.visible ? "끄기" : "보기"}</div>
        <div onClick={() => onUpdate(style.id)}>수정</div>
        <div onClick={() => onDelete(style.id)}>삭제</div>
      </div>
    </div>
  );
};

export default StyleRow;
