import React from 'react';
import { useRecoilState } from 'recoil';
import { editingStyleState } from '@src/recoils/LayerStyle';
import { StyleSelectRow } from '@src/components/layerset/layer/style/StyleSelectRow';
import {PointStyleInput} from "@mnd/shared/src/types/layerset/gql/graphql";
import IconShapeForm from "@src/components/refactor-layer-style/style-form/IconShapeForm";

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

  const pointStyle = editingStyle?.context?.point ?? {};

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
        <></> :
        <IconShapeForm
          pointStyle={pointStyle}
          handleChange={handlePointChange}
        />
      }
    </div>
  );
};

export default PointForm;
