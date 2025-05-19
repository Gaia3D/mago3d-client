import {UpdateLayerStyleDocument, RuleStyleInput, StyleType} from "@mnd/shared/src/types/layerset/gql/graphql";
import {useRecoilState} from "recoil";
import {selectedLayerStyleState} from "@src/recoils/LayerStyle";
import {useMutation} from "@apollo/client";
import {toast} from "react-toastify";
import {mapToUpdateStyleInput} from "@src/components/layer-style/panels/mapToUpdateStyleInput";
import {StyleInputRow} from "@src/components/layerset/layer/style/StyleInputRow";
import React from "react";

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

  const handleChangeName = (name: string) => {
    setSelectedLayerStyle(prev => ({
      ...prev,
      name
    }));
  }

  const handleChangeType = (type: StyleType) => {
    setSelectedLayerStyle(prev => ({
      ...prev,
      type
    }));
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
        <div>
          <button onClick={() => handleChangeType(StyleType.Point)}>Point</button>
          <button onClick={() => handleChangeType(StyleType.Line)}>Line</button>
          <button onClick={() => handleChangeType(StyleType.Polygon)}>Polygon</button>
        </div>
        <StyleInputRow
          title="스타일명"
          type="text"
          value={selectedLayerStyle.name ?? ""}
          onChange={val => handleChangeName(val.toString())}
        />
        {/*{selectedLayerStyle.type === StyleType.Point &&*/}
        {/*  <PointForm style={selectedLayerStyle.context} handleChangeContext={handleChangeContext}/>}*/}
        {/*{selectedLayerStyle.type === StyleType.Line &&*/}
        {/*  <LineForm style={selectedLayerStyle.context} handleChangeContext={handleChangeContext}/>}*/}
        {/*{selectedLayerStyle.type === StyleType.Polygon &&*/}
        {/*  <PolygonForm style={selectedLayerStyle.context} handleChangeContext={handleChangeContext}/>}*/}
      </div>
    </>
  );
};

export default StyleForm;