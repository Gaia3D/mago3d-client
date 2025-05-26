import React from 'react';
import {useRecoilState} from "recoil";
import {editingStyleState} from "@src/recoils/LayerStyle";
import {LineStyleInput} from "@mnd/shared/src/types/layerset/gql/graphql";
import {StyleInputRow} from "@src/components/layerset/layer/style/StyleInputRow";

const LineForm = () => {
  const [editingStyle, setEditingStyle] = useRecoilState(editingStyleState);
  const lineStyle = editingStyle.context.line;

  const handleLineChange = <K extends keyof LineStyleInput>(key: K, value: LineStyleInput[K]) => {
    const updated = {
      ...editingStyle,
      context: {
        ...editingStyle.context,
        line: {
          ...editingStyle.context.line,
          [key]: value,
        }
      },
    }
    setEditingStyle(updated);
  }


  return (
    <>
      <StyleInputRow
        title="외각선 너비"
        type="number"
        value={lineStyle.strokeWidth}
        onChange={val => handleLineChange("strokeWidth", Number(val))}
      />
      <StyleInputRow
        title="외각선 색상"
        type="color"
        value={lineStyle.strokeColor}
        onChange={val => handleLineChange("strokeColor", String(val))}
      />
      <StyleInputRow
        title="외각선 투명도"
        type="range"
        value={lineStyle.strokeOpacity}
        min={0}
        max={1}
        step={0.01}
        onChange={val => handleLineChange("strokeOpacity", Number(val))}
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