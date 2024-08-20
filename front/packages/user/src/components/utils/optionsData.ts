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
        { text: "AUTO", value: "auto" },
        { text: "KML", value: "kml" },
        { text: "3DS", value: "3ds" },
        { text: "DAE", value: "dae" },
        { text: "OBJ", value: "obj" },
        { text: "FBX", value: "fbx" },
        { text: "GLTF", value: "gltf" },
        { text: "GLB", value: "glb" },
        { text: "LAS", value: "las" },
        { text: "LAZ", value: "laz" },
        { text: "IFC", value: "ifc" },
        { text: "GeoJSON", value: "geojson" },
        { text: "CityGML", value: "citygml" },
        { text: "IndoorGML", value: "indoorgml" }
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
        { text: "Batched 3d Model (.b3dm)", value: "b3dm" },
        { text: "Instanced 3D Model (.i3dm)", value: "i3dm" },
        { text: "PointsColud (.pnts)", value: "pnts" },
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
