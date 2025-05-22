import * as Cesium from "cesium";
import {LayerStyle} from "@mnd/shared/src/types/layerset/gql/graphql";

export const applyRules = (
  entity: Cesium.Entity,
  style: LayerStyle
): string => {

  console.log("applyRules-entity", entity);
  console.log("applyRules-style", style);

  return "#ff0000";
}