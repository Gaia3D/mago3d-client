import React from 'react';
import { LayerStyle } from "@mnd/shared/src/types/layerset/gql/graphql";

interface StyleRowProps {
  style: LayerStyle;
  onToggle: (styleId: string) => void;
  onUpdate: (styleId: string) => void;
  onDelete: (styleId: string) => void;
}

const StyleRow = ({ style, onToggle, onUpdate, onDelete }: StyleRowProps) => {
  return (
    <div className="style-row">
      <div className="map"></div>
      <div className="name ellipsis">{style.name}</div>
      <div className="button-container">
        <div onClick={() => onToggle(style.id)}>{style.enabled ? "끄기" : "보기"}</div>
        <div onClick={() => onUpdate(style.id)}>수정</div>
        <div onClick={() => onDelete(style.id)}>삭제</div>
      </div>
    </div>
  );
};

export default StyleRow;
