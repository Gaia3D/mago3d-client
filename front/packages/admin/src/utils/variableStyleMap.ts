import { CreateStyleInput, LayerStyle, Rule } from "@src/generated/gql/layerset/graphql";

export type VisibleStyleType = 'point' | 'polyline' | 'polygon' | 'attribute';

export function mapToStyleCreateInput({
  styleState,
  visibleStyle,
  selectedAttribute,
  rules
}: {
  styleState: LayerStyle;
  visibleStyle: VisibleStyleType;
  selectedAttribute: string;
  rules: Rule[];
}): CreateStyleInput {
  return {
    name: styleState.name,
    context: {
      point: visibleStyle === "point" ? {
        shape: styleState.context.shape,
        size: styleState.context.size,
        strokeColor: styleState.context.strokeColor,
        strokeWidth: styleState.context.strokeWidth,
        strokeOpacity: styleState.context.strokeOpacity,
        fillColor: styleState.context.fillColor,
        fillOpacity: styleState.context.fillOpacity,
      } : undefined,
      line: visibleStyle === "polyline" ? {
        strokeColor: styleState.context.strokeColor,
        strokeWidth: styleState.context.strokeWidth,
        strokeOpacity: styleState.context.strokeOpacity,
      } : undefined,
      polygon: visibleStyle === "polygon" ? {
        strokeColor: styleState.context.strokeColor,
        strokeWidth: styleState.context.strokeWidth,
        strokeOpacity: styleState.context.strokeOpacity,
        fillColor: styleState.context.fillColor,
        fillOpacity: styleState.context.fillOpacity,
      } : undefined,
      attribute: visibleStyle === "attribute" ? {
        name: styleState.name,
        attribute: selectedAttribute,
        rules: rules.map(rule => ({
          rule: {
            min: rule.min,
            max: rule.max,
            eq: rule.eq
          },
          style: {
            strokeColor: rule.color,
            fillColor: rule.color
          }
        }))
      } : undefined
    }
  };
}
