import {useRecoilCallback, useRecoilState, useRecoilValue} from "recoil";
import {useGlobeController} from "./providers/GlobeControllerProvider";
import {layersState, visibleToggledLayerIdState, visibleToggledLayerIdsState} from "@/recoils/Layer";
import {useEffect, useState} from "react";
import {LayerAssetType, UserLayerAsset} from "@mnd/shared/src/types/layerset/gql/graphql";
import TIFFImageryProvider, {TIFFImageryProviderOptions} from 'tiff-imagery-provider';
import * as Cesium from "cesium";
import keycloak from "@/api/keycloak";

class CustomTIFFImageryProvider extends TIFFImageryProvider {
    tileDiscardPolicy: Cesium.TileDiscardPolicy = new Cesium.NeverTileDiscardPolicy();
    getTileCredits(x: number, y: number, level: number): Cesium.Credit[] {
        return [];
    }
    proxy = new Cesium.Proxy();

    constructor(options: TIFFImageryProviderOptions& {
        url: string | File | Blob;
    }) {
        super(options);
    }
}

const layerCache: Record<string, Cesium.ImageryLayer | Cesium.Cesium3DTileset> = {};
const MapFunction = () => {
    const {token} = keycloak;
    const {initialized, globeController} = useGlobeController();
    const userLayerAssetArr = useRecoilValue(userLayerAssetArrState);
    const updateLayerStates = useRecoilCallback(({ set }) => () => {
        set(userLayerAssetArrState, []);
    }, []);
    const [iconLayer, setIconLayer] = useState<UserLayerAsset | null>(null);

    const layers = useRecoilValue<UserLayerAsset[]>(layersState);

    const mountainLayer = useMemo(() => {
        return layers.find((layer) => layer.name === "산마루") || null;
    }, [layers]);

    useEffect(() => {
        setIconLayer(mountainLayer);
    }, [mountainLayer]);

    useEffect(() => {
        if (!initialized || !globeController?.viewer || !iconLayer) return;
        const viewer = globeController.viewer;
        const layer = iconLayer.properties?.layer;
        if (!layer || !layer.resource) {
            console.error("Error: layer or layer.resource is undefined", layer);
            return;
        }

        const { resource } = layer;
        const dataSourceId = iconLayer.assetId;

        const existingDataSources = viewer.dataSources.getByName(dataSourceId);
        if (existingDataSources.length > 0) return;
        Cesium.GeoJsonDataSource.load(
            `${import.meta.env.VITE_GEOSERVER_WFS_SERVICE_URL}?service=WFS&version=1.1.1&request=GetFeature&typeName=${resource.name}&outputFormat=application/json`
        ).then((dataSource) => {
            const falseProperty = new Cesium.ConstantProperty(false);
            dataSource.entities.values.forEach((entity) => {
                if (entity.billboard) {
                    entity.billboard.show = falseProperty;
                }

                if (!entity.point) {
                    entity.point = new Cesium.PointGraphics({
                        pixelSize: 10,
                        color: Cesium.Color.WHITE,
                        outlineColor: Cesium.Color.RED,
                        outlineWidth: 2,
                        disableDepthTestDistance: Number.POSITIVE_INFINITY,
                    });
                }
            });

            dataSource.name = dataSourceId;
            viewer.dataSources.add(dataSource);
        }).catch((error) => {
            console.error("Failed to load WFS data", error);
        });
    }, [initialized, iconLayer]);


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
            // if (layer.type === LayerAssetType.Icon) {
            if (layer.name === "산마루") {
                toggleDataSourceVisibility(layer);
            } else {
                const imageryLayer = layerCache[layer.assetId];
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
        const imageryLayers = viewer?.scene.imageryLayers;

        if ( layerCache ) {
            Object.keys(layerCache).forEach(key => {
                const layer = layerCache[key];
                if (layer instanceof Cesium.Cesium3DTileset) {
                    tilesPrimitives?.remove(layer);
                } else {
                    imageryLayers?.remove(layer);
                }
                delete layerCache[key];
            });
        }

        [...layers].reverse().forEach(layer => {
            const {type, assetId, properties, visible} = layer;

            if (!properties || Object.keys(properties).length === 0) return;

            switch (type) {
                case LayerAssetType.Tiles3D: {
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
                            layerCache[assetId] = model;
                        });

                    break;
                }
                case LayerAssetType.Vector:
                case LayerAssetType.Raster: {
                    if(!imageryLayers) break;

                    const {layer} = properties;
                    const {resource} = layer;
                    const imageLayer = new Cesium.ImageryLayer(
                        new Cesium.WebMapServiceImageryProvider({
                            url: import.meta.env.VITE_GEOSERVER_WMS_SERVICE_URL,
                            layers: resource.name,
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
                        },
                    );

                    imageryLayers.add(imageLayer);
                    layerCache[assetId] = imageLayer;
                    break;
                }
                case LayerAssetType.Layergroup: {
                    if(!imageryLayers) break;
                    const {layerGroup} = properties;
                    const {bounds, title, workspace} = layerGroup;
                    const {minx, miny, maxx, maxy} = bounds;
                    const layerName = `${workspace.name}:${title}`;

                    const imageLayer = new Cesium.ImageryLayer(
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

                    imageryLayers.add(imageLayer);
                    layerCache[assetId] = imageLayer;
                    break;
                }
                case LayerAssetType.Cog: {
                    if(!imageryLayers) break;

                    if (!token){
                        throw new Error('No token, Cannot load COG layer.');
                        break;
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
                            imageryLayers.add(imageLayer);
                            layerCache[assetId] = imageLayer;
                        })
                        .catch(err => {
                            console.error(err);
                        });
                    break;
                }
                case LayerAssetType.VworldWms: {
                    if(!imageryLayers) break;
                    const imageLayer = new Cesium.ImageryLayer(
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

                    imageryLayers.add(imageLayer);
                    layerCache[assetId] = imageLayer;
                    break;
                }

            }
        });
    }, [initialized, layers]);

    return null;
}

export default MapFunction;