import { useRecoilCallback, useRecoilValue } from "recoil";
import { useEffect, useMemo, useState } from "react";
import { layersState, userLayerAssetArrState } from "@/recoils/Layer";
import { LayerAssetType, UserLayerAsset } from "@mnd/shared/src/types/layerset/gql/graphql";
import * as Cesium from "cesium";
import {useGlobeController} from "@/components/providers/GlobeControllerProvider.tsx";
import layerCache, {addLayerToCache, getLayerFromCache, removeLayerFromCache} from "@/utils/layerCache.ts";
import keycloak from "@/api/keycloak.ts";
import TIFFImageryProvider from "tiff-imagery-provider";
import {CustomTIFFImageryProvider} from "@/components/providers/CustomTIFFImageryProvider.ts";

export const useLayerManagement = () => {
    const {token} = keycloak;
    const { initialized, globeController } = useGlobeController();
    const userLayerAssetArr = useRecoilValue(userLayerAssetArrState);
    const layers = useRecoilValue<UserLayerAsset[]>(layersState);
    const updateLayerStates = useRecoilCallback(({ set }) => () => set(userLayerAssetArrState, []), []);

    const [iconLayer, setIconLayer] = useState<UserLayerAsset | null>(null);

    const mountainLayer = useMemo(() => {
        return layers.find((layer) => layer.name === "산마루") || null;
    }, [layers]);

    useEffect(() => {
        setIconLayer(mountainLayer);
    }, [mountainLayer]);

    const toggleDataSourceVisibility = (layerAsset: UserLayerAsset) => {
        if (!globeController?.viewer) return;
        const viewer = globeController.viewer;
        const existingDataSources = viewer.dataSources.getByName(layerAsset.assetId);
        if (existingDataSources.length > 0) {
            existingDataSources.forEach(ds => {
                ds.show = layerAsset.visible ?? false;
            });
        }
    };

    useEffect(() => {
        if (!userLayerAssetArr.length) return;
        for (const layer of userLayerAssetArr) {
            if (layer.name === "산마루") {
                toggleDataSourceVisibility(layer);
            } else {
                const imageryLayer = getLayerFromCache(layer.assetId);
                if (!imageryLayer) {
                    console.warn(`Layer not found in cache: ${layer.assetId}`);
                    continue;
                }
                imageryLayer.show = layer.visible ?? false;
            }
        }

        updateLayerStates();
    }, [userLayerAssetArr]);

    useEffect(() => {
        if (!initialized) return;

        const viewer = globeController?.viewer;
        const tilesPrimitives = globeController.tilesPrimitives;
        if (!viewer) return;

        Object.keys(layerCache).forEach(assetId => removeLayerFromCache(assetId, viewer));

        [...layers].reverse().forEach(layer => {
            const { type, assetId, properties, visible } = layer;
            if (!properties) return;

            switch (type) {
                case LayerAssetType.Tiles3D:{
                    if(!tilesPrimitives) break;
                    const {resource} = properties;
                    Cesium.Cesium3DTileset.fromUrl(import.meta.env.VITE_API_URL + resource)
                        .then(model => {
                            model.show = !!visible;
                            model.pointCloudShading.attenuation = true;
                            model.pointCloudShading.maximumAttenuation = 5.0;
                            model.pointCloudShading.eyeDomeLighting = true;
                            model.pointCloudShading.eyeDomeLightingStrength = 0.1;
                            tilesPrimitives.add(model);
                            addLayerToCache(assetId, model);
                        });

                    break;
                }
                case LayerAssetType.Vector:
                case LayerAssetType.Raster: {
                    const imageryLayer = new Cesium.ImageryLayer(
                        new Cesium.WebMapServiceImageryProvider({
                            url: import.meta.env.VITE_GEOSERVER_WMS_SERVICE_URL,
                            layers: properties.layer.resource.name,
                            parameters: {
                                service: "WMS",
                                request: "GetMap",
                                version: "1.1.1",
                                format: "image/png",
                                transparent: "true"
                            },
                        }),
                        {show: !!visible}
                    );
                    viewer.scene.imageryLayers.add(imageryLayer);
                    addLayerToCache(assetId, imageryLayer);
                    break;
                }
                case LayerAssetType.Layergroup: {
                    const {layerGroup} = properties;
                    const {bounds, title, workspace} = layerGroup;
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
                            show: !!visible,
                            rectangle: Cesium.Rectangle.fromDegrees(minx, miny, maxx, maxy)
                        },
                    );

                    viewer.scene.imageryLayers.add(imageryLayer);
                    addLayerToCache(assetId, imageryLayer);
                    break;
                }
                case LayerAssetType.Cog: {
                    if (!token){
                        throw new Error('No token, Cannot load COG layer.');
                    }
                    const {resource} = properties;
                    TIFFImageryProvider.fromUrl(resource)
                        .then(provider => {
                            const imageLayer = new Cesium.ImageryLayer(
                                provider as CustomTIFFImageryProvider,
                                {
                                    show: !!visible,
                                },
                            );
                            viewer.scene.imageryLayers.add(imageLayer);
                            layerCache[assetId] = imageLayer;
                        })
                        .catch(err => {
                            console.error(err);
                        });
                    break;
                }
                case LayerAssetType.VworldWms: {
                    const imageryLayer = new Cesium.ImageryLayer(
                        new Cesium.WebMapServiceImageryProvider({
                            url: `/user/vworld`,
                            layers: properties.layers,
                            minimumLevel: 0,
                            parameters: {
                                key: import.meta.env.VITE_VWORLD_TOKEN,
                                styles: properties.styles,
                                service: "WMS",
                                request: "GetMap",
                                version: "1.3.0",
                                transparent: "true",
                                format: "image/png",
                                crs: "EPSG:4326",
                            },
                        }),
                        {
                            show: !!visible,
                            minimumTerrainLevel: 5
                        }
                    );

                    viewer.scene.imageryLayers.add(imageryLayer);
                    addLayerToCache(assetId, imageryLayer);
                    break;
                }
            }
        });
    }, [initialized, layers]);

    return { iconLayer };
};
