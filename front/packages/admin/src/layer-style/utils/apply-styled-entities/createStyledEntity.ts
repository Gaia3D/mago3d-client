import {styledPointEntity} from "./styledPointEntity";
import {styledLineEntity} from "./styledLineEntity";
import {styledPolygonEntity} from "./styledPolygonEntity";
import {EditableStyleModel} from "@src/layer-style/models/EditableStyleModel";
import {LayerType} from "@src/layer-style/models/EditableContextModel";
import * as Cesium from "cesium";

export const createStyledEntity = (
  entity: Cesium.Entity,
  style: EditableStyleModel,
  now: Cesium.JulianDate,
): Cesium.Entity.ConstructorOptions | null => {
  const {context} = style;

  if (context.type === LayerType.POINT)
    return styledPointEntity(entity, style);

  if (context.type === LayerType.LINE)
    return styledLineEntity(entity, style, now);

  if (context.type === LayerType.POLYGON)
    return styledPolygonEntity(entity, style, now);

  if (context.type === LayerType.ATTRIBUTE) {
    switch (context.attributeType) {
      case "POINT":
        return styledPointEntity(entity, style, true);
      case "LINE":
        return styledLineEntity(entity, style, now, true);
      case "POLYGON":
        return styledPolygonEntity(entity, style, now, true);
    }
  }

  return null;
};
