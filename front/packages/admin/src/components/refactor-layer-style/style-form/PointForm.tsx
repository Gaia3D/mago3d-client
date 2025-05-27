import React, {useEffect, useState} from 'react';
import { useRecoilState } from 'recoil';
import { editingStyleState } from '@src/recoils/LayerStyle';
import {
  LabelStyleInput,
  PointStyleInput,
  PreviewColumnsQuery
} from "@mnd/shared/src/types/layerset/gql/graphql";
import IconShapeForm from "@src/components/refactor-layer-style/style-form/IconShapeForm";
import PointShapeForm from "@src/components/refactor-layer-style/style-form/PointShapeForm";
import LabelForm from "@src/components/refactor-layer-style/style-form/LabelForm";
import {ToggleRow} from "@src/components/layerset/layer/style/ToggleRow";
import {CompleteIconStyleType} from "@src/components/refactor-layer-style/mapCompleteStyleToUpdateType";

interface PointFormProps {
  attributes: PreviewColumnsQuery;
}

const PointForm = ({attributes}: PointFormProps) => {
  const [editingStyle, setEditingStyle] = useRecoilState(editingStyleState);
  const pointStyle = editingStyle.context.point;

  const [iconStyle, setIconStyle] = useState<CompleteIconStyleType>(pointStyle.iconStyle);
  const [labelStyle, setLabelStyle] = useState<LabelStyleInput>(pointStyle.labelStyle);

  const [isIconStyle, setIsIconStyle] = useState(!!pointStyle.iconStyle);
  const [isLabelStyle, setIsLabelStyle] = useState(!!pointStyle.labelStyle);

  const handlePointChange = <K extends keyof PointStyleInput>(key: K, value: PointStyleInput[K]) => {
    const updated = {
      ...editingStyle,
      context: {
        ...editingStyle.context,
        point: {
          ...editingStyle.context.point,
          [key]: value,
        }
      },
    }
    setIconStyle(updated.context.point.iconStyle);
    setEditingStyle(updated);
  }

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
        <IconShapeForm iconStyle={iconStyle} handleIconChange={handleIconStyleChange} handlePointChange={handlePointChange} />
      ) : (
        <PointShapeForm pointStyle={pointStyle} handleChange={handlePointChange} />
      )}

      <ToggleRow
        title="라벨 사용"
        enabled={isLabelStyle}
        onToggle={() => setIsLabelStyle(!isLabelStyle)}
      />
      {isLabelStyle && (
        <LabelForm labelStyle={labelStyle} handleLabelStyleChange={handleLabelStyleChange} attributes={attributes}  />
      )}
    </div>
  );
};

export default PointForm;
