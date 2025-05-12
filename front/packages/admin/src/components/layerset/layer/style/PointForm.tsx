import React, {useState} from 'react';
import {StyleInputRow} from "@src/components/layerset/layer/style/StyleInputRow";
import {Maybe, Scalars} from "@mnd/shared/src/types/layerset/gql/graphql";
import {StyleSelectRow} from "@src/components/layerset/layer/style/StyleSelectRow";
import reactSvg from "@src/assets/images/react.svg";
import SymbolPicker from "@src/components/layerset/layer/style/SymbolPicker";

interface PointFormProps {
  style: Maybe<Scalars['JSON']['output']>,
  handleChangeContext: (key: string, value: string | number) => void
}

const PointForm = ({style, handleChangeContext}: PointFormProps) => {
  const [isSymbolPickerVisible, setIsSymbolPickerVisible] = useState(false);
  return (
    <div>
      <StyleInputRow
        title="스타일명"
        type="text"
        value={style.name ?? ""}
        onChange={val => handleChangeContext("name", val)}
      />
      <StyleInputRow
        title="최소 스케일"
        type="number"
        value={style.minScale ?? 0}
        onChange={val => handleChangeContext("minScale", val)}
      />
      <StyleInputRow
        title="최대 스케일"
        type="number"
        value={style.maxScale ?? 0}
        onChange={val => handleChangeContext("maxScale", val)}
      />
      <StyleSelectRow
        title="점 모양"
        value={style.pointType ?? "point"}
        onChange={val => handleChangeContext("pointType", val)}
        options={[{label: "점", value: "point"}, {label: "아이콘", value: "icon"}]}
      />
      {
        style.pointType === "point" ?
          <>
            <StyleInputRow
              title="점 크기"
              type="number"
              value={style.pixelSize ?? 1}
              onChange={val => handleChangeContext("pixelSize", val)}
            />
            <StyleInputRow
              title="외각선 너비"
              type="number"
              value={style.strokeWidth ?? 0}
              onChange={val => handleChangeContext("strokeWidth", val)}
            />
            <StyleInputRow
              title="외각선 색상"
              type="color"
              value={style.strokeColor ?? "#000"}
              onChange={val => handleChangeContext("strokeColor", val)}
            />
            <StyleInputRow
              title="외각선 투명도"
              type="range"
              value={style.strokeOpacity ?? 0}
              min={0}
              max={1}
              step={0.01}
              onChange={val => handleChangeContext("strokeOpacity", val)}
            />
          </> :
          <>
            <div className="row">
              <div className="title">아이콘</div>
              <div className="value">
                <img
                  src={style.symbol ?? reactSvg}
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
              value={style.scale ?? 1}
              min={0.1}
              max={2}
              step={0.1}
              onChange={val => handleChangeContext("scale", val)}
            />
          </>
      }
    </div>
  );
};

export default PointForm;