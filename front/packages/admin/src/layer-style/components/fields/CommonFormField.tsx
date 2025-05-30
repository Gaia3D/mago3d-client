import React from 'react';
import {FieldRow} from "@src/layer-style/components/fields/FieldRow";
import {toast} from "react-toastify";
import {EditableContextModel} from "@src/layer-style/models/EditableContextModel";

interface CommonFormFieldProps {
  context: EditableContextModel;
  onChange: <K extends keyof EditableContextModel>(field: K, value: EditableContextModel[K]) => void;
}

const CommonFormField = ({context, onChange}: CommonFormFieldProps) => {
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
        label="최소 축척"
        type="number"
        value={context.minScale}
        onChange={value => {
          if (context.maxScale && value >= context.maxScale) {
            toast.warn("최소 축척은 최대 축척보다 작아야 합니다.");
            return;
          }
          onChange("minScale", value);
        }}
      />

      <FieldRow
        id="maxScale"
        label="최대 축척"
        type="number"
        value={context.maxScale}
        onChange={value => {
          if (value <= context.minScale) {
            toast.warn("최대 축척은 최소 축척보다 커야 합니다.");
            return;
          }
          onChange("maxScale", value);
        }}
      />

    </>
  );
};

export default CommonFormField;