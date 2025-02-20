import * as Cesium from "cesium";

const WHITE = Cesium.Color.WHITE;
const RED = Cesium.Color.RED;
const RED_ALPHA = Cesium.Color.RED.withAlpha(0.5);
const DEPTH_FAIL_MATERIAL = new Cesium.PolylineOutlineMaterialProperty({
    color: RED,
    outlineWidth: 2,
    outlineColor: Cesium.Color.BLACK,
});

export const createPointEntity = (
    toolDataSource: Cesium.CustomDataSource,
    cartesian: Cesium.Cartesian3,
    labelText?: string,
    id?: string,
) => toolDataSource.entities.add({
    position: cartesian,
    point: {
        pixelSize: 10,
        color: WHITE,
        outlineColor: RED,
        outlineWidth: 2,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
    },
    label: labelText
        ? {
            text: labelText,
            font: "14px monospace",
            horizontalOrigin: Cesium.HorizontalOrigin.RIGHT,
            verticalOrigin: Cesium.VerticalOrigin.TOP,
            pixelOffset: new Cesium.Cartesian2(-15, 0),
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
            showBackground: true,
            backgroundPadding: new Cesium.Cartesian2(16, 8),
        }
        : undefined,
    ...(id ? { id } : {}),
});

export const createPolylineEntity = (
    toolDataSource: Cesium.CustomDataSource,
    cartesians: Cesium.Cartesian3[],
    isClamped: boolean,
    id?: string,
) => toolDataSource.entities.add({
    polyline: {
        positions: cartesians,
        width: 2,
        material: RED,
        clampToGround: isClamped,
        depthFailMaterial: DEPTH_FAIL_MATERIAL,
    },
    ...(id ? { id } : {}),
});

export const createLabelEntity = (
    toolDataSource: Cesium.CustomDataSource,
    cartesian: Cesium.Cartesian3,
    text: string,
    id?: string,
) => toolDataSource.entities.add({
    position: cartesian,
    label: {
        text,
        font: "14px monospace",
        showBackground: true,
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
    },
    ...(id ? { id } : {}),
});

export const createPolygonEntity = (
    toolDataSource: Cesium.CustomDataSource,
    cartesians: Cesium.Cartesian3[],
    id?: string,
) => toolDataSource.entities.add({
    polygon: {
        hierarchy: new Cesium.CallbackProperty(() => new Cesium.PolygonHierarchy(cartesians), false),
        material: RED_ALPHA,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
    },
    ...(id ? { id } : {}),
});

export const createEllipsoidEntity = async (
    toolDataSource: Cesium.CustomDataSource,
    start: Cesium.Cartesian3,
    end: Cesium.Cartesian3,
    globe: Cesium.Globe,
) => {
    const cartographic = Cesium.Cartographic.fromCartesian(start);
    const [sampled] = await Cesium.sampleTerrainMostDetailed(globe.terrainProvider, [cartographic]);
    const heightAdjustedPosition = Cesium.Cartesian3.fromRadians(
        sampled.longitude,
        sampled.latitude,
        sampled.height || 0
    );

    return toolDataSource.entities.add({
        position: heightAdjustedPosition,
        ellipsoid: {
            radii: new Cesium.CallbackProperty(() => {
                const distance = Cesium.Cartesian3.distance(heightAdjustedPosition, end);
                return Cesium.Cartesian3.fromElements(distance, distance, distance);
            }, true), // 변경되지 않으면 재계산하지 않도록 최적화
            material: RED_ALPHA,
            outline: true,
            outlineColor: RED,
            outlineWidth: 2,
        },
    });
};
