import { useState, useEffect, useCallback } from 'react';
import { useLazyQuery } from '@apollo/client';
import { useGlobeController } from '@/components/providers/GlobeControllerProvider.tsx';
import { LayerAssetType, RemoteDocument, RemoteQueryVariables, UserLayerAsset } from "@mnd/shared/src/types/layerset/gql/graphql.ts";
import * as Cesium from "cesium";

export const useFlyToLayer = () => {
    const { initialized, globeController } = useGlobeController();
    const [remoteType, setRemoteType] = useState<string>('');
    const [getRemoteData, { data: remoteData }] = useLazyQuery(RemoteDocument);

    useEffect(() => {
        if (remoteData) {
            if (!initialized) return;
            const viewer = globeController?.viewer;
            if (!viewer) return;

            const { latLonBoundingBox } = remoteType === LayerAssetType.Raster
                ? remoteData.remote.coverage
                : remoteData.remote.featureType;

            if (latLonBoundingBox) {
                viewer.camera.flyTo({
                    destination: Cesium.Rectangle.fromDegrees(
                        latLonBoundingBox.minx,
                        latLonBoundingBox.miny,
                        latLonBoundingBox.maxx,
                        latLonBoundingBox.maxy
                    ),
                    duration: 2,
                });
            }
        }
    }, [remoteData, initialized, remoteType]);

    const extractPath = useCallback((url: string): string => {
        const parsedUrl = new URL(url);
        return parsedUrl.pathname + parsedUrl.search + parsedUrl.hash;
    }, []);

    const flyToLayer = useCallback((asset: UserLayerAsset) => {
        const layerType = asset.type;
        const viewer = globeController.viewer;
        if (!viewer || !layerType) return;
        setRemoteType(layerType);

        switch (layerType) {
            case LayerAssetType.Tiles3D: {
                const model = Cesium.Cesium3DTileset.fromUrl(asset?.properties.resource);
                viewer.flyTo(model, { duration: 2 });
                return;
            }
            case LayerAssetType.Raster:
            case LayerAssetType.Vector: {
                const { properties } = asset;
                const { layer } = properties;
                const { resource } = layer;

                let variables: RemoteQueryVariables = { href: resource.href };

                if (import.meta.env.MODE === 'production') {
                    const path = extractPath(resource.href);
                    const { protocol, hostname, port } = window.location;
                    const portPart = port ? `:${port}` : '';
                    const href = `${protocol}//${hostname}${portPart}${path}`;
                    variables = { href };
                }

                getRemoteData({ variables });
                return;
            }
            case LayerAssetType.Layergroup: {
                const { properties } = asset;
                const { layerGroup } = properties;
                const { minx, maxx, miny, maxy } = layerGroup.bounds;
                const extent = Cesium.Rectangle.fromDegrees(minx, miny, maxx, maxy);
                viewer.camera.flyTo({
                    destination: extent,
                    duration: 2,
                });
                return;
            }
            case LayerAssetType.Cog:
            default: {
                alert("허용되지 않는 형태입니다.");
                return;
            }
        }
    }, [globeController, extractPath, getRemoteData]);

    return { flyToLayer };
};
