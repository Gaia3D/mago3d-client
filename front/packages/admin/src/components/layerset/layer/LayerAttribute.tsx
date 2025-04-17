import React, {useEffect, useState} from 'react';
import {LayerAsset} from "@src/generated/gql/layerset/graphql";
import {useSuspenseQuery} from "@apollo/client";
import { AttributeByNativeNameDocument } from '@mnd/shared/src/types/layerset/gql/graphql';
import { v4 as uuidv4 } from 'uuid';
import AttributeCategoryContainer from "@src/components/layerset/layer/attribure/AttributeTableContainer";

interface LayerAttributeProps {
  asset: LayerAsset;
}

export interface attributeCategoryType {
  __typename?: 'LayerAttribute',
  id: string,
  categoryName: string,
  sortOrder?: number | null,
  properties: Array<attributePropertyType>
}

export interface attributePropertyType {
  __typename?: 'LayerAttributeProperty',
  id: string,
  field: string,
  value?: string | null,
  label?: string | null,
  weight?: number | null,
  sortOrder?: number | null
}

const tempBasePropArr: attributePropertyType[] = [
  {
    id: "bp1",
    field: "abc123",
    label: "유역코드",
    weight: 1
  },{
    id: "bp2",
    field: "abc234",
    label: "유역면적",
    weight: 1
  },{
    id: "bp3",
    field: "abc345",
    label: "유역둘레",
    weight: 2
  }
]

const LayerAttribute = ({asset}: LayerAttributeProps) => {
  const assetName = asset.properties.layer.name;
  const { data } = useSuspenseQuery(AttributeByNativeNameDocument,{
    variables: {
      name: assetName
    }
  });

  const [basePropArr, setBasePropArr] = useState<attributePropertyType[]>(tempBasePropArr)
  const [categoryArr, setCategoryArr] = useState<attributeCategoryType[]>(data.attributeByNativeName);

  const handleCategoryName = (categoryId: string, categoryName: string) => {
    setCategoryArr(prev =>
      prev.map(category =>
        category.id === categoryId ? { ...category, categoryName } : category
      )
    );
  };

  const handlePropWeight = (propId: string, weight: number) => {
    setCategoryArr(prev =>
      prev.map(group => ({
        ...group,
        properties: group.properties.map(prop =>
          prop.id === propId ? {...prop, weight} : prop
        )
      }))
    );
  }

  const handlePropLabel = (propId: string, label: string) => {
    setCategoryArr(prev =>
      prev.map(group => ({
        ...group,
        properties: group.properties.map(prop =>
          prop.id === propId ? {...prop, label} : prop
        )
      }))
    );
  }

  const createCategory = () => {
    const newGroupId = uuidv4();
    const newGroup = {
      id: newGroupId,
      categoryName: `group-${categoryArr.length + 1}`,
      properties: []
    };

    setCategoryArr(prev => [...prev, newGroup]);
  };

  const removeCategory = (categoryId: string) => {
    setCategoryArr(prev => prev.filter(category => category.id !== categoryId));
  };

  const removeProp = (categoryId: string, propId: string) => {
    setCategoryArr(prev =>
      prev.map(category =>
        category.id === categoryId
          ? {
            ...category,
            properties: category.properties.filter(prop => prop.id !== propId),
          }
          : category
      )
    );
  };

  return (
    <div className="layer-attribute-container">
      <div className="left-container">
        <div className="attribute-section">
          <div className="section-header">레이어 속성 정보</div>
          <div className="section-body">
            {basePropArr.map((prop) => (
              <div key={prop.id} className="base-prop-box">
              <div>{prop.field}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="category-section">
          <div className="section-header">
            테이블 정보
            <button onClick={createCategory}>+</button>
          </div>
          <div className="section-body">
            {categoryArr.map((category) =>
              (<div key={category.id} className="category-box">
                <div className="category-box-header">
                  <div>
                    <input
                      type="text"
                      value={category.categoryName}
                      onChange={(e) => {
                        handleCategoryName(category.id, e.target.value);
                      }}
                    >
                    </input>
                  </div>
                  <button className="remove-category-button" onClick={() => removeCategory(category.id)}>
                  &times;
                </button>
                </div>
                {category.properties.map((prop) => (
                  <div key={prop.id} className="prop-box">
                    <div className="prop-box-header">
                      <div>{prop.field}</div>
                      <div className="header-right">
                        <input
                          type="number"
                          min={1}
                          max={3}
                          value={prop.weight}
                          onChange={(e) => {
                            handlePropWeight(prop.id, Number(e.target.value));
                          }}
                        />
                        <button className="remove-category-button" onClick={() => removeProp(category.id, prop.id)}>
                          &times;
                        </button>
                      </div>
                    </div>
                    <div className="prop-box-body">
                      <input
                        type="text"
                        value={prop.label}
                        onChange={(e) => {
                          handlePropLabel(prop.id, e.target.value)
                        }}
                      ></input>
                    </div>
                  </div>
                ))}
              </div>)
            )}
          </div>
        </div>
      </div>
      <AttributeCategoryContainer categoryArr={categoryArr} />
    </div>
  );
};

export default LayerAttribute;