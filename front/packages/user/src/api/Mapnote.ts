import { DrawType } from "@/hooks/useAnalGeometryDraw";
import { MapNote } from "@mnd/shared/src/types/bbs-gen-type";
import { Feature, GeoJSONObject, Geometry, GeometryCollection, Point, Position, Properties } from "@turf/turf";
import * as Cesium from 'cesium';
import { centerOfMass, lineString, polygon, bboxPolygon, getCoord, getGeom } from "@turf/turf";

export const getThumbnailId = (note: MapNote) => {
    let thumbnailId = `0`;
	if (note.symbols && note.symbols.length > 0) {
		const symbol = note.symbols[note.symbols.length - 1];
		const file = symbol.files[symbol.files.length - 1];
		thumbnailId = file.id;
	}

    return thumbnailId;
}
export const getThumbnailFullPath = (id:string | number) : string => {
    return `${import.meta.env.VITE_SYMBOL_THUMBNAIL_DOWNLOAD_URL}/${id}`;
}

export const getCoordinatesFromMapNote = (note: MapNote) => {
    const drawGeometry: Geometry | GeometryCollection = JSON.parse(note.drawGeometry);
    const { type } = drawGeometry;

    if (type !== 'GeometryCollection') {
        return getTypeNCartesians(drawGeometry as Geometry);
    } else {
        const { geometries } = drawGeometry as GeometryCollection;
        const geometry = geometries[0];
        return getTypeNCartesians(geometry as Geometry)
    }
}

const getTypeNCartesians = (geometry: Geometry) => {
    const { type } = geometry;
    return { type, coordinates: getCoordinates(geometry) };
}

export const getCoordinates = (geometry: Geometry) => {
    const { type, coordinates } = geometry;
    if (type === 'Point') {
        const [lon, lat] = coordinates as Position;
        return Cesium.Cartesian3.fromDegrees(lon, lat);
    } if (type === 'LineString') {
        return (coordinates as Position[]).map(([lon, lat]) => Cesium.Cartesian3.fromDegrees(lon, lat));
    }
    else {
        return (coordinates[0] as Position[]).map(([lon, lat]) => Cesium.Cartesian3.fromDegrees(lon, lat));
    }
}

export const getCenter = (cartesians:Cesium.Cartesian3[], type :string | DrawType) => {
    const coordinatesDegree = type !== DrawType.Box ? cartesians.map(cartesian => {
        const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
        return [Cesium.Math.toDegrees(cartographic.longitude), Cesium.Math.toDegrees(cartographic.latitude)];
    }) : (()=> {
        const [lon1, lat1, lon2, lat2] = cartesians.map(cartesian => {
            const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
            return [Cesium.Math.toDegrees(cartographic.longitude), Cesium.Math.toDegrees(cartographic.latitude)];
        }).flat();
        return bboxPolygon([lon1, lat1, lon2, lat2]).geometry.coordinates[0];
    })();

    let center:Feature<Point, Properties>|null = null;
    if (type === 'LineString' || type === DrawType.Line) {
        center = centerOfMass(lineString(coordinatesDegree));
    } else if (type === 'Polygon' || type === DrawType.Box || type === DrawType.Polygon) {
        coordinatesDegree.push(coordinatesDegree[0]);
        center = centerOfMass(polygon([coordinatesDegree]));
    }

    if (center === null) {
        throw new Error('Invalid type');
    }

    const [lon, lat] = center.geometry.coordinates;
    return Cesium.Cartesian3.fromDegrees(lon, lat);
}

export const getCenterFromMapNote = (mapNote: MapNote) => {
    const drawGeometry: GeoJSONObject = JSON.parse(mapNote.drawGeometry);
    return extractCenterFromGeojson(drawGeometry);
}

export const getCameraPositionFromMapNote = (mapNote: MapNote) => {
    if (!mapNote.cameraPosition) return;
    const cameraPosition: GeometryCollection = JSON.parse(mapNote.cameraPosition);
    const {geometries} = cameraPosition;
    const point = geometries[0] as Point;
    const [lon, lat, height] = getCoord(point);
    
    return Cesium.Cartesian3.fromDegrees(lon, lat, height || 5000);
}

const extractCenterFromGeojson = (geojson: GeoJSONObject, height= 5000) => {
    const center = centerOfMass(geojson);
    const [lon, lat] = getCoord(center);
    return Cesium.Cartesian3.fromDegrees(lon, lat, height);
}