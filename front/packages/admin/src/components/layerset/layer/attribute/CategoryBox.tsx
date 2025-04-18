import React, {Dispatch, SetStateAction, useRef} from 'react';
import {useDrag, useDrop} from "react-dnd";
import {attributeCategoryType, attributePropertyType} from "@src/components/layerset/layer/LayerAttribute";
import PropBox from "@src/components/layerset/layer/attribute/PropBox";
import {v4 as uuidv4} from "uuid";

interface CategoryBox {
  category: attributeCategoryType;
  index: number;
  setCategoryArr: Dispatch<SetStateAction<attributeCategoryType[]>>;
}

type DragItemType = 'BASE_PROP' | 'CATEGORY' | 'PROP';

export interface DragItem {
  type: DragItemType;
  index?: number;
  propDndID?: string;
  categoryDndId?: string;
  prop?: attributePropertyType;
}

const CategoryBox = ({category, index, setCategoryArr,}: CategoryBox ) => {
  const ref = useRef(null);

  const handleCategoryName = (categoryDndId: string, categoryName: string) => {
    setCategoryArr(prev =>
      prev.map(category =>
        category.dndId === categoryDndId ? { ...category, categoryName } : category
      )
    );
  };

  const moveCategory = (from: number, to: number) => {
    setCategoryArr(prev => {
      const newArr = [...prev];
      const [moved] = newArr.splice(from, 1);
      newArr.splice(to, 0, moved);
      return newArr;
    });
  };

  const handleAddPropToCategory = (categoryDndId: string, prop: attributePropertyType) => {
    setCategoryArr(prev =>
      prev.map(category =>
        category.dndId === categoryDndId
          ? { ...category, properties: [...category.properties, { ...prop, dndId: uuidv4() }] }
          : category
      )
    );
  };

  const removeCategory = (categoryDndId: string) => {
    setCategoryArr(prev => prev.filter(category => category.dndId !== categoryDndId));
  };

  const [, drop] = useDrop({
    accept: ['BASE_PROP', 'CATEGORY', 'PROP'],
    drop(item: DragItem) {
      if (item.type === 'BASE_PROP' && item.prop) {
        handleAddPropToCategory(category.dndId, item.prop);
      }
    },
    hover(item: DragItem) {
      if (item.type === 'CATEGORY' && item.index !== index) {
        moveCategory(item.index!, index);
        item.index = index;
      }
    },
  });

  const [, drag] = useDrag({
    type: 'CATEGORY',
    item: { type: 'CATEGORY', index },
  });

  drag(drop(ref));

  return (
    <div ref={ref} key={category.dndId} className="category-box">
      <div className="category-box-header">
        <div>
          <input
            type="text"
            value={category.categoryName}
            onChange={(e) => {
              handleCategoryName(category.dndId, e.target.value);
            }}
          >
          </input>
        </div>
        <button
          className="remove-category-button"
          onClick={() => removeCategory(category.dndId)}
        >
          &times;
        </button>
      </div>
      {category.properties.map((prop, i) => (
        <PropBox
          key={prop.dndId}
          prop={prop}
          index={i}
          categoryDndId={category.dndId}
          setCategoryArr={setCategoryArr}
        />
      ))}
    </div>
  );
};
export default CategoryBox;