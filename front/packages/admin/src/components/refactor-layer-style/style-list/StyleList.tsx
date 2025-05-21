import React from 'react';
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {completeStylesState, editingStyleState, selectedAssetState} from "@src/recoils/LayerStyle";
import {useMutation} from "@apollo/client";
import {
  ApplyLayerStyleDocument,
  CreateLayerStyleDocument,
  DeleteLayerStyleDocument,
} from "@mnd/shared/src/types/layerset/gql/graphql";
import {DefaultCreateStyleInput} from "@src/constants/defaultStyle";
import {toast} from "react-toastify";
import StyleRow from "@src/components/refactor-layer-style/style-list/StyleRow";
import {CompleteStyleType} from "@src/components/refactor-layer-style/mapStyleToCompleteStyleType";

const StyleList = () => {
  const asset = useRecoilValue(selectedAssetState);
  const [completeStyles, setCompleteStyles] = useRecoilState(completeStylesState);
  const setEditingStyle = useSetRecoilState(editingStyleState);

  const [createStyleMutation] = useMutation(CreateLayerStyleDocument);  // 스타일 생성
  const [applyAssetStyleMutation] = useMutation(ApplyLayerStyleDocument); // 스타일을 에셋에 적용
  const [deleteStyleMutation] = useMutation(DeleteLayerStyleDocument); // 스타일을 에셋에 적용

  const styleCreate = async () => {
    try {
      const response = await createStyleMutation({ variables: { input: DefaultCreateStyleInput } });
      const newStyle = response.data?.createStyle;

      if (!newStyle?.id) return;

      await applyAssetStyleMutation({
        variables: {
          id: asset.id,
          styleId: newStyle.id
        }
      });
      toast.success("스타일 생성 완료");
    } catch (err) {
      console.error("스타일 생성 오류:", err);
      toast.error("스타일 생성 중 오류가 발생했습니다.");
    }
  };

  const styleUpdate = (style: CompleteStyleType) => {
    setEditingStyle(style);
  };

  const styleDelete = async (styleId: string) => {
    try {
      const response = await deleteStyleMutation({variables: {id: styleId}});
      console.log(response);
    } catch (err) {
      console.error("스타일 삭제 오류:", err);
      toast.error("스타일 삭제 중 오류가 발생했습니다.");
    } finally {
      // TODO 새로운 에셋 설정
    }
  }

  const styleToggle = (styleId: string) => {
    setCompleteStyles(prev =>
      prev.map(style =>
        style.id === styleId
          ? { ...style, enabled: !style.enabled } // 해당 스타일의 enabled 토글
          : style
      )
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
        {completeStyles.map((style, index) => (
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