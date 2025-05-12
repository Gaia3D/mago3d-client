import React from 'react';
import {StyleInputRow} from "@src/components/layerset/layer/style/StyleInputRow";
import {Maybe, Scalars} from "@mnd/shared/src/types/layerset/gql/graphql";
import {StyleSelectRow} from "@src/components/layerset/layer/style/StyleSelectRow";

interface LineFormProps {
  style: Maybe<Scalars['JSON']['output']>,
  handleChangeContext: (key: string, value: string | number) => void
}

const LineForm = ({style, handleChangeContext}: LineFormProps) => {
  return (
    <div>
      <StyleInputRow
        title="스타일명"
        type="text"
        value={style.name ?? ""}
        onChange={val => handleChangeContext("name", val)}
      />
      <StyleInputRow
        title="최소 스케일"
        type="number"
        value={style.minScale ?? 0}
        onChange={val => handleChangeContext("minScale", val)}
      />
      <StyleInputRow
        title="최대 스케일"
        type="number"
        value={style.maxScale ?? 0}
        onChange={val => handleChangeContext("maxScale", val)}
      />
      <StyleInputRow
        title="외각선 너비"
        type="number"
        value={style.strokeWidth ?? 0}
        onChange={val => handleChangeContext("strokeWidth", val)}
      />

      <StyleInputRow
        title="외각선 색상"
        type="color"
        value={style.strokeColor ?? "#000"}
        onChange={val => handleChangeContext("strokeColor", val)}
      />

      <StyleInputRow
        title="외각선 투명도"
        type="range"
        value={style.strokeOpacity ?? 0}
        min={0}
        max={1}
        step={0.01}
        onChange={val => handleChangeContext("strokeOpacity", val)}
      />

      <StyleSelectRow
        title="외각선 종류"
        value={style.strokeType ?? "outline"}
        onChange={val => handleChangeContext("strokeType", val)}
        options={[{label: "실선", value: "outline"}, {label: "점선", value: "dash"}]}
      />
    </div>
  );
};

export default LineForm;