import * as Cesium from "cesium";

const layerCache: Record<string, Cesium.ImageryLayer | Cesium.Cesium3DTileset> = {};

export const getLayerFromCache = (assetId: string) => layerCache[assetId];

export const addLayerToCache = (assetId: string, layer: Cesium.ImageryLayer | Cesium.Cesium3DTileset) => {
    layerCache[assetId] = layer;
};

export const removeLayerFromCache = (assetId: string, viewer: Cesium.Viewer) => {
    const layer = layerCache[assetId];
    if (layer) {
        if (layer instanceof Cesium.Cesium3DTileset) {
            viewer.scene.primitives.remove(layer);
        } else {
            viewer.scene.imageryLayers.remove(layer);
        }
        delete layerCache[assetId];
    }
};

export default layerCache;
