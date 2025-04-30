import * as Cesium from "cesium";
import { LayerStyle } from "@src/generated/gql/layerset/graphql";

interface LoadAndStyleGeoJsonProps {
  viewer: Cesium.Viewer;
  resourceName: string;
  layerStyles: LayerStyle[];
  dataSourceRef: React.MutableRefObject<Cesium.DataSource | null>;
}

export const loadAndStyleGeoJson = async ({
                                            viewer,
                                            resourceName,
                                            layerStyles,
                                            dataSourceRef,
                                          }: LoadAndStyleGeoJsonProps) => {
  const url = `${import.meta.env.VITE_GEOSERVER_WFS_SERVICE_URL}service=WFS&version=2.0.0&request=GetFeature&typeName=${resourceName}&outputFormat=application/json&propertyName=wkb_geometry&count=1`;

  const dataSource = await Cesium.GeoJsonDataSource.load(url);
  dataSourceRef.current = dataSource;

  dataSource.entities.values.forEach((entity) => {
    layerStyles.forEach((style) => {
      const { context } = style;

      ensureEntityPosition(entity);
      if (!entity.position) return;

      const strokeColor = Cesium.Color.fromCssColorString(context.strokeColor || "#000000")
        .withAlpha(context.strokeOpacity ?? 1);
      const fillColor = Cesium.Color.fromCssColorString(context.fillColor || "#ffffff")
        .withAlpha(context.fillOpacity ?? 1);
      const strokeWidth = context.strokeWidth ?? 1;

      // if (style.type === "point") {
        viewer.entities.add({
          position: entity.position,
          point: new Cesium.PointGraphics({
            // pixelSize: new Cesium.ConstantProperty(context.size),
            pixelSize: new Cesium.ConstantProperty(20),
            color: new Cesium.ColorMaterialProperty(fillColor),
            outlineColor: new Cesium.ColorMaterialProperty(strokeColor),
            outlineWidth: new Cesium.ConstantProperty(strokeWidth),
          }),
        });
      // } else if (style.type === "polyLine") {
      //   entity.polyline = new Cesium.PolylineGraphics({
      //     width: new Cesium.ConstantProperty(strokeWidth),
      //     material: new Cesium.ColorMaterialProperty(strokeColor),
      //     clampToGround: new Cesium.ConstantProperty(true),
      //   });
      // } else if (style.type === "polygon") {
      //   entity.polygon = new Cesium.PolygonGraphics({
      //     material: new Cesium.ColorMaterialProperty(fillColor),
      //     outline: new Cesium.ConstantProperty(true),
      //     outlineColor: new Cesium.ConstantProperty(strokeColor),
      //     outlineWidth: new Cesium.ConstantProperty(strokeWidth),
      //   });
      // }
    });
  });
};

function ensureEntityPosition(entity: Cesium.Entity): void {
  if (entity.position) return; // 이미 있으면 패스

  const now = Cesium.JulianDate.now();

  // 폴리곤 중심
  if (entity.polygon?.hierarchy) {
    const hierarchy = entity.polygon.hierarchy.getValue(now);
    if (hierarchy?.positions?.length > 0) {
      const center = Cesium.BoundingSphere.fromPoints(hierarchy.positions).center;
      entity.position = new Cesium.ConstantPositionProperty(center);
    }
  }

  // 폴리라인 시작점
  if (!entity.position && entity.polyline?.positions) {
    const positions = entity.polyline.positions.getValue(now);
    if (positions?.length > 0) {
      entity.position = new Cesium.ConstantPositionProperty(positions[0]);
    }
  }
}
