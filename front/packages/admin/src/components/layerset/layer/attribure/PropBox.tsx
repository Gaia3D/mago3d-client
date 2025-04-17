import React, {Dispatch, SetStateAction, useRef} from 'react';
import {useDrag, useDrop} from "react-dnd";
import {attributeCategoryType, attributePropertyType} from "@src/components/layerset/layer/LayerAttribute";
import {DragItem} from "@src/components/layerset/layer/attribure/CategoryBox";

interface PropBoxProps {
  prop: attributePropertyType;
  index: number;
  categoryId: string;
  setCategoryArr: Dispatch<SetStateAction<attributeCategoryType[]>>;
}

const PropBox = ({prop, index, categoryId, setCategoryArr }: PropBoxProps) => {
  const ref = useRef(null);

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

  const [, drop] = useDrop({
    accept: 'PROP',
    hover(item: DragItem) {
      if (item.type === 'PROP' && (item.propId !== prop.id || item.categoryId !== categoryId)) {
        moveProp(item.categoryId!, categoryId, item.index!, index, item.propId!);
        item.index = index;
        item.categoryId = categoryId;
      }
    },
  });

  const [, drag] = useDrag({
    type: 'PROP',
    item: {type: 'PROP', categoryId, index, propId: prop.id},
  });

  drag(drop(ref));

  return (
    <div ref={ref} key={prop.id} className="prop-box">
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
          <button
            className="remove-category-button"
            onClick={() => removeProp(categoryId, prop.id)}
          >
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
  )
};


export default PropBox;