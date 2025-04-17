import React, { useRef, useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { v4 as uuidv4 } from 'uuid';
import {LayerAsset} from "@src/generated/gql/layerset/graphql";
import {useSuspenseQuery} from "@apollo/client";
import {AttributeByNativeNameDocument} from "@mnd/shared/src/types/layerset/gql/graphql";
import AttributeCategoryContainer from "@src/components/layerset/layer/attribure/AttributeTableContainer";
import CategoryBox from "@src/components/layerset/layer/attribure/CategoryBox";
import BasePropBox from "@src/components/layerset/layer/attribure/BasePropBox";

interface LayerAttributeProps {
  asset: LayerAsset;
}
export interface attributePropertyType {
  id: string;
  field: string;
  label?: string | null;
  weight?: number | null;
}

export interface attributeCategoryType {
  id: string;
  categoryName: string;
  properties: attributePropertyType[];
}

type DragItemType = 'BASE_PROP' | 'CATEGORY' | 'PROP';

export interface DragItem {
  type: DragItemType;
  index?: number;
  propId?: string;
  categoryId?: string;
  prop?: attributePropertyType;
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

  const [basePropArr] = useState<attributePropertyType[]>(tempBasePropArr);
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
    const newGroup = {
      id: uuidv4(),
      categoryName: `group-${categoryArr.length + 1}`,
      properties: [],
    };
    setCategoryArr(prev => [...prev, newGroup]);
  };

  const moveCategory = (from: number, to: number) => {
    setCategoryArr(prev => {
      const newArr = [...prev];
      const [moved] = newArr.splice(from, 1);
      newArr.splice(to, 0, moved);
      return newArr;
    });
  };

  const handleAddPropToCategory = (categoryId: string, prop: attributePropertyType) => {
    setCategoryArr(prev =>
      prev.map(cat =>
        cat.id === categoryId
          ? { ...cat, properties: [...cat.properties, { ...prop, id: uuidv4() }] }
          : cat
      )
    );
  };

  const moveProp = (
    fromCategoryId: string,
    toCategoryId: string,
    fromIndex: number,
    toIndex: number,
    propId: string
  ) => {
    setCategoryArr(prev => {
      const newArr = prev.map(c => ({ ...c, properties: [...c.properties] }));
      const fromCat = newArr.find(cat => cat.id === fromCategoryId)!;
      const toCat = newArr.find(cat => cat.id === toCategoryId)!;

      const prop = fromCat.properties.find(p => p.id === propId)!;
      fromCat.properties = fromCat.properties.filter(p => p.id !== propId);
      toCat.properties.splice(toIndex, 0, prop);

      return newArr;
    });
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
    <DndProvider backend={HTML5Backend}>
      <div className="layer-attribute-container">
        <div className="left-container">
          <div className="attribute-section">
            <div className="section-header">레이어 속성 정보</div>
            <div className="section-body">
              {basePropArr.map((prop) => (
                <BasePropBox key={prop.id} prop={prop} />
              ))}
            </div>
          </div>

          <div className="category-section">
            <div className="section-header">
              테이블 정보
              <button onClick={createCategory}>+</button>
            </div>
            <div className="section-body">
              {categoryArr.map((cat, index) => (
                <CategoryBox
                  key={cat.id}
                  category={cat}
                  index={index}
                  moveCategory={moveCategory}
                  handleAddPropToCategory={handleAddPropToCategory}
                  moveProp={moveProp}
                  handleCategoryName={handleCategoryName}
                  removeCategory={removeCategory}
                  handlePropWeight={handlePropWeight}
                  removeProp={removeProp}
                  handlePropLabel={handlePropLabel}
                />
              ))}
            </div>
          </div>
        </div>
        <AttributeCategoryContainer categoryArr={categoryArr} />
      </div>
    </DndProvider>
  );
};

export default LayerAttribute;