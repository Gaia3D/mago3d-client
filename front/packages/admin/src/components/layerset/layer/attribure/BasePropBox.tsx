import React from 'react';
import {useDrag} from "react-dnd";
import {attributePropertyType} from "@src/components/layerset/layer/LayerAttribute";

const BasePropBox = ({ prop }: { prop: attributePropertyType }) => {
  const [, drag] = useDrag({
    type: 'BASE_PROP',
    item: { type: 'BASE_PROP', prop },
  });

  return <div ref={drag} className="base-prop-box">{prop.field}</div>;
};
export default BasePropBox;