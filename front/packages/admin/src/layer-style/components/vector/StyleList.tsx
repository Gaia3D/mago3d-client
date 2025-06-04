import React, {useEffect} from 'react';
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {editableStylesState, editingStyleState, selectedAssetState} from "@src/layer-style/recoils/layerStyle";
import {ApiProvider} from "@src/layer-style/api/ApiProvider";
import {toast} from "react-toastify";
import {DefaultCreateRasterStyleInput, DefaultCreateVectorStyleInput} from "@src/layer-style/constants/defaultInput";
import StyleRow from "@src/layer-style/components/vector/style-list/StyleRow";
import {mapToEditableStyle} from "@src/layer-style/mappers/mapToEditableStyle";
import {EditableStyleModel} from "@src/layer-style/models/EditableStyleModel";

const StyleList = () => {
  const asset = useRecoilValue(selectedAssetState);
  const assetType = asset.type;
  const setEditingStyle = useSetRecoilState(editingStyleState);
  const [editableStyles, setEditableStyles] = useRecoilState(editableStylesState);


  const styleCreate = async () => {
    const isVector = assetType === "VECTOR";
    const defaultInput = isVector ? DefaultCreateVectorStyleInput : DefaultCreateRasterStyleInput;
    const defaultContext = isVector
      ? DefaultCreateVectorStyleInput.context.point
      : DefaultCreateRasterStyleInput.context.raster;

    try {
      const newStyle = await ApiProvider.layer.createStyle(defaultInput);
      if (!newStyle?.id) return;

      await ApiProvider.layer.applyStyle(asset.id, newStyle.id);

      const editable = mapToEditableStyle({
        id: newStyle.id,
        name: defaultInput.name,
        context: defaultContext,
      });

      setEditableStyles(prev => [editable, ...prev]);
      toast.success("스타일 생성 완료");
    } catch (err) {
      console.error("스타일 생성 오류:", err);
      toast.error("스타일 생성 중 오류가 발생했습니다.");
    }
  };

  const styleDelete = async (styleId: string) => {
    if (editableStyles.length <= 1) {
      toast.warning("스타일은 최소 1개 이상 유지되어야 합니다.");
      return;
    }

    try {
      await ApiProvider.layer.deleteStyle(styleId);

      setEditableStyles(prev => prev.filter(style => style.id !== styleId));

      toast.success("스타일 삭제 완료");
    } catch (err) {
      console.error("스타일 삭제 오류:", err);
      toast.error("스타일 삭제 중 오류가 발생했습니다.");
    }
  };

  const styleUpdate = (style: EditableStyleModel) => {
    setEditingStyle(style);
  }

  const styleToggle = (styleId: string) => {
    setEditableStyles(prev =>
      prev.map(style => {
        if (style.id !== styleId) return style;

        const updatedContext = {
          ...style.context,
          visible: !style.context.visible,
        };

        return {
          ...style,
          context: updatedContext,
        };
      })
    );
  };


  return (
    <div>
      <div className="section-header">
        <div>스타일 목록</div>
        <div>
          <button onClick={styleCreate}>추가</button>
        </div>
      </div>
      <div className="section-body">
        {editableStyles.map((style, index) => (
          <StyleRow
            key={index}
            style={style}
            onToggle={styleToggle}
            onUpdate={() => styleUpdate(style)}
            onDelete={styleDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default StyleList;