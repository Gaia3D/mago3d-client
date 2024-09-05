import {T3DFormatType} from "@mnd/shared/src/types/dataset/gql/graphql.ts";

type Option = { text: string; value: string };
type OptionArr = Option[];
type ReferenceOptionArr = Record<string, OptionArr>;

export const assetTypeOptions: OptionArr = [
    { text: "3DTile", value: "3dtile" },
    { text: "Terrain", value: "terrain" },
    { text: "Vector", value: "vector" },
    { text: "Raster", value: "raster" },
    // { text: "Weather", value: "weather" },
];

export const projectionTypeOptions: OptionArr = [
    { text: "Coordinate Reference System (EPSG)", value: "epsg" },
    { text: "Projection Code (proj4)", value: "proj4" },
];
export const InterpolationTypeOptions: OptionArr = [
    { text: "Bilinear (Linear)", value: "linear" },
    { text: "Nearest", value: "nearest" },
];

export const inputFormatOptions: ReferenceOptionArr = {
    "3dtile": [
        // { text: "AUTO", value: "auto" },
        { text: "FBX (*.fbx)", value: T3DFormatType.Fbx },
        { text: "GLTF (*.gltf)", value: T3DFormatType.Gltf },
        { text: "GLB (*.glb)", value: T3DFormatType.Glb },
        { text: "KML (*.kml)", value: T3DFormatType.Kml },
        { text: "COLLADA (*.dae)", value: T3DFormatType.Collada },
        { text: "MAX_3DS (*.3ds)", value: T3DFormatType.Max_3Ds },
        { text: "MAX_ASE (*.ase)", value: T3DFormatType.MaxAse },
        { text: "OBJ (*.obj)", value: T3DFormatType.Obj },
        { text: "IFC (*.ifc)", value: T3DFormatType.Ifc },
        { text: "CITY_GML (*.gml)", value: T3DFormatType.CityGml },
        { text: "INDOOR_GML (*.gml)", value: T3DFormatType.IndoorGml },
        { text: "LAS (*.las) (*.laz)", value: T3DFormatType.Las },
        { text: "LAZ (*.laz)", value: T3DFormatType.Laz },
        { text: "MODO (*.lxo)", value: T3DFormatType.Modo },
        { text: "LWO (*.lwo)", value: T3DFormatType.Lwo },
        { text: "LWS (*.lws)", value: T3DFormatType.Lws },
        { text: "DirectX (*.x)", value: T3DFormatType.DirectX },
        { text: "GeoJSON (*.geojson)", value: T3DFormatType.Geojson },
        { text: "Shp (*.shp)", value: T3DFormatType.Shp },
    ],
    "terrain": [{ text: "AUTO", value: "auto" }],
    "vector": [
        { text: "AUTO", value: "auto" },
        { text: "GeoJSON", value: "geojson" },
        { text: "SHP", value: "shp" },
    ],
    "raster": [
        { text: "AUTO", value: "auto" },
        { text: "Imagery", value: "imagery" },
        { text: "COG", value: "cog" },
    ],
    "weather": [{ text: "AUTO", value: "auto" }]
};

export const outputFormatOptions: ReferenceOptionArr = {
    "3dtile": [
        { text: "AUTO", value: "auto" },
        // { text: "Batched 3d Model (.b3dm)", value: "b3dm" },
        // { text: "Instanced 3D Model (.i3dm)", value: "i3dm" },
        // { text: "PointsColud (.pnts)", value: "pnts" },
    ],
    "terrain": [{ text: "AUTO", value: "auto" }],
    "vector": [{ text: "AUTO", value: "auto" }],
    "raster": [
        { text: "AUTO", value: "auto" },
        { text: "Byte", value: "byte" },
        { text: "Int8", value: "int8" },
        { text: "UInt16", value: "uint16" },
        { text: "Int16", value: "int16" },
        { text: "UInt32", value: "uint32" },
        { text: "Int32", value: "int32" },
        { text: "UInt64", value: "uint64" },
        { text: "Int64", value: "int64" },
        { text: "Float32", value: "float32" },
        { text: "Float64", value: "float64" },
        { text: "CInt16", value: "cint16" },
        { text: "CInt32", value: "cint32" },
        { text: "CFloat32", value: "cfloat32" },
        { text: "CFloat64", value: "cfloat64" }
    ],
    "weather": [{ text: "AUTO", value: "auto" }],
};

export const classifyAssetTypeAcceptFile = (assetType: string): { [key: string]: string[] } | undefined => {
    switch(assetType) {
        case '3dtile':
            return {
                "application/vnd.google-earth.kml+xml": [".kml"],
                "application/json": [".json", ".geojson"],
                "image/*": [".png",".jpg",".jpeg",".bmp"],
                "application/octet-stream": [".3ds",".obj",".ifc", ".las", ".laz", ".fbx", ".gltf", ".glb", ".kml", ".dae", ".ase", ".gml", ".lxo", ".lwo", ".lws", ".x"],
                "application/zip":[".zip"]
            };
        case 'terrain':
            return {
                "image/tiff": [".tif",".tiff"],
                "application/octet-stream": [".vrt"],
                "application/zip":[".zip"]
            };
        case 'raster':
            return {
                "image/tiff":[".tif",".tiff"],
                "application/zip":[".zip"]
            };
        case 'vector':
            return {
                "application/json": [".json", ".geojson"],
                "application/zip":[".zip"]
            };
        default:
            return undefined;  // 빈 객체 대신 undefined 반환
    }
}