import * as Cesium from "cesium";

const layerCache: Record<string, Cesium.ImageryLayer | Cesium.Cesium3DTileset> = {};

export const addLayerToCache = (id: string, layer: Cesium.ImageryLayer | Cesium.Cesium3DTileset) => {
    console.log("id", id);
    console.log("add", layer);
    layerCache[id] = layer;
};

export const getLayerFromCache = (id: string) => layerCache[id];

export const removeLayerFromCache = (id: string, viewer: Cesium.Viewer) => {
    const layer = layerCache[id];
    if (layer instanceof Cesium.ImageryLayer) {
        viewer.scene.imageryLayers.remove(layer, true);
    } else if (layer instanceof Cesium.Cesium3DTileset) {
        viewer.scene.primitives.remove(layer);
    }
    delete layerCache[id];
};

export const clearLayerCache = (viewer: Cesium.Viewer) => {
    Object.keys(layerCache).forEach(id => removeLayerFromCache(id, viewer));
};

export default layerCache;
