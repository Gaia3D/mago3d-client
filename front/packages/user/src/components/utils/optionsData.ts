import {AssetType, InterpolationType, T3DFormatType, Type} from "@mnd/shared/src/types/dataset/gql/graphql.ts";

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
    { text: "aside.asset.crs-epsg", value: "epsg" },
    { text: "aside.asset.projection-code", value: "proj4" },
];
export const InterpolationTypeOptions: OptionArr = [
    { text: "Bilinear (Linear)", value: InterpolationType.Bilinear },
    { text: "Nearest", value: InterpolationType.Nearest },
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
        // { text: "AUTO", value: "auto" },
        { text: "GeoJSON (*.geojson)", value: AssetType.GeoJson },
        { text: "Shp (*.shp)", value: AssetType.Shp },
    ],
    "raster": [
        // { text: "AUTO", value: "auto" },
        { text: "Imagery (*.tif, *.tiff)", value: AssetType.Imagery },
        { text: "COG (*.tif, *.tiff)", value: AssetType.Cog },
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
        { text: "AUTO", value: ''},
        { text: "Byte", value: Type.Byte },
        { text: "Int8", value: Type.Int8 },
        { text: "UInt16", value: Type.UInt16 },
        { text: "Int16", value: Type.Int16 },
        { text: "UInt32", value: Type.UInt32 },
        { text: "Int32", value: Type.Int32 },
        { text: "UInt64", value: Type.UInt64 },
        { text: "Int64", value: Type.Int64 },
        { text: "Float32", value: Type.Float32 },
        { text: "Float64", value: Type.Float64 },
        { text: "CInt16", value: Type.CInt16 },
        { text: "CInt32", value: Type.CInt32 },
        { text: "CFloat32", value: Type.CFloat32 },
        { text: "CFloat64", value: Type.CFloat64 }
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