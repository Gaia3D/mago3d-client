import * as Cesium from "cesium";
import { getInstance } from "@/api/GlobeController.ts";
import {UserLayerAsset} from "@mnd/shared/src/types/layerset/gql/graphql.ts";
import {SetterOrUpdater} from "recoil";
import {LoadingStateType} from "@/recoils/Spinner.ts";
import {
    addBillboard,
    addLabel, addPoint,
    createBillboardCollection, createLabelCollection,
    createPointCollection
} from "@/services/imageryProviders/providers/loadIconManager.ts";
import {setupMouseHoverHandler} from "@/services/imageryProviders/providers/loadIconInteraction.ts";

const fetchGeoJson = async (layerName: string): Promise<GeoJSON.FeatureCollection> => {
    const response = await fetch(`${import.meta.env.VITE_GEOSERVER_WFS_SERVICE_URL}?service=WFS&version=1.1.1&request=GetFeature&typeName=${layerName}&outputFormat=application/json`);
    return response.json();
}


export const loadIconLayer = async (
    layer: UserLayerAsset,
    viewer: Cesium.Viewer,
    setLoadingState: SetterOrUpdater<LoadingStateType>
): Promise<void> => {
    if (!viewer || !layer?.properties?.layer?.name || !layer.visible) return;

    const globeController = getInstance();
    const { assetId: layerId, properties } = layer;
    const { layer: { name: layerName }, icon: originalUrl, selectIcon: selectIconUrl, color } = properties;

    if (globeController.primitiveMap.has(layerId)) return;

    const [originalImage, selectedImage] = await Promise.all([
        Cesium.Resource.fetchImage(originalUrl),
        Cesium.Resource.fetchImage(selectIconUrl),
    ]);

    const [billboardCollection, pointCollection, labelCollection] = [
        createBillboardCollection(viewer),
        createPointCollection(viewer),
        createLabelCollection(viewer)
    ];

    setLoadingState({ loading: true, msg: "" });

    try {
        const geojson = await fetchGeoJson(layerName);
        const usePoint = geojson.features.length > 10000;

        geojson.features.forEach(feature => {
            if (feature.geometry?.type !== "MultiPoint") return;

            feature.geometry.coordinates.forEach(([longitude, latitude]) => {
                if (!longitude || !latitude) return;

                const position = Cesium.Cartesian3.fromDegrees(longitude, latitude);
                const labelText = feature.properties?.명칭 || "";

                const labelPrimitive = addLabel(labelCollection, position, labelText);

                if (usePoint) {
                    addPoint(pointCollection, position, color, labelPrimitive);
                }

                addBillboard(billboardCollection, position, originalImage, selectedImage, labelPrimitive, usePoint);
            });
        });

        globeController.primitiveMap.set(layerId, {
            billboardCollection,
            pointCollection: usePoint ? pointCollection : new Cesium.PointPrimitiveCollection(),
        });

    } catch (error) {
        console.error("Failed to load WFS data", error);
    } finally {
        requestAnimationFrame(() => setLoadingState({ loading: false, msg: "" }));
    }

    setupMouseHoverHandler(viewer);
};
