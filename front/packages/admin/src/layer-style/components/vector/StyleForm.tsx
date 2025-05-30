import React from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  editableStylesState,
  editingStyleState,
  selectedAssetState
} from '@src/layer-style/recoils/layerStyle';
import { ApiProvider } from '@src/layer-style/api/ApiProvider';
import { toast } from 'react-toastify';
import { mapToRequestStyle } from '@src/layer-style/mappers/mapToRequestStyle';
import { useAttributes } from '@src/layer-style/hooks/useAttributes';
import { produce } from 'immer';
import { EditableContextModel, LayerType } from '@src/layer-style/models/EditableContextModel';

import StyleTypeSelector from '@src/layer-style/components/vector/style-form/StyleTypeSelector';
import PointFormField from '@src/layer-style/components/fields/PointFormField';
import LineFormField from '@src/layer-style/components/fields/LineFormField';
import PolygonFormField from '@src/layer-style/components/fields/PolygonFormField';
import AttributeFormField from '@src/layer-style/components/fields/AttributeFormField';
import {validateStyleBeforeUpdate} from "@src/layer-style/utils/validateStyleBeforeUpdate";

const LAYER_TYPES: LayerType[] = [
  LayerType.POINT,
  LayerType.LINE,
  LayerType.POLYGON,
  LayerType.ATTRIBUTE
];

const StyleForm = () => {
  const asset = useRecoilValue(selectedAssetState);
  const [editingStyle, setEditingStyle] = useRecoilState(editingStyleState);
  const [editableStyles, setEditableStyles] = useRecoilState(editableStylesState);
  const { attributes } = useAttributes(asset.id);

  const handleChange = <K extends keyof EditableContextModel>(
    field: K,
    value: EditableContextModel[K]
  ) => {
    setEditingStyle(prev =>
      produce(prev, draft => {
        if (draft) draft.context[field] = value;
      })
    );
  };

  const styleUpdate = async () => {
    if (!editingStyle) return;
    const errorMessage = validateStyleBeforeUpdate(editingStyle);
    if (errorMessage) {
      toast.warning(errorMessage);
      return;
    }

    const updateStyleInput = mapToRequestStyle(editingStyle);

    try {
      const newStyle = await ApiProvider.layer.updateStyle(editingStyle.id, updateStyleInput);
      if (!newStyle?.id) return;

      setEditableStyles(prev =>
        prev.map(style => (style.id === editingStyle.id ? editingStyle : style))
      );
      toast.success('스타일 수정 완료');
    } catch (err) {
      console.error(err);
      toast.error('스타일 수정 중 오류가 발생했습니다.');
    } finally {
      setEditingStyle(undefined);
    }
  };

  if (!editingStyle) return null;

  const renderFields = () => {
    switch (editingStyle.context.type) {
      case LayerType.POINT:
        return <PointFormField context={editingStyle.context} onChange={handleChange} attributes={attributes} />;
      case LayerType.LINE:
        return <LineFormField context={editingStyle.context} onChange={handleChange} attributes={attributes} />;
      case LayerType.POLYGON:
        return <PolygonFormField context={editingStyle.context} onChange={handleChange} attributes={attributes} />;
      case LayerType.ATTRIBUTE:
        return <AttributeFormField context={editingStyle.context} onChange={handleChange} attributes={attributes} />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="section-header">
        <div>스타일 수정</div>
        <div>
          <button onClick={styleUpdate}>저장</button>
          <button onClick={() => setEditingStyle(undefined)}>취소</button>
        </div>
      </div>

      <div className="section-body">
        <StyleTypeSelector
          selectedType={editingStyle.context.type}
          onSelectType={type => handleChange('type', type)}
          types={LAYER_TYPES}
        />
        {renderFields()}
      </div>
    </>
  );
};

export default StyleForm;
