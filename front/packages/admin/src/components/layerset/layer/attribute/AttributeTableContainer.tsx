import React from 'react';
import {attributeCategoryType} from "@src/components/layerset/layer/LayerAttribute";

interface AttributeTableContainerProps {
  categoryArr: attributeCategoryType[];
}

const AttributeTableContainer = ({categoryArr}: AttributeTableContainerProps) => {
  return (
    <div className="attribute-category-container">
      <div className='attribute-title'>
        <span>미리보기</span>
      </div>
      <div className='attribute-body'>
      {categoryArr.map((category) => (
        <div key={category.dndId} className="feature-group">
          <div className="feature-name bg-gray fw-bold">{category.categoryName}</div>
          <div className="properties-container">
            {category.properties.map((prop) => (
              <div key={prop.dndId} className="properties-item" data-weight={prop.weight}>
                <div className="properties-label bg-gray fw-bold">{prop.label}</div>
                <div className="properties-value bg-black ellipsis" title={prop.value ? `ex) ${prop.value}` : "-"}>{prop.value ? `ex) ${prop.value}` : "-"}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
      </div>
    </div>
  );
};

export default AttributeTableContainer;