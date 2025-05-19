import * as Cesium from "cesium";
import { LayerStyle } from "@mnd/shared/src/types/layerset/gql/graphql";
import { ensureEntityPosition } from "@src/utils/layer/ensureEntityPosition";
import { applyRules } from "./applyRules";
import { createStyledEntity } from "./createEntity";

export const applyStyledEntities = (
  viewer: Cesium.Viewer,
  entities: Cesium.Entity[],
  styles: LayerStyle[],
) => {
  viewer.entities.removeAll();
  const now = Cesium.JulianDate.now();
  const maxEntities = 50;
  entities.slice(0, maxEntities).forEach((entity) => {
    ensureEntityPosition(entity);
    styles.forEach((style) => {
      const styled = createStyledEntity(entity, style, now, applyRules(entity, style));
      if (styled) viewer.entities.add(styled);
    });
  });
};
