import * as Cesium from "cesium";

// 공통 Primitive 생성 함수
export function createBillboardCollection(viewer: Cesium.Viewer) {
    const collection = new Cesium.BillboardCollection({ scene: viewer.scene });
    viewer.scene.primitives.add(collection);
    return collection;
}

export function createLabelCollection(viewer: Cesium.Viewer) {
    const collection = new Cesium.LabelCollection({ scene: viewer.scene });
    viewer.scene.primitives.add(collection);
    return collection;
}

// 빌보드 생성 함수
export function addBillboard(
    collection: Cesium.BillboardCollection,
    position: Cesium.Cartesian3,
    originalImage: HTMLImageElement | ImageBitmap | undefined,
    selectedImage: HTMLImageElement | ImageBitmap | undefined,
    labelPrimitive: Cesium.Label,
    properties: any
) {
    return collection.add({
        position,
        image: originalImage,
        id: { originalImage, selectedImage, label: labelPrimitive, properties: properties },
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        scaleByDistance: new Cesium.NearFarScalar(100000, 1.0, 200000, 0.5),
        translucencyByDistance: new Cesium.NearFarScalar(100000, 1.0, 200000, 0.5),
    });
}

// 라벨 생성 함수
export function addLabel(
    collection: Cesium.LabelCollection,
    position: Cesium.Cartesian3,
    labelText: string
) {
    return collection.add({
        position,
        text: labelText,
        font: "14px NanumSquareNeo-r",
        showBackground: true,
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        pixelOffset: new Cesium.Cartesian2(0, -24),
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 100000),
    });
}
