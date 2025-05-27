import React, {Dispatch, SetStateAction} from 'react';
import {PolygonStyleInput, PreviewColumnsQuery, RuleStyleInput} from "@mnd/shared/src/types/layerset/gql/graphql";
import {useRecoilState} from "recoil";
import {editingStyleState} from "@src/recoils/LayerStyle";
import {StyleInputRow} from "@src/components/layerset/layer/style/StyleInputRow";

interface AttributePolygonFormProps {
  ruleStyles: RuleStyleInput[];
  setRuleStyles: Dispatch<SetStateAction<RuleStyleInput[]>>
  attributes: PreviewColumnsQuery;
}

const AttributePolygonForm = ({ruleStyles, setRuleStyles, attributes}: AttributePolygonFormProps) => {
  const [editingStyle, setEditingStyle] = useRecoilState(editingStyleState);
  const polygonStyle = editingStyle.context.polygon;

  const handlePolygonChange = <K extends keyof PolygonStyleInput>(key: K, value: PolygonStyleInput[K]) => {
    const updatedRules = ruleStyles.map(ruleStyle => ({
      ...ruleStyle,
      style: {
        ...ruleStyle.style,
        polygon: {
          ...(ruleStyle.style.polygon || {}),
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
        value={polygonStyle.strokeWidth}
        onChange={val => handlePolygonChange("strokeWidth", Number(val))}
      />
      <StyleInputRow
        title="외각선 색상"
        type="color"
        value={polygonStyle.strokeColor}
        onChange={val => handlePolygonChange("strokeColor", String(val))}
      />
      <StyleInputRow
        title="외각선 투명도"
        type="range"
        value={polygonStyle.strokeOpacity}
        min={0}
        max={1}
        step={0.01}
        onChange={val => handlePolygonChange("strokeOpacity", Number(val))}
      />
      {/*외각선 패턴 추가*/}
      <StyleInputRow
        title="채우기 색상"
        type="color"
        value={polygonStyle.fillColor}
        onChange={val => handlePolygonChange("fillColor", String(val))}
      />
      <StyleInputRow
        title="채우기 투명도"
        type="range"
        value={polygonStyle.fillOpacity}
        min={0}
        max={1}
        step={0.01}
        onChange={val => handlePolygonChange("fillOpacity", Number(val))}
      />
    </>
  );
};

export default AttributePolygonForm;