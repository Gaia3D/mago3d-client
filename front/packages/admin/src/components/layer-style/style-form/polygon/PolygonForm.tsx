import React from 'react';
import {Maybe, RuleStyleInput, Scalars} from "@mnd/shared/src/types/layerset/gql/graphql";
import {StyleInputRow} from "@src/components/layerset/layer/style/StyleInputRow";
import {StyleSelectRow} from "@src/components/layerset/layer/style/StyleSelectRow";

interface PolygonFormProps {
  ctx: Maybe<Scalars['JSON']['output']>,
  handleChangeContext: (key: string, value: string | number | boolean | RuleStyleInput[]) => void;
}

const PolygonForm = ({ctx, handleChangeContext}: PolygonFormProps) => {
  return (
    <>
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
      <StyleSelectRow
        title="외각선 종류"
        value={ctx.strokeType ?? "outline"}
        onChange={val => handleChangeContext("strokeType", val)}
        options={[{label: "실선", value: "outline"}, {label: "점선", value: "dash"}]}
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
    {/*  채우기 패턴 추가하기*/}
    </>
  );
};

export default PolygonForm;