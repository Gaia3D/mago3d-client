import React, {useEffect, useState} from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { v4 as uuidv4 } from 'uuid';
import {LayerAsset} from "@src/generated/gql/layerset/graphql";
import {useSuspenseQuery} from "@apollo/client";
import {AttributeByNativeNameDocument, PreviewColumnsDocument} from "@mnd/shared/src/types/layerset/gql/graphql";
import CategoryBox from "@src/components/layerset/layer/attribute/CategoryBox";
import BasePropBox from "@src/components/layerset/layer/attribute/BasePropBox";
import AttributeTableContainer from "@src/components/layerset/layer/attribute/AttributeTableContainer";

interface LayerAttributeProps {
  asset: LayerAsset;
}

export interface attributePropertyType {
  id: string;
  field: string;
  label?: string | null;
  value?: string | null;
  weight?: number | null;
}

export interface attributeCategoryType {
  id: string;
  dndId: string;
  categoryName: string;
  properties: attributePropertyType[];
}

const LayerAttribute = ({asset}: LayerAttributeProps) => {
  const assetName = asset.properties.layer.name;

  const { data: basePropData } = useSuspenseQuery(PreviewColumnsDocument,{
    variables: {
      assetID: asset.id
    }
  });


  const { data: attributeData } = useSuspenseQuery(AttributeByNativeNameDocument,{
    variables: {
      name: assetName
    }
  });

  const [basePropArr, setBasePropArr] = useState<attributePropertyType[]>([]);
  const [categoryArr, setCategoryArr] = useState<attributeCategoryType[]>([]);


  useEffect(() => {
    if (!basePropData?.previewColumns)return;

    const patched = basePropData.previewColumns.map((prop) => ({
      ...prop,
      id: uuidv4(),
      label: prop.field,
      value: prop.value,
      weight: 1,
    }))
    setBasePropArr(patched);
  }, [basePropData]);

  useEffect(() => {
    if (!attributeData?.attributeByNativeName) return;

      const patched = attributeData.attributeByNativeName.map((cat) => ({
        ...cat,
        dndId: uuidv4(),
      }));
      setCategoryArr(patched);
  }, [attributeData]);

  const createCategory = () => {
    const newGroup = {
      id: "",
      dndId: uuidv4(),
      categoryName: `group-${categoryArr.length + 1}`,
      properties: [],
    };
    setCategoryArr(prev => [...prev, newGroup]);
  };

  const save = () => {
    const hasAttributes = attributeData?.attributeByNativeName.length > 0;

    if (hasAttributes) {
      console.log("update");
      console.log("assetId", asset.id);
      console.log("categoryArr", categoryArr);
    } else {
      console.log("create");
      console.log("assetId", asset.id);
      console.log("categoryArr", categoryArr);
    }
  }

  const reset = () => {
    const patched = attributeData.attributeByNativeName.map((cat) => ({
      ...cat,
      dndId: uuidv4(),
    }));
    setCategoryArr(patched);
  }

  return (
    <div className="layer-attribute-container">
      <div className="button-container">
        <button onClick={save}>저장</button>
        <button onClick={reset}>초기화</button>
      </div>
      <DndProvider backend={HTML5Backend}>
        <div className="base-prop-category-container">
          <div className="base-prop-section">
            <div className="section-header">레이어 속성 정보</div>
            <div className="section-body">
              {basePropArr.map((prop) => (
                <BasePropBox key={prop.id} prop={prop}/>
              ))}
            </div>
          </div>
          <div className="category-section">
            <div className="section-header">
              테이블 정보
              <button onClick={createCategory}>+</button>
            </div>
            <div className="section-body">
              {categoryArr.map((category, index) => (
                <CategoryBox
                  key={category.dndId}
                  category={category}
                  index={index}
                  setCategoryArr={setCategoryArr}
                />
              ))}
            </div>
          </div>
        </div>
        <AttributeTableContainer categoryArr={categoryArr}/>
      </DndProvider>
    </div>
  );
};

export default LayerAttribute;