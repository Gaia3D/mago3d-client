import React from 'react';
import {AttributeByNativeNameQuery} from "@mnd/shared/src/types/layerset/gql/graphql";

interface AttributeTableContainer {
  attributeQuery: AttributeByNativeNameQuery;
}

const AttributeTableContainer = ({attributeQuery}: AttributeTableContainer) => {
  return (
    <div className="attribute-table-container">
      {attributeQuery.attributeByNativeName.map((attribute) => (
        <div key={attribute.id} className="feature-group ol-gray-container">
          <div className="feature-name bg-gray fw-bold">{attribute.categoryName}</div>
          <div className="properties-container">
            {attribute.properties.map((item, pIdx) => (
              <div className="properties-item" data-weight={item.weight}>
                <div className="properties-label bg-gray fw-bold">{item.label}</div>
                <div className="properties-value bg-black ellipsis" title={item.value || "-"}>{item.value || "-"}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AttributeTableContainer;