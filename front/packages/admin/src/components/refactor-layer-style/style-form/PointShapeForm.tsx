import React from 'react';
import {StyleInputRow} from "@src/components/layerset/layer/style/StyleInputRow";
import {IconStyleInput, PointStyleInput} from "@mnd/shared/src/types/layerset/gql/graphql";

interface  PointShapeFormProps {
  pointStyle: PointStyleInput,
  handleChange: <K extends keyof PointStyleInput>(key: K, value: PointStyleInput[K]) => void;
  isAttribute?: boolean
}

const PointShapeForm = ({pointStyle, handleChange, isAttribute = false}: PointShapeFormProps) => {
  return (
    <>
      <StyleInputRow
        title="점 크기"
        type="number"
        min={0}
        value={pointStyle.size}
        onChange={val => handleChange("size", Number(val))}
      />
      <StyleInputRow
        title="외각선 너비"
        type="number"
        min={0}
        value={pointStyle.strokeWidth}
        onChange={val => handleChange("strokeWidth", Number(val))}
      />
      <StyleInputRow
        title="외각선 색상"
        type="color"
        value={pointStyle.strokeColor}
        onChange={val => handleChange("strokeColor", String(val))}
      />
      <StyleInputRow
        title="외각선 투명도"
        type="range"
        value={pointStyle.strokeOpacity}
        min={0}
        max={1}
        step={0.01}
        onChange={val => handleChange("strokeOpacity", Number(val))}
      />
      {
        !isAttribute && (
          <StyleInputRow
            title="채우기 색상"
            type="color"
            value={pointStyle.fillColor}
            onChange={val => handleChange("fillColor", String(val))}
          />
        )
      }
      <StyleInputRow
        title="채우기 투명도"
        type="range"
        value={pointStyle.fillOpacity}
        min={0}
        max={1}
        step={0.01}
        onChange={val => handleChange("fillOpacity", Number(val))}
      />
    </>
  );
};

export default PointShapeForm;