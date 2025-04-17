import React, {useRef} from 'react';
import {useDrag, useDrop} from "react-dnd";
import {attributeCategoryType, attributePropertyType, DragItem} from "@src/components/layerset/layer/LayerAttribute";
import PropBox from "@src/components/layerset/layer/attribure/PropBox";

const CategoryBox = ({
   category,
   index,
   moveCategory,
   handleAddPropToCategory,
   moveProp,
   handleCategoryName,
   removeCategory,
   handlePropWeight,
   removeProp,
   handlePropLabel
 }: {
  category: attributeCategoryType;
  index: number;
  moveCategory: (from: number, to: number) => void;
  handleAddPropToCategory: (categoryId: string, prop: attributePropertyType) => void;
  moveProp: (fromId: string, toId: string, fromIdx: number, toIdx: number, propId: string) => void;
  handleCategoryName: (categoryId: string, categoryName: string) => void;
  removeCategory: (categoryId: string) => void;
  handlePropWeight: (propId: string, weight: number) => void;
  removeProp: (categoryId: string, propId: string) => void;
  handlePropLabel: (propId: string, label: string) => void;
}) => {
  const ref = useRef(null);

  const [, drop] = useDrop({
    accept: ['BASE_PROP', 'CATEGORY', 'PROP'],
    drop(item: DragItem) {
      if (item.type === 'BASE_PROP' && item.prop) {
        handleAddPropToCategory(category.id, item.prop);
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
    <div ref={ref} key={category.id} className="category-box">
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
        <button
          className="remove-category-button"
          onClick={() => removeCategory(category.id)}
        >
          &times;
        </button>
      </div>
      {category.properties.map((prop, i) => (
        <PropBox
          key={prop.id}
          prop={prop}
          index={i}
          categoryId={category.id}
          moveProp={moveProp}
          handlePropWeight={handlePropWeight}
          removeProp={removeProp}
          handlePropLabel={handlePropLabel}
        />
      ))}
    </div>
  );
};
export default CategoryBox;