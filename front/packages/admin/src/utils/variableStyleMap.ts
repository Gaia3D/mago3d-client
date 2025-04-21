import { CreateStyleInput, LayerStyle, Rule } from "@mnd/shared/src/types/layerset/gql/graphql";

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
  const basePoint = {
    shape: styleState.context.shape,
    size: styleState.context.size,
    strokeColor: styleState.context.strokeColor,
    strokeWidth: styleState.context.strokeWidth,
    strokeOpacity: styleState.context.strokeOpacity,
    fillColor: styleState.context.fillColor,
    fillOpacity: styleState.context.fillOpacity,
    minScale: styleState.context.minScale,
    maxScale: styleState.context.maxScale
  };

  const baseLine = {
    strokeColor: styleState.context.strokeColor,
    strokeWidth: styleState.context.strokeWidth,
    strokeOpacity: styleState.context.strokeOpacity,
    minScale: styleState.context.minScale,
    maxScale: styleState.context.maxScale
  };

  const basePolygon = {
    strokeColor: styleState.context.strokeColor,
    strokeWidth: styleState.context.strokeWidth,
    strokeOpacity: styleState.context.strokeOpacity,
    fillColor: styleState.context.fillColor,
    fillOpacity: styleState.context.fillOpacity,
    minScale: styleState.context.minScale,
    maxScale: styleState.context.maxScale
  };

  return {
    name: styleState.name,
    context: {
      point: visibleStyle === "point" ? basePoint : undefined,
      line: visibleStyle === "polyline" ? baseLine : undefined,
      polygon: visibleStyle === "polygon" ? basePolygon : undefined,
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
            point: basePoint,
            line: baseLine,
            polygon: basePolygon
          }
        }))
      } : undefined
    }
  };
}
