import {AssetType, ProcessTaskStatus} from "@src/generated/gql/dataset/graphql";
import {LayerAssetStatus, LayerAssetType} from "@src/generated/gql/layerset/graphql";

export const classifyAssetTypeClassNameByLayerAssetType = (assetType:LayerAssetType) => {
    switch(assetType) {
        case LayerAssetType.Cog:
        case LayerAssetType.Raster:
            return 'type-raster';
        case LayerAssetType.F4D:
        case LayerAssetType.Smarttile:
        case LayerAssetType.Tiles3D:
            return 'type-3d';
        case LayerAssetType.Vector:
            return 'type-vector';
        case LayerAssetType.Layergroup:
            return 'type-hybrid';
        default:
            return '';
    }
}

export const classifyAssetTypeClassName = (assetType:AssetType) => {
    switch(assetType) {
        case 'Imagery':
        case 'COG':
            return 'type-raster';
        case 'SHP':
        case 'KML':
        case 'GeoJSON':
            return 'type-vector';
        case 'Tiles3D':
        case 'Terrain':
        case 'CZML':
            return 'type-3d';
        default:
            return 'type-3d';
    }
}

export const classifyAssetTypeName = (assetType:AssetType) => {
    switch(assetType) {
        case 'Imagery':
        case 'COG':
            return 'Raster';
        case 'SHP':
        case 'KML':
        case 'GeoJSON':
            return 'Vector';
        case 'Tiles3D':
        case 'Terrain':
        case 'CZML':
            return '3D';
        default:
            return '3D';
    }
}

export const classifyAssetTypeAcceptFile = (assetType:AssetType) => {
    switch(assetType) {
        case 'Imagery': return {"image/tiff":[".tif",".tiff"]};
        case 'COG': return {"image/tiff":[".tif",".tiff"]};
        case 'SHP': return {"application/zip":[".zip"]};
        case 'KML': return {"application/vnd.google-earth.kml+xml": [".kml"]};
        case 'GeoJSON': return {"application/json": [".json", ".geojson"]};
        case 'Tiles3D': return {"image/*": [".png",".jpg",".jpeg",".bmp"], "application/octet-stream": [".3ds",".obj",".ifc", ".las", ".laz", ".fbx", ".gltf", ".glb", ".kml", ".dae", ".ase", ".gml", ".lxo", ".lwo", ".lws", ".x"], "application/zip":[".zip"], "application/json": [".json", ".geojson"]};
        case 'Terrain': return {"image/tiff": [".tif",".tiff"], "application/octet-stream": [".vrt"]};
        case 'CZML':
            return {};
        default:
            return {};
    }
}

export const getProcessStatusName = (status: ProcessTaskStatus, t: (key: string) => string) => {
    switch (status) {
        case 'Done':
        case 'Error':
        case 'None':
        case 'Ready':
        case 'Running':
        case 'Terminated':
        case 'Terminating':
            return t(status);
        default:
            return '없음';
    }
}
/* case ProcessRequestStatus.Ready:
            msg = '요청 대기중입니다.';
            break;
        case ProcessRequestStatus.Processing:
            msg = '요청중입니다.';
            break;
        case ProcessRequestStatus.Complete:
            msg = '성공적으로 완료되었습니다.';
            break;
        case ProcessRequestStatus.Error:
            msg = '데이터 변환요청이 실패했습니다.';
            break; */
export const getProcessStatusMessage = (status: ProcessTaskStatus, t: (key: string) => string) => {
    switch(status) {
        case 'Done': return t("transforming.done");
        case 'Error': return t("transforming.error");
        case 'None': return t("transforming.ready");
        case 'Ready': return t("transforming.ready");
        case 'Running': return t("transforming.running");
        case 'Terminated': return t("transforming.terminated");
        case 'Terminating': return t("transforming.terminating");
        default:
            return t("transforming.ready");
    }
}

export const getProcessStatusIconCssName = (status: ProcessTaskStatus) => {
    switch(status) {
        case 'Done': return 'process-end';
        case 'Error': return 'process-fail';
        case 'None': return 'process-ing-off';
        case 'Ready': return 'process-ing-off';
        case 'Running': return 'process-ing';
        case 'Terminated': return 'process-end';
        case 'Terminating': return 'process-end';
        default:
            return 'process-end-off';
    }
}

export const getProcessStatusCssName = (status: ProcessTaskStatus) => {
    switch(status) {
        case 'Done': return 'btn-s-sucess';
        case 'Error': return 'btn-s-fail';
        case 'None': return 'btn-s-ready';
        case 'Ready': return 'btn-s-ready';
        case 'Running': return 'btn-s-ing';
        case 'Terminated': return 'btn-s-sucess';
        case 'Terminating': return 'btn-s-ing';
        default:
            return 'btn-s-ready';
    }
}

export const getPublishStatusName = (status: LayerAssetStatus, t: (key: string) => string) => {
    switch(status) {
        case 'DONE': return t("publishing.done");
        case 'ERROR': return t("publishing.error");
        case 'INIT': return t("publishing.init");
        case 'READY': return t("publishing.ready");
        case 'RUNNING': return t("publishing.running");
    }
}