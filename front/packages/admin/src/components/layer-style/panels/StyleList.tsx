import React, {useEffect} from 'react';
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {layerStylesState, selectedAssetState, selectedLayerStyleState} from "@src/recoils/LayerStyle";
import {DefaultCreateStyleInput} from "@src/constants/defaultStyle";
import {CreateLayerStyleDocument, ApplyLayerStyleDocument, DeleteLayerStyleDocument, CreateStyleInput, LayerStyle} from "@mnd/shared/src/types/layerset/gql/graphql";
import StyleRow from "@src/components/layerset/layer/style/StyleRow";
import {useMutation} from "@apollo/client";
import {useTranslation} from "react-i18next";
import {toast} from "react-toastify";

const StyleList = () => {
  const { t } = useTranslation();
  const asset = useRecoilValue(selectedAssetState);
  const [layerStyles, setLayerStyles] = useRecoilState(layerStylesState);
  const setSelectedLayerStyle = useSetRecoilState(selectedLayerStyleState);

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

  const styleUpdate = (style: LayerStyle) => {
    setSelectedLayerStyle(style);
  };

  const styleDelete = async (styleId: string) => {
    try {
      const response = await deleteStyleMutation({variables: {id: styleId}});
      console.log(response);
    } catch (err) {
      console.error("스타일 삭제 오류:", err);
      toast.error("스타일 삭제 중 오류가 발생했습니다.");
    }
  }

  const styleToggle = (styleId: string) => {
    setLayerStyles(prev =>
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
        {layerStyles.map((style, index) => (
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