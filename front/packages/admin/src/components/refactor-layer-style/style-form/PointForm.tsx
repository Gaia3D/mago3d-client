import React from 'react';
import { useRecoilState } from 'recoil';
import { editingStyleState } from '@src/recoils/LayerStyle';
import { StyleSelectRow } from '@src/components/layerset/layer/style/StyleSelectRow';
import {IconStyleInput, PointStyleInput} from "@mnd/shared/src/types/layerset/gql/graphql";
import IconShapeForm from "@src/components/refactor-layer-style/style-form/IconShapeForm";
import PointShapeForm from "@src/components/refactor-layer-style/style-form/PointShapeForm";

const PointForm = () => {
  const [editingStyle, setEditingStyle] = useRecoilState(editingStyleState);

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

  const pointStyle = editingStyle.context.point ?? {iconStyle:{symbolId:""}};
  const iconStyle = pointStyle.iconStyle;

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
      {pointStyle.shape === 'point' ?
        <PointShapeForm

        /> :
        <IconShapeForm
          iconStyle={iconStyle}
          handleChange={handleIconStyleChange}
        />
      }
    </div>
  );
};

export default PointForm;
