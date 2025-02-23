import * as Cesium from "cesium";
import {UserLayerAsset} from "@mnd/shared/src/types/layerset/gql/graphql.ts";

export const loadIconLayer = async (layer: UserLayerAsset, viewer: Cesium.Viewer) => {
    if (!viewer || !layer?.properties?.layer?.name) {
        console.error("viewer or layer, layer.properties.layer.name is undefined.", layer);
        return;
    }

    const layerId = layer?.assetId;
    const layerName = layer?.properties?.layer?.name;
    const iconUrl = layer?.properties?.icon;

    const primitiveMap = new Map();

    if (primitiveMap.has(layerId)) return;

    const billboardCollection = new Cesium.BillboardCollection({
        id: layerId,
        scene: viewer.scene,
    });

    fetch(`${import.meta.env.VITE_GEOSERVER_WFS_SERVICE_URL}?service=WFS&version=1.1.1&request=GetFeature&typeName=${layerName}&outputFormat=application/json`)
        .then(response => response.json())
        .then((geojson) => {
            // ✅ primitives에 미리 추가해야 CLAMP_TO_GROUND 가능
            viewer.scene.primitives.add(billboardCollection);

            geojson.features.forEach(feature => {
                if (!feature.geometry || feature.geometry.type !== 'MultiPoint') return;

                feature.geometry.coordinates.forEach(([longitude, latitude]) => {
                    billboardCollection.add({
                        position: Cesium.Cartesian3.fromDegrees(Number(longitude), Number(latitude)),
                        image: iconUrl,
                        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                        disableDepthTestDistance: Number.POSITIVE_INFINITY
                    });
                });
            });

            primitiveMap.set(layerId, billboardCollection);
            billboardCollection.show = !!layer.visible;
        })
        .catch(error => console.error("Failed to load WFS data", error));
}