import React from 'react';
import {FieldRow} from "@src/layer-style/components/fields/FieldRow";
import {EditableContextModel} from "@src/layer-style/models/EditableContextModel";
import {PreviewColumn} from "@mnd/shared/src/types/layerset/gql/graphql";

interface LabelFormFieldProps {
  context: EditableContextModel;
  onChange: <K extends keyof EditableContextModel>(field: K, value: EditableContextModel[K]) => void;
  attributes?: PreviewColumn[];
}

const LabelFormField = ({context, onChange, attributes}: LabelFormFieldProps) => {
  if (!context.isLabel) return null;
  return (
    <div className="inner-body">
      <FieldRow
        id="labelAttribute"
        label="라벨 속성"
        type="select"
        value={context.labelAttribute}
        onChange={value => onChange("labelAttribute", value)}
        options={attributes?.map(attr => ({value: attr.field, label: attr.field}))}
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
  );
};

export default LabelFormField;