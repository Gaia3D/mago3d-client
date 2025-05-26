import React, {useEffect, useState} from 'react';
import {FontStyle, LabelStyleInput, PreviewColumnsQuery} from "@mnd/shared/src/types/layerset/gql/graphql";
import {StyleSelectRow} from "@src/components/layerset/layer/style/StyleSelectRow";
import {StyleInputRow} from "@src/components/layerset/layer/style/StyleInputRow";
import {ToggleRow} from "@src/components/layerset/layer/style/ToggleRow";

interface LabelFormProps {
  labelStyle: LabelStyleInput,
  handleLabelStyleChange: <K extends keyof LabelStyleInput>(key: K, value: LabelStyleInput[K]) => void,
  attributes: PreviewColumnsQuery;
}

const LabelForm = ({labelStyle, handleLabelStyleChange, attributes}: LabelFormProps) => {

  const [haloFillColor, setHaloFillColor] = useState(labelStyle?.halo?.fillColor);
  const [isHaloUsed, setIsHaloUsed] = useState(!!labelStyle?.halo?.fillColor);

  useEffect(() => {
    const _halo = {
      fillColor: haloFillColor,
      fillOpacity: isHaloUsed ? 1 : 0
    }
    handleLabelStyleChange("halo", _halo);
  }, [haloFillColor, isHaloUsed]);

  return (
    <>
      <StyleSelectRow
        title="속성"
        value={labelStyle?.attributeName}
        onChange={val => handleLabelStyleChange("attributeName", val)}
        options={attributes.previewColumns.map((data) => {
          return {label: data.field, value: data.field}
        })}
      />
      {/*<StyleSelectRow*/}
      {/*  title="폰트 스타일"*/}
      {/*  value={labelStyle?.fontStyle ?? FontStyle.Normal}*/}
      {/*  onChange={val => handleLabelStyleChange("fontStyle", val as FontStyle)}*/}
      {/*  options={[*/}
      {/*    {label: FontStyle.Normal, value: FontStyle.Normal},*/}
      {/*    {label: FontStyle.Italic, value: FontStyle.Italic},*/}
      {/*    {label: FontStyle.Oblique, value: FontStyle.Oblique},*/}
      {/*  ]}*/}
      {/*/>*/}
      <StyleInputRow
        title="폰트 사이즈"
        type="number"
        value={labelStyle.fontSize}
        onChange={val => handleLabelStyleChange("fontSize", Number(val))}
      />
      <StyleInputRow
        title="폰트 색상"
        type="color"
        value={labelStyle.fillColor}
        onChange={val => handleLabelStyleChange("fillColor", String(val))}
      />
      <ToggleRow
        title="테두리 사용"
        enabled={isHaloUsed}
        onToggle={(val: boolean) => setIsHaloUsed(val)}
      />
      {isHaloUsed &&
        <StyleInputRow
          title="테두리 색상"
          type="color"
          value={labelStyle.halo.fillColor}
          onChange={val => setHaloFillColor(String(val))}
        />
      }
  {/*
  fillGraphic
  fillOpacity
  fontFamily
  fontWeight
  halo
  linePlacement   // offset 추후 자동으로 들어가게하기
  pointPlacement
  */}
    </>
  );
};

export default LabelForm;