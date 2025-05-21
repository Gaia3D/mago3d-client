import React, {useEffect} from 'react';
import {useRecoilState, useRecoilValue} from "recoil";
import {editingStyleState, selectedAssetState} from "@src/recoils/LayerStyle";
import {useMutation, useQuery} from "@apollo/client";
import {PreviewColumnsDocument, UpdateLayerStyleDocument} from "@mnd/shared/src/types/layerset/gql/graphql";
import {toast} from "react-toastify";
import {mapCompleteStyleToUpdateType} from "@src/components/refactor-layer-style/mapCompleteStyleToUpdateType";
import CommonForm from "@src/components/refactor-layer-style/style-form/CommonForm";

const StyleForm = () => {
  const asset = useRecoilValue(selectedAssetState);
  const [editingStyle, setEditingStyle] = useRecoilState(editingStyleState);
  const [updateStyleMutation] = useMutation(UpdateLayerStyleDocument);
  const { data: attributes } = useQuery(PreviewColumnsDocument,{
    variables: {
      assetID: asset.id
    }
  });

  const styleUpdate = async () => {
    const updateStyleInput = mapCompleteStyleToUpdateType(editingStyle);
    console.log("updateStyleInput", updateStyleInput);
    try {
      const response = await updateStyleMutation({ variables: { id: editingStyle.id, input: updateStyleInput } });
      console.log("response.data", response.data)
      toast.success("스타일 수정 완료");
    } catch (err) {
      console.error("스타일 생성 오류:", err);
      toast.error("스타일 생성 중 오류가 발생했습니다.");
    } finally {
      exit();
    }
  };

  const exit = () => {
    setEditingStyle(undefined);
  }

  useEffect(() => {
    console.log("editingStyle", editingStyle);
  }, [editingStyle]);

  return (
    <>
      <div className="section-header">
        <div>스타일 수정</div>
        <div>
          <button onClick={styleUpdate}>저장</button>
          <button onClick={exit}>취소</button>
        </div>
      </div>
      <div className="section-body">
        <CommonForm />
      </div>
    </>
  );
};


export default StyleForm;