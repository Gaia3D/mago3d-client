import React, {useEffect, useState} from 'react';
import {IconStyleInput, PointStyleInput} from "@mnd/shared/src/types/layerset/gql/graphql";
import reactSvg from "@src/assets/images/react.svg";
import SymbolPicker from "@src/components/refactor-layer-style/picker/SymbolPicker";

interface IconShapeFormProps {
  pointStyle: PointStyleInput,
  handleChange: <K extends keyof PointStyleInput>(key: K, value: PointStyleInput[K]) => void;
}

const IconShapeForm = ({pointStyle, handleChange}: IconShapeFormProps) => {
  const [isSymbolPickerVisible, setIsSymbolPickerVisible] = useState(false);
  const [iconStyle, setIconStyle] = useState<IconStyleInput | undefined>(undefined);

  const [selectedSymbolId, setSelectedSymbolId] = useState("");
  const [selectedSymbolSrc, setSelectedSymbolSrc] = useState("");

  const selectSymbol = (symbolId: string, symbolSrc: string) => {
    setSelectedSymbolId(symbolId);
    setSelectedSymbolSrc(symbolSrc);
  }

  useEffect(() => {
    setIconStyle(prev => ({
      ...prev,
      symbolId: selectedSymbolId
    }))
  }, [selectedSymbolId]);

  useEffect(() => {
    handleChange("iconStyle", iconStyle);
  }, [iconStyle]);

  return (
    <div>
      <div className="row">
        <div className="title">아이콘</div>
        <div className="value">
          <img
            src={selectedSymbolSrc ?? reactSvg} // 후에 심볼 id 로 경로 얻어서 넣을것
            alt="심볼 이미지"
            onClick={() => setIsSymbolPickerVisible(true)}
            style={{width: 40, height: 40, cursor: 'pointer'}}
          />
        </div>
        {isSymbolPickerVisible && (
          <SymbolPicker
            onSelect={(id: string, src: string) => selectSymbol(id, src)}
            onClose={() => setIsSymbolPickerVisible(false)}
          />
        )}
        {/*<StyleInputRow*/}
        {/*  title="이미지 배율"*/}
        {/*  type="range"*/}
        {/*  value={ctx.scale ?? 1}*/}
        {/*  min={0.1}*/}
        {/*  max={2}*/}
        {/*  step={0.1}*/}
        {/*  onChange={val => handleChangeContext("scale", val)}*/}
        {/*/>*/}
      </div>
    </div>
  );
};

export default IconShapeForm;