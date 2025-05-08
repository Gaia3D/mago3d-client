import React, {Dispatch, SetStateAction} from 'react';
import {LayerStyle, StyleType} from "@mnd/shared/src/types/layerset/gql/graphql";
import {StyleMode} from "@src/types/Layer";

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
        <StyleRow
          title="스타일명"
          type="text"
          value={style.name}
          onChange={val => handleChangeContext("name", val)}
        />

        <StyleRow
          title="최소 스케일"
          type="number"
          value={style.minScale}
          onChange={val => handleChangeContext("minScale", val)}
        />

        <StyleRow
          title="최대 스케일"
          type="number"
          value={style.maxScale}
          onChange={val => handleChangeContext("maxScale", val)}
        />

        <StyleRow
          title="점 크기"
          type="number"
          value={style.pixelSize}
          onChange={val => handleChangeContext("size", val)}
        />

        <StyleRow
          title="외각선 너비"
          type="number"
          value={style.strokeWidth}
          onChange={val => handleChangeContext("strokeWidth", val)}
        />

        <StyleRow
          title="외각선 색상"
          type="color"
          value={style.strokeColor}
          onChange={val => handleChangeContext("strokeColor", val)}
        />

        <StyleRow
          title="외각선 투명도"
          type="range"
          value={style.strokeOpacity}
          min={0}
          max={1}
          step={0.01}
          onChange={val => handleChangeContext("strokeOpacity", val)}
        />

        <StyleRow
          title="채우기 색상"
          type="color"
          value={style.fillColor}
          onChange={val => handleChangeContext("fillColor", val)}
        />

        <StyleRow
          title="채우기 투명도"
          type="range"
          value={style.fillOpacity}
          min={0}
          max={1}
          step={0.01}
          onChange={val => handleChangeContext("fillOpacity", val)}
        />

      </div>
    </>
  );
};

export default StyleForm;

interface StyleRowProps {
  title: string;
  type: 'text' | 'number' | 'color' | 'range';
  value: string | number;
  onChange: (value: string | number) => void;
  min?: number;
  max?: number;
  step?: number;
}

const StyleRow = ({ title, type, value, onChange, min, max, step }: StyleRowProps) => {
  return (
    <div className="row">
      <div className="title">{title}</div>
      <div className="value">
        <input
          type={type}
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={e => {
            const val = type === 'number' || type === 'range'
              ? parseFloat(e.target.value)
              : e.target.value;
            onChange(val);
          }}
        />
        {type === 'range' && <span style={{ marginLeft: 8 }}>{value}</span>}
      </div>
    </div>
  );
};
