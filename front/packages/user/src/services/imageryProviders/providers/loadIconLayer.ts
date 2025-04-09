import * as Cesium from "cesium";
import { getInstance } from "@/api/GlobeController.ts";
import {UserLayerAsset} from "@mnd/shared/src/types/layerset/gql/graphql.ts";
import {SetterOrUpdater} from "recoil";
import {LoadingStateType} from "@/recoils/Spinner.ts";
import { addBillboard, addLabel, createCollection } from "@/utils/iconLayerUtils.ts";

const fetchGeoJson = async (layerName: string): Promise<GeoJSON.FeatureCollection> => {
    const response = await fetch(`${import.meta.env.VITE_GEOSERVER_WFS_SERVICE_URL}?service=WFS&version=1.1.1&request=GetFeature&typeName=${layerName}&outputFormat=application/json`);
    return response.json();
};

type FeatureWithPosition = {
    position: Cesium.Cartesian3;
    labelText: string;
    properties: unknown;
}

export const loadIconLayer = async (
  layer: UserLayerAsset,
  viewer: Cesium.Viewer,
  setLoadingState: SetterOrUpdater<LoadingStateType>
): Promise<void> => {
    if (!viewer || !layer?.properties?.layer?.name || !layer.visible) return;

    const globeController = getInstance();
    const { assetId: layerId, properties } = layer;
    const {
        layer: { name: layerName },
        icon: originalUrl,
        selectIcon: selectIconUrl,
    } = properties;

    if (globeController.primitiveMap.has(layerId)) return;

    const [originalImage, selectedImage] = await Promise.all([
        Cesium.Resource.fetchImage(originalUrl),
        Cesium.Resource.fetchImage(selectIconUrl),
    ]);

    const billboardCollection = createCollection<Cesium.BillboardCollection>(viewer, "billboard");
    const labelCollection = createCollection<Cesium.LabelCollection>(viewer, "label");
    const nearBillboardCollection = createCollection<Cesium.BillboardCollection>(viewer, "billboard");
    const nearLabelCollection = createCollection<Cesium.LabelCollection>(viewer, "label");

    setLoadingState({ loading: true, msg: "" });

    try {
        const geojson = await fetchGeoJson(layerName);

        const featureList: FeatureWithPosition[] = [];

        geojson.features.forEach((feature) => {
            if (feature.geometry?.type !== "MultiPoint") return;

            feature.geometry.coordinates.forEach(([longitude, latitude]) => {
                if (!longitude || !latitude) return;
                const position = Cesium.Cartesian3.fromDegrees(longitude, latitude);
                const properties = feature.properties ?? {};
                properties.layerName = layer.name;
                const labelText = properties?.명칭 || "";

                featureList.push({ position, labelText, properties });
            });
        });

        // Batching 처리
        const BATCH_SIZE = 300;
        let index = 0;

        const processBatch = () => {
            const end = Math.min(index + BATCH_SIZE, featureList.length);

            for (let i = index; i < end; i++) {
                const { position, labelText, properties } = featureList[i];

                const label = addLabel(labelCollection, position, labelText, false);
                const nearLabel = addLabel(nearLabelCollection, position, labelText, true);

                addBillboard(billboardCollection, position, {
                    originalImage,
                    selectedImage,
                    label,
                    properties,
                });

                addBillboard(nearBillboardCollection, position, {
                    originalImage,
                    selectedImage,
                    label: nearLabel,
                    properties,
                }, true);
            }

            index = end;

            if (index < featureList.length) {
                requestAnimationFrame(processBatch);
            } else {
                globeController.primitiveMap.set(layerId, {
                    billboardCollection,
                    labelCollection,
                    nearBillboardCollection,
                    nearLabelCollection,
                });
                requestAnimationFrame(() => setLoadingState({ loading: false, msg: "" }));
            }
        };

        requestAnimationFrame(processBatch);

    } catch (error) {
        console.error("Failed to load WFS data", error);
        setLoadingState({ loading: false, msg: "" });
    }
};
