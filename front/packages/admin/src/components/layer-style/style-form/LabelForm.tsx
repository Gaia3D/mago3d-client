import React from 'react';
import {Maybe, PreviewColumnsQuery, RuleStyleInput, Scalars} from "@mnd/shared/src/types/layerset/gql/graphql";
import {StyleSelectRow} from "@src/components/layerset/layer/style/StyleSelectRow";
import {StyleInputRow} from "@src/components/layerset/layer/style/StyleInputRow";
import {ToggleRow} from "@src/components/layerset/layer/style/ToggleRow";

interface LabelFormProps {
  ctx: Maybe<Scalars['JSON']['output']>,
  handleChangeContext: (key: string, value: string | number | boolean | RuleStyleInput[]) => void;
  attributeData: PreviewColumnsQuery;
}

const LabelForm = ({ctx, handleChangeContext, attributeData}: LabelFormProps) => {
  return (
    <>
      <StyleSelectRow
        title="속성 명"
        value={ctx.labelAttribute}
        onChange={val => handleChangeContext("labelAttribute", val)}
        options={attributeData.previewColumns.map((data) => {
          return { label: data.field, value: data.field };
        })}
      />
      <StyleSelectRow
        title="폰트 종류"
        value={ctx.labelFontType}
        onChange={val => handleChangeContext("labelFontType", val)}
        options={[{label: "sans-serif", value: "sans-serif"}]}
      />
      <StyleInputRow
        title="폰트 사이즈"
        type="number"
        value={ctx.labelFontSize ?? 8}
        onChange={val => handleChangeContext("labelFontSize", val)}
      />
      <StyleInputRow
        title="폰트 색상"
        type="color"
        value={ctx.labelFontColor ?? "#000000"}
        onChange={val => handleChangeContext("labelFontColor", val)}
      />
      <ToggleRow
        title="테두리 여부"
        enabled={ctx.labelBorder ?? false}
        onToggle={(val: boolean) => handleChangeContext("labelBorder", val)}
      />
      <StyleInputRow
        title="테두리 색상"
        type="color"
        value={ctx.strokeBorderColor ?? "#000000"}
        onChange={val => handleChangeContext("strokeBorderColor", val)}
      />
    </>
  );
};

export default LabelForm;