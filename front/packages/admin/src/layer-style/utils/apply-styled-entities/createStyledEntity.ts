import * as Cesium from "cesium";
import {LayerStyle, StyleType} from "@mnd/shared/src/types/layerset/gql/graphql";
import {EditableStyleModel} from "@src/layer-style/models/EditableStyleModel";

export const createStyledEntity = (
  entity: Cesium.Entity,
  style: EditableStyleModel,
  now: Cesium.JulianDate,
): Cesium.Entity.ConstructorOptions | null => {

  const { context } = style;
  const { type } = context;


  return
}