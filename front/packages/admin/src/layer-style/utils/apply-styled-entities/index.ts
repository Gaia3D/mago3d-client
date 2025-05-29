import * as Cesium from "cesium";
import {EditableStyleModel} from "@src/layer-style/models/EditableStyleModel";
import {ensureEntityPosition} from "@src/layer-style/utils/apply-styled-entities/ensureEntityPosition";
import {createStyledEntity} from "@src/layer-style/utils/apply-styled-entities/createStyledEntity";

export const applyStyledEntities = (
  viewer: Cesium.Viewer,
  entities: Cesium.Entity[],
  styles: EditableStyleModel[],
) => {
  viewer.entities.removeAll();
  const now = Cesium.JulianDate.now();
  const maxEntities = 50;
  entities.slice(0, maxEntities).forEach((entity) => {
    ensureEntityPosition(entity);
    styles.forEach((style) => {
      const styled = createStyledEntity(entity, style, now);
      if (styled) viewer.entities.add(styled);
    });
  });
};
