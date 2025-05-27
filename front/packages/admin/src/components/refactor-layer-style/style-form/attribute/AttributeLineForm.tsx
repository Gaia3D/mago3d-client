import React, {Dispatch, SetStateAction} from 'react';
import {
  LineStyleInput,
  PointStyleInput,
  PreviewColumnsQuery,
  RuleStyleInput
} from "@mnd/shared/src/types/layerset/gql/graphql";
import {useRecoilState} from "recoil";
import {editingStyleState} from "@src/recoils/LayerStyle";
import {StyleInputRow} from "@src/components/layerset/layer/style/StyleInputRow";

interface AttributeLineFormProps {
  ruleStyles: RuleStyleInput[];
  setRuleStyles: Dispatch<SetStateAction<RuleStyleInput[]>>
  attributes: PreviewColumnsQuery;
}

const AttributeLineForm = ({ruleStyles, setRuleStyles, attributes}: AttributeLineFormProps) => {
  const [editingStyle, setEditingStyle] = useRecoilState(editingStyleState);
  const lineStyle = editingStyle.context.line;

  const handleLineChange = <K extends keyof LineStyleInput>(key: K, value: LineStyleInput[K]) => {

    const updatedRules = ruleStyles.map(ruleStyle => ({
      ...ruleStyle,
      style: {
        ...ruleStyle.style,
        line: {
          ...(ruleStyle.style.line || {}),
          [key]: value,
        }
      }
    }));

    const updated = {
      ...editingStyle,
      context: {
        ...editingStyle.context,
        attribute: {
          ...editingStyle.context.attribute,
          rules: updatedRules,
        },
      },
    };

    setEditingStyle(updated);
    setRuleStyles(updatedRules);
  }

  return (
    <>
      <StyleInputRow
        title="외각선 너비"
        type="number"
        value={lineStyle.strokeWidth}
        onChange={val => handleLineChange("strokeWidth", Number(val))}
      />
      {/*<StyleInputRow*/}
      {/*  title="외각선 색상"*/}
      {/*  type="color"*/}
      {/*  value={lineStyle.strokeColor}*/}
      {/*  onChange={val => handleLineChange("strokeColor", String(val))}*/}
      {/*/>*/}
      <StyleInputRow
        title="외각선 투명도"
        type="range"
        value={lineStyle.strokeOpacity}
        min={0}
        max={1}
        step={0.01}
        onChange={val => handleLineChange("strokeOpacity", Number(val))}
      />
    </>
  );
};

export default AttributeLineForm;