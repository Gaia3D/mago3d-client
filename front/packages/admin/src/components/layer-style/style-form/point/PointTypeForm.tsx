import React from 'react';
import {StyleInputRow} from "@src/components/layerset/layer/style/StyleInputRow";
import {Maybe, RuleStyleInput, Scalars} from "@mnd/shared/src/types/layerset/gql/graphql";
import {StyleContextType} from "@src/types/StyleContext";

interface PointTypeFormProps {
  ctx: Maybe<Scalars['JSON']['output']>,
  handleChangeContext: <K extends keyof StyleContextType>(key: K, value: StyleContextType[K]) => void;
}

const PointTypeForm = ({ctx, handleChangeContext}: PointTypeFormProps) => {
  return (
    <>
      <StyleInputRow
        title="점 크기"
        type="number"
        min={0}
        value={ctx.size}
        onChange={val => handleChangeContext("size", Number(val))}
      />
      <StyleInputRow
        title="외각선 너비"
        type="number"
        min={0}
        value={ctx.strokeWidth}
        onChange={val => handleChangeContext("strokeWidth", Number(val))}
      />
      <StyleInputRow
        title="외각선 색상"
        type="color"
        value={ctx.strokeColor}
        onChange={val => handleChangeContext("strokeColor", String(val))}
      />
      <StyleInputRow
        title="외각선 투명도"
        type="range"
        value={ctx.strokeOpacity}
        min={0}
        max={1}
        step={0.01}
        onChange={val => handleChangeContext("strokeOpacity", Number(val))}
      />
      <StyleInputRow
        title="채우기 색상"
        type="color"
        value={ctx.fillColor}
        onChange={val => handleChangeContext("fillColor", String(val))}
      />
      <StyleInputRow
        title="채우기 투명도"
        type="range"
        value={ctx.fillOpacity}
        min={0}
        max={1}
        step={0.01}
        onChange={val => handleChangeContext("fillOpacity", Number(val))}
      />
    </>
  );
};

export default PointTypeForm;