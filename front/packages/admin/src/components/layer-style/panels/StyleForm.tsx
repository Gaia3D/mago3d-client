import {UpdateLayerStyleDocument, RuleStyleInput, StyleType} from "@mnd/shared/src/types/layerset/gql/graphql";
import {useRecoilState} from "recoil";
import {selectedLayerStyleState} from "@src/recoils/LayerStyle";
import {useMutation} from "@apollo/client";
import {toast} from "react-toastify";
import {mapToUpdateStyleInput} from "@src/components/layer-style/panels/mapToUpdateStyleInput";
import React from "react";
import PointForm from "@src/components/layer-style/style-form/point/PointForm";
import LineForm from "@src/components/layer-style/style-form/line/LineForm";
import PolygonForm from "@src/components/layer-style/style-form/polygon/PolygonForm";
import CommonForm from "@src/components/layer-style/style-form/CommonForm";
import AttributeForm from "@src/components/layer-style/style-form/AttributeForm";
import {ToggleRow} from "@src/components/layerset/layer/style/ToggleRow";

const StyleForm = () => {

  const [selectedLayerStyle, setSelectedLayerStyle] = useRecoilState(selectedLayerStyleState);
  const [updateStyleMutation] = useMutation(UpdateLayerStyleDocument);  // 스타일 생성

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

  const handleChangeContext = (key: keyof typeof selectedLayerStyle.context, value: string | number | boolean | RuleStyleInput[]) => {
    setSelectedLayerStyle(prev => ({
      ...prev,
      context: {
        ...prev.context,
        [key]: value
      }
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
        <CommonForm />
        {selectedLayerStyle.type === StyleType.Point &&
          <PointForm ctx={selectedLayerStyle.context} handleChangeContext={handleChangeContext}/>}
        {selectedLayerStyle.type === StyleType.Line &&
          <LineForm ctx={selectedLayerStyle.context} handleChangeContext={handleChangeContext}/>}
        {selectedLayerStyle.type === StyleType.Polygon &&
          <PolygonForm ctx={selectedLayerStyle.context} handleChangeContext={handleChangeContext}/>}
        <ToggleRow
          title="속성 사용"
          enabled={selectedLayerStyle.context.isAttributeEnabled ?? false}
          onToggle={(val: boolean) => handleChangeContext("isAttributeEnabled", val)}
        />
        {
          selectedLayerStyle.context.isAttributeEnabled &&
          <AttributeForm ctx={selectedLayerStyle.context} handleChangeContext={handleChangeContext} />
        }
      </div>
    </>
  );
};

export default StyleForm;