import * as Cesium from "cesium";
import {UserLayerAsset} from "@mnd/shared/src/types/layerset/gql/graphql.ts";

export const loadIconLayer = async (layer: UserLayerAsset, viewer: Cesium.Viewer) => {

    if (!viewer || !layer?.properties?.layer?.name) {
        console.error("Error: layer or layer.resource is undefined", layer);
        return;
    }
    const layerId = layer?.assetId;
    const layerName = layer?.properties?.layer?.name;
    if (viewer.dataSources.getByName(layerName).length > 0) return;
    Cesium.GeoJsonDataSource.load(
        // TODO Bbox 주기
        `${import.meta.env.VITE_GEOSERVER_WFS_SERVICE_URL}?service=WFS&version=1.1.1&request=GetFeature&typeName=${layerName}&outputFormat=application/json`
    ).then((dataSource) => {
        const entities = dataSource.entities.values;
        const falseProperty = new Cesium.ConstantProperty(false);

        for (let i = 0; i < entities.length; i++) {
            const entity = entities[i];

            // Billboard 숨기기
            if (entity.billboard) {
                entity.billboard.show = falseProperty;
            }

            // PointGraphics 추가 (없는 경우에만)
            if (!entity.point) {
                entity.point = new Cesium.PointGraphics({
                    pixelSize: 10,
                    color: Cesium.Color.WHITE,
                    outlineColor: Cesium.Color.RED,
                    outlineWidth: 2,
                    disableDepthTestDistance: Number.POSITIVE_INFINITY,
                });
            }
        }


        dataSource.name = layerId;
        dataSource.show = !!layer.visible;
        viewer.dataSources.add(dataSource);
    }).catch(error => console.error("Failed to load WFS data", error));
}