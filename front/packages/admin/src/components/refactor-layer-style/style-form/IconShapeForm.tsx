import React, {useState} from 'react';
import {IconStyleInput} from "@mnd/shared/src/types/layerset/gql/graphql";
import reactSvg from "@src/assets/images/react.svg";
import SymbolPicker from "@src/components/refactor-layer-style/picker/SymbolPicker";
import {StyleInputRow} from "@src/components/layerset/layer/style/StyleInputRow";
import {CompleteIconStyleType} from "@src/components/refactor-layer-style/mapCompleteStyleToUpdateType";

interface IconShapeFormProps {
  iconStyle: CompleteIconStyleType,
  handleChange: <K extends keyof IconStyleInput>(key: K, value: IconStyleInput[K]) => void;
}

const IconShapeForm = ({iconStyle, handleChange}: IconShapeFormProps) => {
  const [isSymbolPickerVisible, setIsSymbolPickerVisible] = useState(false);

  const [selectedSymbolSrc, setSelectedSymbolSrc] = useState(iconStyle.images[0] ?? reactSvg);

  const selectSymbol = (symbolId: string, symbolSrc: string) => {
    handleChange("symbolId", symbolId);
    setSelectedSymbolSrc(symbolSrc);
  }

  return (
    <div>
      <div className="row">
        <div className="title">아이콘</div>
        <div className="value">
          <img
            src={selectedSymbolSrc}
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
        <StyleInputRow
          title="이미지 배율"
          type="range"
          value={iconStyle.scale ?? 1}
          min={0.1}
          max={2}
          step={0.1}
          onChange={val => handleChange("scale", Number(val))}
        />
      </div>
    </div>
  );
};

export default IconShapeForm;