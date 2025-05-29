import React from 'react';
import {EditableContextModel} from "@src/layer-style/models/EditableContextModel";
import {PreviewColumn} from "@mnd/shared/src/types/layerset/gql/graphql";

interface PolygonFormFieldProps {
  context: EditableContextModel;
  onChange: <K extends keyof EditableContextModel>(field: K, value: EditableContextModel[K]) => void;
  attributes?: PreviewColumn[];
}

const PolygonFormField = ({context, onChange, attributes}: PolygonFormFieldProps) => {
  return (
    <div>
      
    </div>
  );
};

export default PolygonFormField;