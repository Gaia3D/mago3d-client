import {
  UpdateLayerStyleDocument,
  StyleType,
  PreviewColumnsDocument
} from "@mnd/shared/src/types/layerset/gql/graphql";
import {useRecoilState, useRecoilValue} from "recoil";
import {globalStyleContextState, selectedAssetState, selectedLayerStyleState} from "@src/recoils/LayerStyle";
import {useMutation, useQuery} from "@apollo/client";
import {toast} from "react-toastify";
import {mapToUpdateStyleInput} from "@src/components/layer-style/panels/mapToUpdateStyleInput";
import React, {useEffect} from "react";
import PointForm from "@src/components/layer-style/style-form/point/PointForm";
import LineForm from "@src/components/layer-style/style-form/line/LineForm";
import PolygonForm from "@src/components/layer-style/style-form/polygon/PolygonForm";
import CommonForm from "@src/components/layer-style/style-form/CommonForm";
import AttributeForm from "@src/components/layer-style/style-form/attribute/AttributeForm";
import {StyleContextType} from "@src/types/StyleContext";

const StyleForm = () => {
  const asset = useRecoilValue(selectedAssetState);
  const [selectedLayerStyle, setSelectedLayerStyle] = useRecoilState(selectedLayerStyleState);
  const [globalStyleContext, setGlobalStyleContext] = useRecoilState(globalStyleContextState);
  const [updateStyleMutation] = useMutation(UpdateLayerStyleDocument);  // 스타일 생성
  const { data: attributeData } = useQuery(PreviewColumnsDocument,{
    variables: {
      assetID: asset.id
    }
  });

  useEffect(() => {
    console.log("globalStyleContext", globalStyleContext);
  }, [globalStyleContext]);

  const styleUpdate = async () => {

    const updateStyleInput = mapToUpdateStyleInput(selectedLayerStyle, selectedLayerStyle.type);
    try {
      const response = await updateStyleMutation({ variables: { id: selectedLayerStyle.id, input: updateStyleInput } });
      console.log("response.data", response.data)
      toast.success("스타일 수정 완료");
    } catch (err) {
      console.error("스타일 생성 오류:", err);
      toast.error("스타일 생성 중 오류가 발생했습니다.");
    } finally {
      setSelectedLayerStyle(undefined);
    }
  };

  const handleChangeContext = <K extends keyof StyleContextType>(
    key: K,
    value: StyleContextType[K]
  ) => {
    setGlobalStyleContext(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const save = () => {
    styleUpdate();
  }

  const cancel = () => {
    setSelectedLayerStyle(undefined);
  }

  return (
    <>
      <div className="section-header">
        <div>스타일 수정</div>
        <div>
          <button onClick={save}>저장</button>
          <button onClick={cancel}>취소</button>
        </div>
      </div>
      <div className="section-body">
        <CommonForm
          handleChangeContext={handleChangeContext}
        />
        {selectedLayerStyle.type === StyleType.Point &&
          <PointForm
            ctx={globalStyleContext}
            handleChangeContext={handleChangeContext}
            attributeData={attributeData}
          />}
        {selectedLayerStyle.type === StyleType.Line &&
          <LineForm
            ctx={globalStyleContext}
            handleChangeContext={handleChangeContext}
          />}
        {selectedLayerStyle.type === StyleType.Polygon &&
          <PolygonForm
            ctx={globalStyleContext}
            handleChangeContext={handleChangeContext}
          />}
        {selectedLayerStyle.type === StyleType.Attribute &&
          <AttributeForm
            ctx={globalStyleContext}
            handleChangeContext={handleChangeContext}
            attributeData={attributeData}
          />}
      </div>
    </>
  );
};

export default StyleForm;