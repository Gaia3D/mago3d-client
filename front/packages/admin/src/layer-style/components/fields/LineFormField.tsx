import React from 'react';
import {EditableContextModel, LayerType} from "@src/layer-style/models/EditableContextModel";
import {PreviewColumn} from "@mnd/shared/src/types/layerset/gql/graphql";
import {FieldRow} from "@src/layer-style/components/fields/FieldRow";
import LabelFormField from "@src/layer-style/components/fields/LabelFormField";
import CommonFormField from "@src/layer-style/components/fields/CommonFormField";
import ImageSelectRow from "@src/layer-style/components/fields/ImageSelectRow";

interface LineFormFieldProps {
  context: EditableContextModel;
  onChange: <K extends keyof EditableContextModel>(field: K, value: EditableContextModel[K]) => void;
  attributes?: PreviewColumn[];
  isAttribute?: boolean;
}

const LineFormField = ({context, onChange, attributes, isAttribute = false}: LineFormFieldProps) => {
  return (
    <>
      <CommonFormField context={context} onChange={onChange} />

      <FieldRow
        id="strokeWidth"
        label="외각선 너비"
        type="number"
        value={context.strokeWidth}
        onChange={value => onChange("strokeWidth", value)}
      />

      {!isAttribute && (
        <>
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

      <ImageSelectRow
        id="strokeDasharray"
        label="외각선 종류"
        value={context.strokeDasharray}
        onChange={value => onChange("strokeDasharray", value)}
        type={LayerType.LINE}
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

export default LineFormField;