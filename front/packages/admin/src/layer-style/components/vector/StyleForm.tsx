import React, {useEffect} from 'react';
import {useRecoilState, useRecoilValue} from "recoil";
import {editableStylesState, editingStyleState, selectedAssetState} from "@src/layer-style/recoils/layerStyle";
import {ApiProvider} from "@src/layer-style/api/ApiProvider";
import {toast} from "react-toastify";
import {mapToRequestStyle} from "@src/layer-style/mappers/mapToRequestStyle";
import {useAttributes} from "@src/layer-style/hooks/useAttributes";

const StyleForm = () => {
  const asset = useRecoilValue(selectedAssetState);
  const [editingStyle, setEditingStyle] = useRecoilState(editingStyleState);
  const [editableStyles, setEditableStyles] = useRecoilState(editableStylesState);

  const { attributes, error } = useAttributes(asset.id);

  const styleUpdate = async () => {
    if (!editingStyle) return;

    const updateStyleInput = mapToRequestStyle(editingStyle);
    console.log("updateStyleInput", updateStyleInput);

    try {
      const newStyle = await ApiProvider.layer.updateStyle(editingStyle.id, updateStyleInput);
      if (!newStyle?.id) return;

      // newStyle에 context가 반환되지 않아 임시 방편
      const newEditableStyles = editableStyles.map(style =>
        style.id === editingStyle.id ? editingStyle : style
      )
      setEditableStyles(newEditableStyles);
      toast.success("스타일 수정 완료");
    } catch (err) {
      console.error("스타일 수정 오류:", err);
      toast.error("스타일 수정 중 오류가 발생했습니다.");
      return;
    } finally {
      exit();
    }
  };

  const exit = () => {
    setEditingStyle(undefined);
  }

  useEffect(() => {
    return () => {
      setEditingStyle(undefined);
    }
  }, []);

  return (
    <>
      <div className="section-header">
        <div>스타일 수정</div>
        <div>
          <button onClick={styleUpdate}>저장</button>
          <button onClick={exit}>취소</button>
        </div>
        <div className="section-body">

        </div>
      </div>

    </>
  );
};

export default StyleForm;