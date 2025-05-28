import React, {useEffect} from 'react';
import {useRecoilValue, useSetRecoilState} from "recoil";
import {selectedAssetState, styleModeState} from "@src/layer-style/recoils/layerStyle";
import {ApiProvider} from "@src/layer-style/api/ApiProvider";
import {toast} from "react-toastify";
import {DefaultCreateStyleInput} from "@src/layer-style/constants/defaultInput";
import StyleRow from "@src/components/refactor-layer-style/style-list/StyleRow";

const StyleList = () => {
  const asset = useRecoilValue(selectedAssetState);
  const setMode = useSetRecoilState(styleModeState);
  const styles = asset.styles;

  useEffect(() => {
    console.log("styles", styles);
  }, [styles]);

  const styleCreate = async () => {
    try {
      // 스타일 생성
      const newStyle = await ApiProvider.layer.createStyle(DefaultCreateStyleInput);
      if (!newStyle?.id) return;

      // 스타일 에셋 연동
      await ApiProvider.layer.applyStyle(asset.id, newStyle.id);
      toast.success("스타일 생성 완료");
    } catch (err) {
      console.error("스타일 생성 오류:", err);
      toast.error("스타일 생성 중 오류가 발생했습니다.");
    }
  };

  const styleDelete = async (styleId: string) => {
    try {
      await ApiProvider.layer.deleteStyle(styleId);
      // setCompleteStyles(prev => prev.filter(style => style.id !== styleId));
      toast.success("스타일 삭제 완료");
    } catch (err) {
      console.error("스타일 삭제 오류:", err);
      toast.error("스타일 삭제 중 오류가 발생했습니다.");
    }
  };

  const styleUpdate = () => {
    setMode("edit");

  }

  return (
    <div>

    </div>
  );
};

export default StyleList;