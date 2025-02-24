import * as Cesium from "cesium";
import { LayerAssetType, UserLayerAsset } from "@mnd/shared/src/types/layerset/gql/graphql";
import { loadCogLayer } from "./providers/loadCogLayer";
import { loadTiles3DLayer } from "./providers/loadTiles3DLayer";
import { loadIconLayer } from "./providers/loadIconLayer";
import { loadWmsLayer } from "./providers/loadWmsLayer";
import { loadLayerGroup } from "./providers/loadLayerGroup";
import { loadVworldWmsLayer } from "./providers/loadVworldWmsLayer";
import {SetterOrUpdater} from "recoil";
import {LoadingStateType} from "@/recoils/Spinner.ts";

export const createImageryLayer = async (
    layer: UserLayerAsset,
    viewer: Cesium.Viewer,
    setLoadingState: SetterOrUpdater<LoadingStateType>,
    tilesPrimitives: Cesium.PrimitiveCollection,
    token?: string,
    ) => {
    switch (layer.type) {
        case LayerAssetType.Cog:
            return loadCogLayer(layer, viewer, token);
        case LayerAssetType.Tiles3D:
            return loadTiles3DLayer(layer, tilesPrimitives);
        case LayerAssetType.Icon:
            return loadIconLayer(layer, viewer, setLoadingState);
        case LayerAssetType.Raster:
        case LayerAssetType.Vector:
            return loadWmsLayer(layer, viewer);
        case LayerAssetType.Layergroup:
            return loadLayerGroup(layer, viewer);
        case LayerAssetType.VworldWms:
            return loadVworldWmsLayer(layer, viewer);
    }
};
