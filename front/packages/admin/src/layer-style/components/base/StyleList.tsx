import React from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  editableStylesState,
  editingStyleState,
  remoteAssetDataState,
  selectedAssetState
} from "@src/layer-style/recoils/layerStyle";
import { ApiProvider } from "@src/layer-style/api/ApiProvider";
import { toast } from "react-toastify";
import {
  DefaultCreateVectorStyleInput,
  DefaultCreateRasterStyleInput,
} from "@src/layer-style/constants/defaultInput";
import { mapToEditableStyle } from "@src/layer-style/mappers/mapToEditableStyle";
import StyleRow from "@src/layer-style/components/vector/style-list/StyleRow";
import { EditableStyleModel } from "@src/layer-style/models/EditableStyleModel";
import { LayerType } from "@src/layer-style/models/EditableContextModel";
import {ColorMapType} from "@mnd/shared/src/types/layerset/gql/graphql";

const StyleList = () => {
  const asset = useRecoilValue(selectedAssetState);
  const remoteAssetData = useRecoilValue(remoteAssetDataState);
  const [editableStyles, setEditableStyles] = useRecoilState(editableStylesState);
  const setEditingStyle = useSetRecoilState(editingStyleState);

  const styleCreate = async () => {
    const isVector = asset.type === "VECTOR";

    const defaultInput = isVector
      ? DefaultCreateVectorStyleInput
      : DefaultCreateRasterStyleInput(
        remoteAssetData?.coverage?.dimensions?.coverageDimension?.range?.min,
        remoteAssetData?.coverage?.dimensions?.coverageDimension?.range?.max
      );

    const defaultContext = isVector
      ? defaultInput.context.point
      : defaultInput.context.raster;

    try {
      const newStyle = await ApiProvider.layer.createStyle(defaultInput);
      if (!newStyle?.id) return;

      await ApiProvider.layer.applyStyle(asset.id, newStyle.id);

      const editable = mapToEditableStyle({
        id: newStyle.id,
        name: defaultInput.name,
        context: defaultContext,
        type: isVector ? LayerType.POINT : LayerType.RASTER
      });

      const updatedStyles = [
        editable,
        ...editableStyles.map(s => ({ ...s, defaultStatus: false })),
      ].map(s => ({ ...s, defaultStatus: s.id === newStyle.id }));

      setEditableStyles(updatedStyles);
      toast.success("스타일 생성 완료");
    } catch (err) {
      console.error("스타일 생성 오류:", err);
      toast.error("스타일 생성 중 오류가 발생했습니다.");
    }
  };

  const styleDelete = async (style: EditableStyleModel) => {
    if (editableStyles.length <= 1) {
      toast.warning("스타일은 최소 1개 이상 유지되어야 합니다.");
      return;
    }
    if (style.defaultStatus) {
      toast.warning("활성화된 스타일은 삭제할 수 없습니다.");
      return;
    }

    try {
      await ApiProvider.layer.deleteStyle(style.id);
      setEditableStyles(prev => prev.filter(s => s.id !== style.id));
      toast.success("스타일 삭제 완료");
    } catch (err) {
      console.error("스타일 삭제 오류:", err);
      toast.error("스타일 삭제 중 오류가 발생했습니다.");
    }
  };

  const styleUpdate = (style: EditableStyleModel) => {
    setEditingStyle(style);
  };

  const visibleToggle = (styleId: string) => {
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

  const statusToggle = async (style: EditableStyleModel) => {
    if (style.defaultStatus) return;

    try {
      await ApiProvider.layer.ApplyDefaultStyle(asset.id, style.id);
      const updatedStyles = editableStyles.map(s => ({
        ...s,
        defaultStatus: s.id === style.id,
      }));
      setEditableStyles(updatedStyles);
      toast.success("스타일 활성화 완료");
    } catch (err) {
      console.error("스타일 활성화 오류:", err);
      toast.error("스타일 활성화 중 오류가 발생했습니다.");
    }
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
            statusToggle={statusToggle}
            visibleToggle={visibleToggle}
            onUpdate={() => styleUpdate(style)}
            onDelete={() => styleDelete(style)}
          />
        ))}
      </div>
    </div>
  );
};

export default StyleList;
