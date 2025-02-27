import * as Cesium from "cesium";
import {addLayerToCache} from "@/utils/layerCache.ts";
import {UserLayerAsset} from "@mnd/shared/src/types/layerset/gql/graphql.ts";

export const loadVworldWmsLayer = async (layer: UserLayerAsset, viewer: Cesium.Viewer) => {
    const imageryLayer = new Cesium.ImageryLayer(
        new Cesium.WebMapServiceImageryProvider({
            url: `/user/vworld/wms`,
            layers: layer.properties.layers,
            minimumLevel: 0,
            parameters: {
                key: import.meta.env.VITE_VWORLD_TOKEN,
                styles: layer.properties.styles,
                service: "WMS",
                request: "GetMap",
                version: "1.3.0",
                transparent: "true",
                format: "image/png",
                crs: "EPSG:4326",
            },
        }),
        {
            show: !!layer.visible,
            minimumTerrainLevel: 5
        }
    );

    viewer.scene.imageryLayers.add(imageryLayer);
    addLayerToCache(layer.assetId, imageryLayer);
}