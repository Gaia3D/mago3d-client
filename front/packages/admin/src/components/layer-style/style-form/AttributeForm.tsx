import React from 'react';
import {Maybe, RuleStyleInput, Scalars} from "@mnd/shared/src/types/layerset/gql/graphql";
import AttributeStyleSelector from "@src/components/layerset/layer/style/AttributeStyleSelector";

interface AttributeFormProps {
  ctx: Maybe<Scalars['JSON']['output']>,
  handleChangeContext: (key: string, value: string | number | boolean | RuleStyleInput[]) => void;

}

const AttributeForm = ({ctx, handleChangeContext}: AttributeFormProps) => {
  return (
    <>
      {/*{attributeData?.previewColumns?.length > 0 && (*/}
      {/*  <AttributeStyleSelector*/}
      {/*    attributeData={attributeData}*/}
      {/*    style={ctx}*/}
      {/*    handleChangeContext={handleChangeContext}*/}
      {/*  />*/}
      {/*)}*/}
    </>
  );
};

export default AttributeForm;