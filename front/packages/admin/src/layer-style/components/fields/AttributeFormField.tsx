import React from 'react';
import {EditableContextModel} from "@src/layer-style/models/EditableContextModel";
import {PreviewColumn} from "@mnd/shared/src/types/layerset/gql/graphql";

interface AttributeFormFieldProps {
  context: EditableContextModel;
  onChange: <K extends keyof EditableContextModel>(field: K, value: EditableContextModel[K]) => void;
  attributes?: PreviewColumn[];
}

const AttributeFormField = ({context, onChange, attributes}: AttributeFormFieldProps) => {
  return (
    <div>
      
    </div>
  );
};

export default AttributeFormField;