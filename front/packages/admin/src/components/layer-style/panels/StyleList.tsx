import React, {useEffect} from 'react';
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {layerStylesState, selectedAssetState, selectedLayerStyleState} from "@src/recoils/LayerStyle";
import {DefaultCreateStyleInput} from "@src/constants/defaultStyle";
import {CreateLayerStyleDocument, ApplyLayerStyleDocument, CreateStyleInput, LayerStyle} from "@mnd/shared/src/types/layerset/gql/graphql";
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
  const [applyAssetStyleMutation] = useMutation(ApplyLayerStyleDocument); // 스타일 에셋에 적용

  const handleCreateStyle = async (input: CreateStyleInput) => {
    try {
      const response = await createStyleMutation({ variables: { input } });
      const newStyle = response.data?.createStyle;

      if (!newStyle?.id) {
        toast.error("스타일 생성에는 성공했지만 ID를 받아오지 못했습니다.");
        return;
      }
      await applyAssetStyleMutation({
            variables: {
              id: asset.id,
              styleId: newStyle.id
        }
      });
      toast.success("스타일 생성 및 적용 완료");
    } catch (err) {
      console.error("스타일 생성 또는 적용 오류:", err);
      toast.error("스타일 생성 또는 적용 중 오류가 발생했습니다.");
    }
  };

  const styleCreate = () => {
    handleCreateStyle(DefaultCreateStyleInput);
  }

  const styleToggle = (styleId: string) => {
    console.log("toggle", styleId);
  };

  const styleUpdate = (style: LayerStyle) => {
    setSelectedLayerStyle(style);
  };

  const styleDelete = (styleId: string) => {
    console.log("delete", styleId);
  };

  useEffect(() => {
    console.log("layerStyles", layerStyles);
  }, [layerStyles]);

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