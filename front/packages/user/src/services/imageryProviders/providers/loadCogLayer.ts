import TIFFImageryProvider from "tiff-imagery-provider";
import * as Cesium from "cesium";
import { CustomTIFFImageryProvider } from "@/components/providers/CustomTIFFImageryProvider.ts";
import { addLayerToCache } from "@/utils/layerCache.ts";
import { UserLayerAsset } from "@mnd/shared/src/types/layerset/gql/graphql.ts";

export const loadCogLayer = async (layer: UserLayerAsset, viewer: Cesium.Viewer, token?: string) => {
    if (!token) {
        throw new Error('No token provided. Cannot load COG layer.');
    }

    try {
        const provider = await TIFFImageryProvider.fromUrl(layer.properties.resource);
        const imageLayer = new Cesium.ImageryLayer(
            provider as CustomTIFFImageryProvider,
            {
                show: !!layer.visible,
            },
        );

        viewer.scene.imageryLayers.add(imageLayer);
        addLayerToCache(layer.assetId, imageLayer);

        return imageLayer;
    } catch (err) {
        console.error('Failed to load COG layer:', err);
        throw err;
    }
};