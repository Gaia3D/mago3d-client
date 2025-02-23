import * as Cesium from "cesium";
import {addLayerToCache} from "@/utils/layerCache.ts";
import {UserLayerAsset} from "@mnd/shared/src/types/layerset/gql/graphql.ts";

export const loadLayerGroup = async (layer: UserLayerAsset, viewer: Cesium.Viewer) => {
    const {bounds, title, workspace} = layer.properties.layerGroup;
    const {minx, miny, maxx, maxy} = bounds;
    const layerName = `${workspace.name}:${title}`;

    const imageryLayer = new Cesium.ImageryLayer(
        new Cesium.WebMapServiceImageryProvider({
            url: import.meta.env.VITE_GEOSERVER_WMS_SERVICE_URL,
            layers: layerName,
            minimumLevel: 0,
            parameters: {
                service: "WMS",
                version: "1.1.1",
                request: "GetMap",
                transparent: "true",
                format: "image/png",
                tiled: true,
            },
        }),
        {
            show: !!layer.visible,
            rectangle: Cesium.Rectangle.fromDegrees(minx, miny, maxx, maxy)
        },
    );

    viewer.scene.imageryLayers.add(imageryLayer);
    addLayerToCache(layer.assetId, imageryLayer);
}