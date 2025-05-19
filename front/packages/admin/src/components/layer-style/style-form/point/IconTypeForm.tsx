import React, {useState} from 'react';
import reactSvg from "@src/assets/images/react.svg";
import SymbolPicker from "@src/components/layerset/layer/style/SymbolPicker";
import {StyleInputRow} from "@src/components/layerset/layer/style/StyleInputRow";
import {Maybe, RuleStyleInput, Scalars} from "@mnd/shared/src/types/layerset/gql/graphql";

interface IconTypeForm {
  ctx: Maybe<Scalars['JSON']['output']>,
  handleChangeContext: (key: string, value: string | number | boolean | RuleStyleInput[]) => void;
}

const IconTypeForm = ({ctx, handleChangeContext}: IconTypeForm) => {
  const [isSymbolPickerVisible, setIsSymbolPickerVisible] = useState(false);
  return (
    <>
      <div className="row">
        <div className="title">아이콘</div>
        <div className="value">
          <img
            src={ctx.symbol ?? reactSvg}
            alt="심볼 이미지"
            onClick={() => setIsSymbolPickerVisible(true)}
            style={{width: 40, height: 40, cursor: 'pointer'}}
          />
        </div>
      </div>
      {isSymbolPickerVisible && (
        <SymbolPicker
          onSelect={(src: string) => handleChangeContext("symbol", src)}
          onClose={() => setIsSymbolPickerVisible(false)}
        />
      )}
      <StyleInputRow
        title="이미지 배율"
        type="range"
        value={ctx.scale ?? 1}
        min={0.1}
        max={2}
        step={0.1}
        onChange={val => handleChangeContext("scale", val)}
      />
    </>
  );
};

export default IconTypeForm;