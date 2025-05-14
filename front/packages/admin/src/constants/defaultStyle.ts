import {LayerStyle, StyleType} from "@mnd/shared/src/types/layerset/gql/graphql";

export const DefaultLayerStyle: LayerStyle = {
  context: {
    fillColor: "#000",
    fillOpacity: 0.5,
    minScale: 0,
    name: "default",
    strokeColor: "#000",
    strokeOpacity: 1,
    strokeWidth: 10
  },
  type: StyleType.Point,
  name: "default",
}