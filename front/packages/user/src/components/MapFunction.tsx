import {useRecoilState, useRecoilValue} from "recoil";
import {useGlobeController} from "./providers/GlobeControllerProvider";
import {layersState, visibleToggledLayerIdState, visibleToggledLayerIdsState} from "@/recoils/Layer";
import {useEffect} from "react";
import {LayerAssetType, UserLayerAsset} from "@mnd/shared/src/types/layerset/gql/graphql";
import TIFFImageryProvider, {TIFFImageryProviderOptions} from 'tiff-imagery-provider';
import * as Cesium from "cesium";
import keycloak from "@/api/keycloak";
import {loadGeojson, loadGridGeojson} from "@/components/utils/loadGeojson.ts";

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
    const [visibleToggledLayerId, setVisibleToggledLayerId] = useRecoilState<string | null>(visibleToggledLayerIdState);
    const [visibleToggledLayerIds, setVisibleToggledLayerIds] = useRecoilState<{ids:string[], visible:boolean} | null>(visibleToggledLayerIdsState);
    
    const layers = useRecoilValue<UserLayerAsset[]>(layersState);
    const toggle = (id:string, visible?:boolean) => {
      const layer = layerCache[id];
      if (!layer) return;
      layer.show = visible === undefined ? !layer.show : visible;
    }
    useEffect(() => {
        if (visibleToggledLayerId === null) return;
        toggle(visibleToggledLayerId);
        setVisibleToggledLayerId(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visibleToggledLayerId]);

    useEffect(() => {
      if (!initialized) return;
      const viewer = globeController?.viewer;
      const tempUrl = "/user/geojson/extrusion.geojson";
      loadGeojson(viewer, tempUrl);

      //const gridUrl = "/geomatic-user/geojson/grid_4326.geojson";
      //loadGridGeojson(viewer, gridUrl).then(r => {console.log(r);});

    }, [initialized]);

    useEffect(() => {
      if (visibleToggledLayerIds === null) return;
      const {ids, visible} = visibleToggledLayerIds;
      ids.forEach((id)=>toggle(id, visible));
      setVisibleToggledLayerIds(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visibleToggledLayerIds]);

    
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
                    Cesium.Cesium3DTileset.fromUrl(resource)
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
            }
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialized, layers]);
    
    return null;
}

export default MapFunction;