import React, {Dispatch, SetStateAction, useRef} from 'react';
import {useDrag, useDrop} from "react-dnd";
import {attributeCategoryType, attributePropertyType} from "@src/components/layerset/layer/LayerAttribute";
import {DragItem} from "@src/components/layerset/layer/attribute/CategoryBox";

interface PropBoxProps {
  prop: attributePropertyType;
  index: number;
  categoryDndId: string;
  setCategoryArr: Dispatch<SetStateAction<attributeCategoryType[]>>;
}

const PropBox = ({prop, index, categoryDndId, setCategoryArr }: PropBoxProps) => {
  const ref = useRef(null);

  const moveProp = (
    fromCategoryId: string,
    toCategoryId: string,
    fromIndex: number,
    toIndex: number,
    propDndId: string
  ) => {
    setCategoryArr(prev => {
      const newArr = prev.map(c => ({ ...c, properties: [...c.properties] }));
      const fromCat = newArr.find(cat => cat.dndId === fromCategoryId)!;
      const toCat = newArr.find(cat => cat.dndId === toCategoryId)!;

      const prop = fromCat.properties.find(p => p.dndId === propDndId)!;
      fromCat.properties = fromCat.properties.filter(p => p.dndId !== propDndId);
      toCat.properties.splice(toIndex, 0, prop);

      return newArr;
    });
  };

  const handlePropWeight = (propDndId: string, weight: number) => {
    setCategoryArr(prev =>
      prev.map(group => ({
        ...group,
        properties: group.properties.map(prop =>
          prop.dndId === propDndId ? {...prop, weight} : prop
        )
      }))
    );
  }

  const handlePropLabel = (propDndId: string, label: string) => {
    setCategoryArr(prev =>
      prev.map(group => ({
        ...group,
        properties: group.properties.map(prop =>
          prop.dndId === propDndId ? {...prop, label} : prop
        )
      }))
    );
  }

  const removeProp = (categoryDndId: string, propDndId: string) => {
    setCategoryArr(prev =>
      prev.map(category =>
        category.dndId === categoryDndId
          ? {
            ...category,
            properties: category.properties.filter(prop => prop.dndId !== propDndId),
          }
          : category
      )
    );
  };

  const [, drop] = useDrop({
    accept: 'PROP',
    hover(item: DragItem) {
      if (item.type === 'PROP' && (item.propDndID !== prop.dndId || item.categoryDndId !== categoryDndId)) {
        moveProp(item.categoryDndId!, categoryDndId, item.index!, index, item.propDndID!);
        item.index = index;
        item.categoryDndId = categoryDndId;
      }
    },
  });

  const [, drag] = useDrag({
    type: 'PROP',
    item: {type: 'PROP', categoryDndId, index, propDndID: prop.dndId}
  });

  drag(drop(ref));

  return (
    <div className='prop-box-wrapper'>
      <div ref={ref} key={prop.dndId} className="prop-box">
        <div className="prop-box-header">
          <div>{prop.field}</div>
          <div className="header-right">
            <input
              type="number"
              min={1}
              max={4}
              value={prop.weight}
              onChange={(e) => {
                handlePropWeight(prop.dndId, Number(e.target.value));
              }}
            />
            
          </div>
        </div>
        <div className="prop-box-body">
          <input
            type="text"
            value={prop.label}
            onChange={(e) => {
              handlePropLabel(prop.dndId, e.target.value)
            }}
          ></input>
        </div>
      </div>      
      <button
              className="remove-category-button"
              onClick={() => removeProp(categoryDndId, prop.dndId)}
            >
              &times;
      </button>
    </div>
  )
};


export default PropBox;