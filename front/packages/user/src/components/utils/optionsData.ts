type Option = { text: string; value: string };
type OptionArr = Option[];
type ReferenceOptionArr = Record<string, OptionArr>;

export const assetTypeOptions: OptionArr = [
    { text: "3DTile", value: "3dtile" },
    { text: "Terrain", value: "terrain" },
    { text: "Vector", value: "vector" },
    { text: "Raster", value: "raster" },
    { text: "Weather", value: "weather" },
];

export const projectionTypeOptions: OptionArr = [
    { text: "Coordinate Reference System (EPSG)", value: "epsg" },
    { text: "Projection Code (proj4)", value: "proj4" },
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
    "vector": [{ text: "AUTO", value: "auto" }],
    "raster": [{ text: "AUTO", value: "auto" }],
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
    "raster": [{ text: "AUTO", value: "auto" }],
    "weather": [{ text: "AUTO", value: "auto" }],
};
