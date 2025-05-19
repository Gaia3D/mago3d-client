import React from 'react';
import {StyleInputRow} from "@src/components/layerset/layer/style/StyleInputRow";
import {Maybe, RuleStyleInput, Scalars} from "@mnd/shared/src/types/layerset/gql/graphql";

interface PointTypeFormProps {
  ctx: Maybe<Scalars['JSON']['output']>,
  handleChangeContext: (key: string, value: string | number | boolean | RuleStyleInput[]) => void;
}

const PointTypeForm = ({ctx, handleChangeContext}: PointTypeFormProps) => {
  return (
    <>
      <StyleInputRow
        title="점 크기"
        type="number"
        value={ctx.size ?? 1}
        onChange={val => handleChangeContext("size", val)}
      />
      <StyleInputRow
        title="채우기 색상"
        type="color"
        value={ctx.fillColor ?? "#000"}
        onChange={val => handleChangeContext("fillColor", val)}
      />
      <StyleInputRow
        title="채우기 투명도"
        type="range"
        value={ctx.fillOpacity ?? 0}
        min={0}
        max={1}
        step={0.01}
        onChange={val => handleChangeContext("fillOpacity", val)}
      />
      <StyleInputRow
        title="외각선 너비"
        type="number"
        value={ctx.strokeWidth ?? 0}
        onChange={val => handleChangeContext("strokeWidth", val)}
      />
      <StyleInputRow
        title="외각선 색상"
        type="color"
        value={ctx.strokeColor ?? "#000"}
        onChange={val => handleChangeContext("strokeColor", val)}
      />
      <StyleInputRow
        title="외각선 투명도"
        type="range"
        value={ctx.strokeOpacity ?? 0}
        min={0}
        max={1}
        step={0.01}
        onChange={val => handleChangeContext("strokeOpacity", val)}
      />
    </>
  );
};

export default PointTypeForm;