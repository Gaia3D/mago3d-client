import React from 'react';
import {useRecoilState} from "recoil";
import {editingStyleState} from "@src/recoils/LayerStyle";
import {PolygonStyleInput} from "@mnd/shared/src/types/layerset/gql/graphql";
import {StyleInputRow} from "@src/components/layerset/layer/style/StyleInputRow";

const PolygonForm = () => {
  const [editingStyle, setEditingStyle] = useRecoilState(editingStyleState);
  const polygonStyle = editingStyle.context.polygon;

  const handlePolygonChange = <K extends keyof PolygonStyleInput>(key: K, value: PolygonStyleInput[K]) => {
    const updated = {
      ...editingStyle,
      context: {
        ...editingStyle.context,
        polygon: {
          ...editingStyle.context.polygon,
          [key]: value,
        }
      },
    }
    setEditingStyle(updated);
  }


  return (
    <>
      <StyleInputRow
        title="외각선 너비"
        type="number"
        value={polygonStyle.strokeWidth}
        onChange={val => handlePolygonChange("strokeWidth", Number(val))}
      />
      <StyleInputRow
        title="외각선 색상"
        type="color"
        value={polygonStyle.strokeColor}
        onChange={val => handlePolygonChange("strokeColor", String(val))}
      />
      <StyleInputRow
        title="외각선 투명도"
        type="range"
        value={polygonStyle.strokeOpacity}
        min={0}
        max={1}
        step={0.01}
        onChange={val => handlePolygonChange("strokeOpacity", Number(val))}
      />
      {/*외각선 패턴 추가*/}
      <StyleInputRow
        title="채우기 색상"
        type="color"
        value={polygonStyle.fillColor}
        onChange={val => handlePolygonChange("fillColor", String(val))}
      />
      <StyleInputRow
        title="채우기 투명도"
        type="range"
        value={polygonStyle.fillOpacity}
        min={0}
        max={1}
        step={0.01}
        onChange={val => handlePolygonChange("fillOpacity", Number(val))}
      />
    {/*  채우기 패턴 추가*/}
    </>
  );
};

export default PolygonForm;