import React from 'react';
import {EditableContextModel} from "@src/layer-style/models/EditableContextModel";
import {PreviewColumn} from "@mnd/shared/src/types/layerset/gql/graphql";
import {FieldRow} from "@src/layer-style/components/fields/FieldRow";
import LabelFormField from "@src/layer-style/components/fields/LabelFormField";

interface PolygonFormFieldProps {
  context: EditableContextModel;
  onChange: <K extends keyof EditableContextModel>(field: K, value: EditableContextModel[K]) => void;
  attributes?: PreviewColumn[];
}

const PolygonFormField = ({context, onChange, attributes}: PolygonFormFieldProps) => {
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
        label="외각선 투명도"
        type="number"
        min={0}
        max={1}
        step={0.01}
        value={context.strokeOpacity}
        onChange={value => onChange("strokeOpacity", value)}
      />

      <FieldRow
        id="isLabel"
        label="라벨 사용"
        type="checkbox"
        value={context.isLabel}
        onChange={value => onChange("isLabel", value)}
      />

      <LabelFormField context={context} onChange={onChange} attributes={attributes} />
    </>
  );
};

export default PolygonFormField;