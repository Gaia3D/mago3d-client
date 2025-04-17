import React, {useRef} from 'react';
import {useDrag, useDrop} from "react-dnd";
import {attributePropertyType, DragItem} from "@src/components/layerset/layer/LayerAttribute";


const PropBox = ({
   prop,
   index,
   categoryId,
   moveProp,
   handlePropWeight,
   removeProp,
   handlePropLabel
 }: {
  prop: attributePropertyType;
  index: number;
  categoryId: string;
  moveProp: (fromId: string, toId: string, fromIdx: number, toIdx: number, propId: string) => void;
  handlePropWeight: (propId: string, weight: number) => void;
  removeProp: (categoryId: string, propId: string) => void;
  handlePropLabel: (propId: string, label: string) => void;
}) => {
  const ref = useRef(null);

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