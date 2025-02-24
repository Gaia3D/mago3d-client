import * as Cesium from "cesium";
import { hexToCesiumColor } from "@/utils/common.ts";

// 공통 Primitive 생성 함수
export function createBillboardCollection(viewer: Cesium.Viewer) {
    const collection = new Cesium.BillboardCollection({ scene: viewer.scene });
    viewer.scene.primitives.add(collection);
    return collection;
}

export function createPointCollection(viewer: Cesium.Viewer) {
    const collection = new Cesium.PointPrimitiveCollection();
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
    usePoint: boolean
) {
    return collection.add({
        position,
        image: originalImage,
        id: { originalImage, selectedImage, label: labelPrimitive },
        ...(usePoint && {
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 20000),
        }),
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        verticalOrigin: Cesium.VerticalOrigin.CENTER,
    });
}

// 포인트 생성 함수
export function addPoint(
    collection: Cesium.PointPrimitiveCollection,
    position: Cesium.Cartesian3,
    color: string,
    labelPrimitive: Cesium.Label
) {
    const point = collection.add({
        position,
        pixelSize: 20,
        outlineColor: Cesium.Color.WHITE,
        outlineWidth: 1,
        color: hexToCesiumColor(color, 0.3),
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(20000, Number.POSITIVE_INFINITY),
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
    });
    point.id = { label: labelPrimitive };
    return point;
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
        font: "14px monospace",
        showBackground: true,
        backgroundColor: Cesium.Color.BLACK,
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        show: false,
    });
}
