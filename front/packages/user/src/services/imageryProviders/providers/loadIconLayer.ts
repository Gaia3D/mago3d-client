import * as Cesium from "cesium";
import { UserLayerAsset } from "@mnd/shared/src/types/layerset/gql/graphql.ts";
import {getInstance} from "@/api/GlobeController.ts";
import { SetterOrUpdater } from "recoil";
import { LoadingStateType} from "@/recoils/Spinner.ts";
import {hexToCesiumColor} from "@/utils/common.ts";


export const loadIconLayer = async (
    layer: UserLayerAsset,
    viewer: Cesium.Viewer,
    setLoadingState: SetterOrUpdater<LoadingStateType>
): Promise<void> => {
    if (!viewer || !layer?.properties?.layer?.name) {
        console.error("viewer or layer, layer.properties.layer.name is undefined.", layer);
        return;
    }
    if (!layer.visible) return;

    const globeController = getInstance(); // GlobeController 싱글톤 인스턴스 활용

    const layerId: string = layer.assetId;
    const layerName: string = layer.properties.layer.name;
    const iconUrl: string = layer.properties.icon;

    if (globeController.primitiveMap.has(layerId)) return;

    const billboardCollection = new Cesium.BillboardCollection({scene: viewer.scene});
    const pointCollection = new Cesium.PointPrimitiveCollection();
    setLoadingState({ loading: true, msg: "" });

    viewer.scene.primitives.add(billboardCollection);
    viewer.scene.primitives.add(pointCollection);

    fetch(`${import.meta.env.VITE_GEOSERVER_WFS_SERVICE_URL}?service=WFS&version=1.1.1&request=GetFeature&typeName=${layerName}&outputFormat=application/json`)
        .then((response): Promise<GeoJSON.FeatureCollection> => response.json())
        .then((geojson: GeoJSON.FeatureCollection) => {
            const featureCount = geojson.features.length;
            const usePoint = featureCount > 10000;

            geojson.features.forEach((feature: GeoJSON.Feature) => {
                if (!feature.geometry || feature.geometry.type !== "MultiPoint") return;

                (feature.geometry as GeoJSON.MultiPoint).coordinates.forEach(
                    (position: GeoJSON.Position) => {
                        if (position.length >= 2) {
                            const [longitude, latitude] = position;
                            if (!longitude || !latitude) return;

                            const cartesianPosition = Cesium.Cartesian3.fromDegrees(longitude, latitude);

                            if (usePoint) {
                                pointCollection.add({
                                    position: cartesianPosition,
                                    pixelSize: 10,
                                    outlineColor: Cesium.Color.WHITE,
                                    outlineWidth: 1,
                                    color: hexToCesiumColor(layer.properties.color, 0.3),
                                    distanceDisplayCondition: new Cesium.DistanceDisplayCondition(20000, Number.POSITIVE_INFINITY),
                                    disableDepthTestDistance: Number.POSITIVE_INFINITY,
                                });
                            }

                            billboardCollection.add({
                                position: cartesianPosition,
                                image: iconUrl,
                                ...(usePoint && {
                                    distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 20000),
                                }),
                                disableDepthTestDistance: Number.POSITIVE_INFINITY,
                                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                            });

                        }
                    }
                );
            });

            viewer.scene.requestRender();
            requestAnimationFrame(() => {
                setLoadingState({ loading: false, msg: "" });
            });

            globeController.primitiveMap.set(layerId, {
                billboardCollection,
                pointCollection: usePoint ? pointCollection : new Cesium.PointPrimitiveCollection(),
            });
        })
        .catch((error: unknown) => console.error("Failed to load WFS data", error));


};
