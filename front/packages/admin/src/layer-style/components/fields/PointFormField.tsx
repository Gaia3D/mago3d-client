import React from 'react';
import {EditableContextModel} from "@src/layer-style/models/EditableContextModel";
import {PreviewColumn} from "@mnd/shared/src/types/layerset/gql/graphql";
import {FieldRow} from "@src/layer-style/components/fields/FieldRow";

interface PointFormFieldProps {
  context: EditableContextModel;
  onChange: <K extends keyof EditableContextModel>(field: K, value: EditableContextModel[K]) => void;
  attributes?: PreviewColumn[];
}

const PointFormField = ({context, onChange, attributes}: PointFormFieldProps) => {
  return (
    <>
      <FieldRow
        id="name"
        label="스타일명"
        type="text"
        value={context.name}
        onChange={value => onChange("name", value)}
      />

      <FieldRow
        id="minScale"
        label="최소 축적"
        type="number"
        value={context.minScale}
        onChange={value => onChange("minScale", value)}
      />

      <FieldRow
        id="maxScale"
        label="최대 축적"
        type="number"
        value={context.maxScale}
        onChange={value => onChange("maxScale", value)}
      />

      <FieldRow
        id="isIcon"
        label="포인트 스타일"
        type="select"
        value={context.isIcon ? "true" : "false"}
        onChange={value => onChange("isIcon", value === "true")}
        options={[
          { value: "false", label: "점" },
          { value: "true", label: "아이콘" },
        ]}
      />

      {context.isIcon ? (
        <>

        </>
      ):(
        <>
          <FieldRow
            id="size"
            label="포인트 크기"
            type="number"
            value={context.size}
            onChange={value => onChange("size", value)}
          />

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
            label="채우기 투명도"
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
      
      {context.isLabel && (
        <div className="inner-body">
          <FieldRow
            id="attribute"
            label="라벨 속성"
            type="select"
            value={context.attribute}
            onChange={value => onChange("attribute", value)}
            options={attributes?.map(attr => ({ value: attr.field, label: attr.field }))}
          />
      
          <FieldRow
            id="labelFontSize"
            label="라벨 폰트 크기"
            type="number"
            value={context.labelFontSize}
            onChange={value => onChange("labelFontSize", value)}
          />

          <FieldRow
            id="labelFillColor"
            label="라벨 폰트 색상"
            type="color"
            value={context.labelFillColor}
            onChange={value => onChange("labelFillColor", value)}
          />

          <FieldRow
            id="labelFillOpacity"
            label="라벨 폰트 투명도"
            type="number"
            min={0}
            max={1}
            step={0.01}
            value={context.labelFillOpacity}
            onChange={value => onChange("labelFillOpacity", value)}
          />

          <FieldRow
            id="isHalo"
            label="라벨 테두리 사용"
            type="checkbox"
            value={context.isHalo}
            onChange={value => onChange("isHalo", value)}
          />
          {context.isHalo && (
            <div className="inner-body">
              <FieldRow
                id="haloFillColor"
                label="테두리 색상"
                type="color"
                value={context.haloFillColor}
                onChange={value => onChange("haloFillColor", value)}
              />

              <FieldRow
                id="haloFillOpacity"
                label="테두리 투명도"
                type="number"
                min={0}
                max={1}
                step={0.01}
                value={context.haloFillOpacity}
                onChange={value => onChange("haloFillOpacity", value)}
              />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default PointFormField;