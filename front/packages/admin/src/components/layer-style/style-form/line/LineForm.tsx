import React from 'react';
import {Maybe, Scalars} from "@mnd/shared/src/types/layerset/gql/graphql";
import {StyleInputRow} from "@src/components/layerset/layer/style/StyleInputRow";
import {StyleContextType} from "@src/types/StyleContext";

interface LineFormProps {
  ctx: Maybe<Scalars['JSON']['output']>,
  handleChangeContext: <K extends keyof StyleContextType>(key: K, value: StyleContextType[K]) => void;
}

const LineForm = ({ctx, handleChangeContext}: LineFormProps) => {
  return (
    <>
      <StyleInputRow
        title="외각선 너비"
        type="number"
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
      {/*<StyleSelectRow*/}
      {/*  title="외각선 종류"*/}
      {/*  value={ctx.strokeType ?? "outline"}*/}
      {/*  onChange={val => handleChangeContext("strokeType", val)}*/}
      {/*  options={[{label: "실선", value: "outline"}, {label: "점선", value: "dash"}]}*/}
      {/*/>*/}
    </>
  );
};

export default LineForm;