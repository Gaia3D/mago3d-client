import React, { useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import {
  ClassifyAttributeDocument,
  ClassifyAttributeQuery
} from '@src/generated/gql/layerset/graphql';
import { useRecoilValue } from 'recoil';
import { selectedAssetState } from '@src/recoils/LayerStyle';
import {Maybe, PreviewColumnsQuery, Scalars} from '@mnd/shared/src/types/layerset/gql/graphql';

interface AttributeStyleSelectorProps {
  attributeData?: PreviewColumnsQuery;
  style: Maybe<Scalars['JSON']['output']>,
  handleChangeContext: (key: string, value: string | number | boolean) => void;
}

const AttributeStyleSelector = ({ attributeData, style, handleChangeContext }: AttributeStyleSelectorProps) => {
  const asset = useRecoilValue(selectedAssetState);
  const assetName = asset?.properties?.layer?.name;
  const firstField = attributeData?.previewColumns?.[0]?.field;

  const [attributeField, setAttributeField] = useState(firstField);
  const [fetchAttributes] = useLazyQuery(ClassifyAttributeDocument);
  const [data, setData] = useState<ClassifyAttributeQuery | undefined>(undefined)

  useEffect(() => {
    if (!attributeField && firstField) {
      setAttributeField(firstField);
    }
  }, [firstField]);

  useEffect(() => {
    if (!attributeField || !assetName) return;

    fetchAttributes({
      variables: {
        nativeName: assetName,
        attribute: attributeField,
      },
    }).then(result => {
      setData(result.data);
    });
  }, [attributeField, assetName, fetchAttributes]);

  const options = attributeData?.previewColumns?.map((col) => ({
    label: col.field,
    value: col.field,
  })) ?? [];

  useEffect(() => {
    console.log("data", data);
  }, [data]);

  return (
    <div className="attribute-style-container">
      <select value={attributeField} onChange={(e) => setAttributeField(e.target.value)}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <div>
        {
          data && (
            data.classifyAttribute.type === "NUMBER" ?
              <div>
                {data.classifyAttribute.rules.map((rule, idx) => (
                  <div key={idx} style={{display: "flex", justifyContent: "space-between"}}>
                    <div>min: {rule.min}</div>
                    <div>max: {rule.max}</div>
                    <div>max: {rule.color}</div>
                  </div>
                ))}
              </div> :
              data.classifyAttribute.type === "STRING" ?
                <div>
                  {data.classifyAttribute.rules.map((rule, idx) => (
                    <div key={idx} style={{display: "flex", justifyContent: "space-between"}}>
                      <div>value: {rule.eq}</div>
                      <div>color: {rule.color}</div>
                    </div>
                  ))}
                </div> :
                null
          )
        }
      </div>
    </div>
  );
};

export default AttributeStyleSelector;
