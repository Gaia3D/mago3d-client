import * as Cesium from "cesium";
import { UserLayerAsset } from "@mnd/shared/src/types/layerset/gql/graphql.ts";
import {getInstance} from "@/api/GlobeController.ts";


export const loadIconLayer = async (
    layer: UserLayerAsset,
    viewer: Cesium.Viewer
): Promise<void> => {
    if (!viewer || !layer?.properties?.layer?.name) {
        console.error("viewer or layer, layer.properties.layer.name is undefined.", layer);
        return;
    }
    const globeController = getInstance(); // GlobeController 싱글톤 인스턴스 활용

    const layerId: string = layer.assetId;
    const layerName: string = layer.properties.layer.name;
    const iconUrl: string = layer.properties.icon;

    if (globeController.primitiveMap.has(layerId)) return;

    const billboardCollection = new Cesium.BillboardCollection({
        scene: viewer.scene,
    });

    fetch(
        `${import.meta.env.VITE_GEOSERVER_WFS_SERVICE_URL}?service=WFS&version=1.1.1&request=GetFeature&typeName=${layerName}&outputFormat=application/json`
    )
        .then((response): Promise<GeoJSON.FeatureCollection> => response.json())
        .then((geojson: GeoJSON.FeatureCollection) => {
            viewer.scene.primitives.add(billboardCollection);
            if (!layer.visible) return;
            console.log("load");
            geojson.features.forEach((feature: GeoJSON.Feature) => {
                if (!feature.geometry || feature.geometry.type !== "MultiPoint") return;

                (feature.geometry as GeoJSON.MultiPoint).coordinates.forEach(
                    (position: GeoJSON.Position) => {
                        if (position.length >= 2) {
                            const [longitude, latitude] = position;
                            billboardCollection.add({
                                position: Cesium.Cartesian3.fromDegrees(longitude, latitude),
                                image: iconUrl,
                                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                                disableDepthTestDistance: Number.POSITIVE_INFINITY,
                            });
                        }
                    }
                );
            });

            // 모든 billboard 로드가 끝난 후 다음 렌더링 프레임에서 실행
            viewer.scene.requestRender();
            requestAnimationFrame(() => {
                console.log("end"); // 모든 billboard 로딩 완료 콘솔
            });

            globeController.primitiveMap.set(layerId, billboardCollection);
        })
        .catch((error: unknown) => console.error("Failed to load WFS data", error));

};
