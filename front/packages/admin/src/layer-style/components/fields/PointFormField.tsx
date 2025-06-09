import React, {useState} from 'react';
import {EditableContextModel} from "@src/layer-style/models/EditableContextModel";
import {PreviewColumn, ShapeType} from "@mnd/shared/src/types/layerset/gql/graphql";
import {FieldRow} from "@src/layer-style/components/fields/FieldRow";
import SymbolPicker from "@src/layer-style/components/fields/picker/SymbolPicker";
import LabelFormField from "@src/layer-style/components/fields/LabelFormField";
import CommonFormField from "@src/layer-style/components/fields/CommonFormField";

interface PointFormFieldProps {
  context: EditableContextModel;
  onChange: <K extends keyof EditableContextModel>(field: K, value: EditableContextModel[K]) => void;
  attributes?: PreviewColumn[];
  isAttribute?: boolean;
}

const PointFormField = ({context, onChange, attributes, isAttribute = false}: PointFormFieldProps) => {
  const [isSymbolPickerVisible, setIsSymbolPickerVisible] = useState(false);
  const selectSymbol = (symbolId: string, symbolSrc: string) => {
    onChange("iconSymbolId", symbolId);
    onChange("iconImage", symbolSrc);
  }

  return (
    <>
      <CommonFormField context={context} onChange={onChange} />

      <FieldRow
        id="isIcon"
        label="포인트 스타일"
        type="select"
        value={context.isIcon ? "true" : "false"}
        onChange={value => onChange("isIcon", value === "true")}
        options={[
          {value: "false", label: "점"},
          {value: "true", label: "아이콘"},
        ]}
      />

      {context.isIcon ? (
        <>
          <div className="form-row">
            <label htmlFor="iconImage">아이콘</label>
            <div
              className="icon-preview"
              onClick={() => setIsSymbolPickerVisible(true)}
            >
              {context.iconImage
                ? (<img src={context.iconImage} alt="아이콘 이미지"/>)
                : (<div className="no-icon">{"/"}</div>)}
            </div>
          </div>
          {isSymbolPickerVisible && (
            <SymbolPicker
              onSelect={(id: string, src: string) => selectSymbol(id, src)}
              onClose={() => setIsSymbolPickerVisible(false)}
            />
          )}
          <FieldRow
            id="iconScale"
            label="아이콘 배율"
            type="number"
            min={0}
            max={2}
            step={0.1}
            value={context.iconScale}
            onChange={value => onChange("iconScale", value)}
          />
        </>
      ) : (
        <>
          <FieldRow
            id="size"
            label="포인트 크기"
            type="number"
            value={context.size}
            onChange={value => onChange("size", value)}
          />

          {
            !isAttribute && (
              <>
                <FieldRow
                  id="fillColor"
                  label="채우기 색상"
                  type="color"
                  value={context.fillColor}
                  onChange={value => onChange("fillColor", value)}
                />

                <FieldRow
                  id="fillOpacity"
                  label="채우기 투명도"
                  type="number"
                  min={0}
                  max={1}
                  step={0.01}
                  value={context.fillOpacity}
                  onChange={value => onChange("fillOpacity", value)}
                />
              </>
            )
          }

          <FieldRow
            id="isShape"
            label="패턴 사용"
            type="checkbox"
            value={context.isShape}
            onChange={value => onChange("isShape", value)}
          />

          {context.isShape &&
            <FieldRow
              id="shape"
              label="채우기 패턴"
              type="select"
              value={context.shape}
              onChange={value => onChange("shape", value)}
              options={[
                {value: ShapeType.Horizontal, label: "가로선"},
                {value: ShapeType.Vertical, label: "세로선"},
                {value: ShapeType.Slash, label: "대각선"},
                {value: ShapeType.Backslash, label: "역대각선"},
                {value: ShapeType.BoldX, label: "엑스"},
                {value: ShapeType.NormalX, label: "격자"},
                {value: ShapeType.Cross, label: "십자"},
              ]}
              isPreviewUnsupported={true}
            />
          }

          <FieldRow
            id="strokeWidth"
            label="외각선 너비"
            type="number"
            value={context.strokeWidth}
            onChange={value => onChange("strokeWidth", value)}
          />

          <FieldRow
            id="strokeColor"
            label="외각선 색상"
            type="color"
            value={context.strokeColor}
            onChange={value => onChange("strokeColor", value)}
          />

          <FieldRow
            id="strokeOpacity"
            label="외각선 투명도"
            type="number"
            min={0}
            max={1}
            step={0.01}
            value={context.strokeOpacity}
            onChange={value => onChange("strokeOpacity", value)}
          />
        </>
      )}

      <FieldRow
        id="isLabel"
        label="라벨 사용"
        type="checkbox"
        value={context.isLabel}
        onChange={value => onChange("isLabel", value)}
      />

      <LabelFormField
        context={context}
        onChange={onChange}
        attributes={attributes}
      />
    </>
  );
};

export default PointFormField;