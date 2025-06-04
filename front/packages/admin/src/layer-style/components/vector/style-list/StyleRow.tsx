import React from 'react';
import { EditableStyleModel } from "@src/layer-style/models/EditableStyleModel";
import {useRecoilValue} from "recoil";
import {backgroundsState} from "@src/layer-style/recoils/layerStyle";

interface StyleRowProps {
  style: EditableStyleModel;
  onToggle: (styleId: string) => void;
  onUpdate: (styleId: string) => void;
  onDelete: (styleId: string) => void;
}

// 대비 색상 얻기
const getContrastFontColor = (hex: string) => {
  const color = hex.replace('#', '');
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b);
  return luminance > 186 ? '#000000' : '#ffffff'; // 기준값은 186
};

const StyleRow = ({ style, onToggle, onUpdate, onDelete }: StyleRowProps) => {
  const { context } = style;
  const backgrounds = useRecoilValue(backgroundsState);

  const matchedBackground = backgrounds.find(
    bg => bg.id === context.backgroundId
  );

  const backgroundName = matchedBackground?.name ?? "전체";
  const backgroundColor = matchedBackground?.color ?? "#ffffff";
  const fontColor = getContrastFontColor(backgroundColor);

  return (
    <div className="style-row">
      <div className="map" style={{backgroundColor, color: fontColor}}>
        {backgroundName}
      </div>
      <div className="name ellipsis">{context.name}</div>
      <div className="button-container">
        <div onClick={() => onToggle(style.id)}>
          {context.visible ? "끄기" : "보기"}
        </div>
        <div onClick={() => onUpdate(style.id)}>수정</div>
        <div onClick={() => onDelete(style.id)}>삭제</div>
      </div>
    </div>
  );
};

export default StyleRow;
