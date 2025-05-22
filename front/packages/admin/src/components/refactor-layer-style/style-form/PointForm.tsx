import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { editingStyleState } from '@src/recoils/LayerStyle';
import { StyleSelectRow } from '@src/components/layerset/layer/style/StyleSelectRow';
import { IconStyleInput, LabelStyleInput, PointStyleInput } from "@mnd/shared/src/types/layerset/gql/graphql";
import IconShapeForm from "@src/components/refactor-layer-style/style-form/IconShapeForm";
import PointShapeForm from "@src/components/refactor-layer-style/style-form/PointShapeForm";
import { ToggleRow } from "@src/components/layerset/layer/style/ToggleRow";
import LabelForm from "@src/components/refactor-layer-style/style-form/LabelForm";

const PointForm = () => {
  const [editingStyle, setEditingStyle] = useRecoilState(editingStyleState);
  const [labelStyle, setLabelStyle] = useState<LabelStyleInput>({ attributeName: "" });

  const pointStyle = editingStyle.context.point;
  const iconStyle = pointStyle.iconStyle;

  const handlePointChange = <K extends keyof PointStyleInput>(key: K, value: PointStyleInput[K]) => {
    setEditingStyle(prev => ({
      ...prev,
      context: {
        ...prev.context,
        point: {
          ...prev.context.point,
          [key]: value,
        }
      },
    }));
  }

  const handleIconStyleChange = <K extends keyof IconStyleInput>(key: K, value: IconStyleInput[K]) => {
    setEditingStyle(prev => ({
      ...prev,
      context: {
        ...prev.context,
        point: {
          ...prev.context.point,
          iconStyle: {
            ...prev.context.point.iconStyle,
            [key]: value,
          }
        }
      },
    }));
  }

  const handleLabelStyleToggle = (enable: boolean) => {
    handlePointChange("labelStyle", enable ? labelStyle : undefined);
  };

  useEffect(() => {
    handlePointChange("shape", iconStyle ? "icon" : "point");
  }, []);

  return (
    <div>
      <StyleSelectRow
        title="점 모양"
        value={pointStyle.shape}
        onChange={val => handlePointChange('shape', val)}
        options={[
          { label: '점', value: 'point' },
          { label: '아이콘', value: 'icon' }
        ]}
      />

      {pointStyle.shape === 'point' ? (
        <PointShapeForm pointStyle={pointStyle} handleChange={handlePointChange} />
      ) : (
        <IconShapeForm iconStyle={iconStyle} handleChange={handleIconStyleChange} />
      )}

      <ToggleRow
        title="라벨 사용"
        enabled={!!pointStyle.labelStyle}
        onToggle={handleLabelStyleToggle}
      />
      {!!pointStyle.labelStyle && (
        <LabelForm />
      )}
    </div>
  );
};

export default PointForm;
