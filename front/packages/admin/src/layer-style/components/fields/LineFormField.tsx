import React from 'react';
import {EditableContextModel} from "@src/layer-style/models/EditableContextModel";
import {LineStyle, PreviewColumn} from "@mnd/shared/src/types/layerset/gql/graphql";
import {FieldRow} from "@src/layer-style/components/fields/FieldRow";
import LabelFormField from "@src/layer-style/components/fields/LabelFormField";
import CommonFormField from "@src/layer-style/components/fields/CommonFormField";

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

      <FieldRow
        id="strokeDasharray"
        label="외각선 종류"
        type="select"
        value={context.strokeDasharray}
        onChange={value => onChange("strokeDasharray", value)}
        options={[
          {value: LineStyle.Solid, label: "실선"},
          {value: LineStyle.Dotted, label: "점선"},
          {value: LineStyle.Dashed, label: "파선"},
          {value: LineStyle.DashSingle, label: "1점쇄선"},
          {value: LineStyle.DashDouble, label: "2점쇄선"},
        ]}
        isPreviewUnsupported={true}
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