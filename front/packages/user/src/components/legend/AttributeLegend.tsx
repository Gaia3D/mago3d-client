import React from 'react';
import {Maybe, Scalars} from "@mnd/shared/src/types/layerset/gql/graphql.ts";

enum AttributeType {
  POINT = "POINT",
  LINE = "LINE",
  POLYGON = "POLYGON",
}

const resolveAttributeTypeFromAtType = (atType?: string): AttributeType => {
  switch (atType) {
    case "PointStyle":
      return AttributeType.POINT;
    case "LineStyle":
      return AttributeType.LINE;
    case "PolygonStyle":
      return AttributeType.POLYGON;
    default:
      return AttributeType.POINT;
  }
};


const AttributeLegend = (
  assetName: string,
  attribute: string,
  rules: Maybe<Scalars["JSON"]["output"]>[],
  styleId: string
) => {
  return (
    <div key={`attribute-${styleId}`} className="legend-block">
      <div className="legend-title">{assetName}</div>
      <div className="legend-title">{attribute} 속성</div>
      <div className="legend-table">
        {rules.map((item, ruleIdx) => {
          const ruleStyle = item.style;
          const type = resolveAttributeTypeFromAtType(ruleStyle["@type"]);
          const color = type === AttributeType.LINE ? ruleStyle.strokeColor : ruleStyle.fillColor;
          const opacity = type === AttributeType.LINE ? ruleStyle.strokeOpacity : ruleStyle.fillOpacity;

          return (
            <div key={ruleIdx} className="legend-row">
              <div className="legend-color" style={{backgroundColor: color ?? "#ccc", opacity: opacity ?? 1}}/>
              <div className="legend-alias">{item.alias || "-"}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AttributeLegend;