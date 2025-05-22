import React, {useState} from 'react';
import SymbolPicker from "@src/components/refactor-layer-style/picker/SymbolPicker";
import {StyleInputRow} from "@src/components/layerset/layer/style/StyleInputRow";
import {CompleteIconStyleType} from "@src/components/refactor-layer-style/mapCompleteStyleToUpdateType";
import { PointStyleInput } from "@mnd/shared/src/types/layerset/gql/graphql";

interface IconShapeFormProps {
  iconStyle: CompleteIconStyleType | undefined,
  handleIconChange: <K extends keyof CompleteIconStyleType>(key: K, value: CompleteIconStyleType[K]) => void;
  handlePointChange: <K extends keyof PointStyleInput>(key: K, value: PointStyleInput[K]) => void;
}

const IconShapeForm = ({iconStyle, handleIconChange, handlePointChange}: IconShapeFormProps) => {
  const [isSymbolPickerVisible, setIsSymbolPickerVisible] = useState(false);

  const selectSymbol = (symbolId: string, symbolSrc: string) => {
    const _iconStyle: CompleteIconStyleType = {
      ...iconStyle,
      symbolId,
      images: [symbolSrc]
    }
    handlePointChange("iconStyle", _iconStyle);
  };

  return (
    <>
      <div className="row">
        <div className="title">아이콘</div>
        <div className="value">
          <div
            className="icon-preview"
            onClick={() => setIsSymbolPickerVisible(true)}
          >
            {
              iconStyle?.images?.length > 0 ? (
                <img
                  src={iconStyle.images[0]}
                  alt="심볼 이미지"
                />
              ) : (
                <div className="no-icon">/</div>
              )
            }
          </div>
        </div>
      </div>
      <StyleInputRow
        title="이미지 배율"
        type="range"
        value={iconStyle?.scale ?? 1}
        min={0.1}
        max={2}
        step={0.1}
        onChange={val => handleIconChange("scale", Number(val))}
      />
      {isSymbolPickerVisible && (
        <SymbolPicker
          onSelect={(id: string, src: string) => selectSymbol(id, src)}
          onClose={() => setIsSymbolPickerVisible(false)}
        />
      )}
    </>
  );
};

export default IconShapeForm;