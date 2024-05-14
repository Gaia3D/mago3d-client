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
        case 'Tiles3D': return {"image/*": [".png",".jpg",".jpeg",".bmp"], "application/octet-stream": [".3ds",".obj",".ifc", ".las", ".laz", ".fbx", ".gltf", ".glb", ".kml", ".dae", ".ase", ".gml", ".lxo", ".lwo", ".lws", ".x"], "application/zip":[".zip"]};
        case 'Terrain': return {"image/tiff": [".tif",".tiff"], "application/octet-stream": [".vrt"]};
        case 'CZML':
            return {};
        default:
            return {};
    }
}

export const getProcessStatusName = (status: ProcessTaskStatus) => {
    switch(status) {
        case 'Done': return '완료';
        case 'Error': return '에러';
        case 'None': return '없음';
        case 'Ready': return '준비';
        case 'Running': return '진행중';
        case 'Terminated': return '종료';
        case 'Terminating': return '종료중';
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
export const getProcessStatusMessage = (status: ProcessTaskStatus) => {
    switch(status) {
        case 'Done': return '성공적으로 완료되었습니다.';
        case 'Error': return '데이터 변환요청이 실패했습니다.';
        case 'None': return '요청 대기중입니다.';
        case 'Ready': return '요청 대기중입니다.';
        case 'Running': return '변환중입니다.';
        case 'Terminated': return '변환 종료 되었습니다';
        case 'Terminating': return '변환 종료중 입니다.';
        default:
            return '요청 대기중입니다.';
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

export const getPublishStatusName = (status: LayerAssetStatus) => {
    switch(status) {
        case 'DONE': return '발행 성공';
        case 'ERROR': return '발행 실패';
        case 'INIT': return '발행 대기중';
        case 'READY': return '발행 준비중';
        case 'RUNNING': return '발행 진행중';
    }
}