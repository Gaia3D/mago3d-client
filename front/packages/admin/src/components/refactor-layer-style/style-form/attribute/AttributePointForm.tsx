import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {RuleStyleInput, LabelStyleInput, PointStyleInput, PreviewColumnsQuery} from "@mnd/shared/src/types/layerset/gql/graphql";
import {useRecoilState} from "recoil";
import {editingStyleState} from "@src/recoils/LayerStyle";
import {CompleteIconStyleType} from "@src/components/refactor-layer-style/mapCompleteStyleToUpdateType";
import {ToggleRow} from "@src/components/layerset/layer/style/ToggleRow";
import IconShapeForm from "@src/components/refactor-layer-style/style-form/IconShapeForm";
import PointShapeForm from "@src/components/refactor-layer-style/style-form/PointShapeForm";
import LabelForm from "@src/components/refactor-layer-style/style-form/LabelForm";

interface AttributePointFormProps {
  ruleStyles: RuleStyleInput[];
  setRuleStyles: Dispatch<SetStateAction<RuleStyleInput[]>>
  attributes: PreviewColumnsQuery;
}

const AttributePointForm = ({ruleStyles, setRuleStyles, attributes}: AttributePointFormProps) => {
  const [editingStyle, setEditingStyle] = useRecoilState(editingStyleState);
  const initPointStyle = editingStyle.context.point;
  const pointStyle = editingStyle?.context?.attribute?.rules?.[0]?.style?.point ?? initPointStyle;

  const [iconStyle, setIconStyle] = useState<CompleteIconStyleType>(initPointStyle.iconStyle);
  const [labelStyle, setLabelStyle] = useState<LabelStyleInput>(initPointStyle.labelStyle);

  const [isIconStyle, setIsIconStyle] = useState(!!initPointStyle.iconStyle);
  const [isLabelStyle, setIsLabelStyle] = useState(!!initPointStyle.labelStyle);

  const handlePointChange = <K extends keyof PointStyleInput>(key: K, value: PointStyleInput[K]) => {
    const updatedRules = ruleStyles.map(ruleStyle => ({
      ...ruleStyle,
      style: {
        ...ruleStyle.style,
        point: {
          ...(ruleStyle.style.point || {}),
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
    setRuleStyles(updatedRules); // 상위 상태도 업데이트
  };

  const handleIconStyleChange = <K extends keyof CompleteIconStyleType>(key: K, value: CompleteIconStyleType[K]) => {
    const updated = {
      ...iconStyle,
      [key]: value
    };
    setIconStyle(updated);
    handlePointChange("iconStyle", updated);
  };

  const handleLabelStyleChange = <K extends keyof LabelStyleInput>(key: K, value: LabelStyleInput[K]) => {
    const updated = {
      ...labelStyle,
      [key]: value
    };
    setLabelStyle(updated);
    handlePointChange("labelStyle", updated);
  };

  useEffect(() => {
    handlePointChange("iconStyle", isIconStyle ? iconStyle : undefined);
  }, [isIconStyle]);

  useEffect(() => {
    handlePointChange("labelStyle", isLabelStyle ? labelStyle : undefined);
  }, [isLabelStyle]);

  return (
    <div>
      <ToggleRow
        title="아이콘 사용"
        enabled={isIconStyle}
        onToggle={() => setIsIconStyle(!isIconStyle)}
      />
      {isIconStyle ? (
        <IconShapeForm iconStyle={iconStyle} handleIconChange={handleIconStyleChange}
                       handlePointChange={handlePointChange}/>
      ) : (
        <PointShapeForm pointStyle={pointStyle} handleChange={handlePointChange} isAttribute={true}/>
      )}

      <ToggleRow
        title="라벨 사용"
        enabled={isLabelStyle}
        onToggle={() => setIsLabelStyle(!isLabelStyle)}
      />
      {isLabelStyle && (
        <LabelForm labelStyle={labelStyle} handleLabelStyleChange={handleLabelStyleChange} attributes={attributes}/>
      )}
    </div>
  );
};

export default AttributePointForm;