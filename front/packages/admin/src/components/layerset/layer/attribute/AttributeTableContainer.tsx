import React from 'react';
import {attributeCategoryType} from "@src/components/layerset/layer/LayerAttribute";

interface AttributeTableContainerProps {
  categoryArr: attributeCategoryType[];
}

const AttributeTableContainer = ({categoryArr}: AttributeTableContainerProps) => {
  return (
    <div className="attribute-category-container">
      {categoryArr.map((attribute) => (
        <div key={attribute.id} className="feature-group">
          <div className="feature-name bg-gray fw-bold">{attribute.categoryName}</div>
          <div className="properties-container">
            {attribute.properties.map((item) => (
              <div key={item.id} className="properties-item" data-weight={item.weight}>
                <div className="properties-label bg-gray fw-bold">{item.label}</div>
                <div className="properties-value bg-black ellipsis" title="-">{"-"}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AttributeTableContainer;