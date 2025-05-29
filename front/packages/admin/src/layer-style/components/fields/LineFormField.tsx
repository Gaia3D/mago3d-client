import React from 'react';
import {EditableContextModel} from "@src/layer-style/models/EditableContextModel";
import {PreviewColumn} from "@mnd/shared/src/types/layerset/gql/graphql";

interface LineFormFieldProps {
  context: EditableContextModel;
  onChange: <K extends keyof EditableContextModel>(field: K, value: EditableContextModel[K]) => void;
  attributes?: PreviewColumn[];
}

const LineFormField = ({context, onChange, attributes}: LineFormFieldProps) => {
  return (
    <div>
      
    </div>
  );
};

export default LineFormField;