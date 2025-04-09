import * as Cesium from "cesium";

export type PrimitiveType = "billboard" | "label";

export interface BillboardProps {
  originalImage?: HTMLImageElement | ImageBitmap;
  selectedImage?: HTMLImageElement | ImageBitmap;
  label: Cesium.Label;
  properties: unknown;
}

const options = {
  base: {
    disableDepthTestDistance: Number.POSITIVE_INFINITY,
    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
  },
  billboard: {
    scaleByDistance: new Cesium.NearFarScalar(100000, 1.0, 200000, 0.5),
    translucencyByDistance: new Cesium.NearFarScalar(100000, 1.0, 200000, 0.5),
  },
  nearBillboard: {
    distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 50000),
  },
  label: {
    font: "14px NanumSquareNeo-r",
    showBackground: true,
    horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
    pixelOffset: new Cesium.Cartesian2(0, -24),
    distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 100000),
  },
  nearLabel: {
    font: "14px NanumSquareNeo-r",
    showBackground: true,
    horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
    pixelOffset: new Cesium.Cartesian2(0, -24),
    distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 50000),
  },
};

export function createCollection<T extends Cesium.BillboardCollection | Cesium.LabelCollection>(
  viewer: Cesium.Viewer,
  type: PrimitiveType
): T {
  const CollectionClass = type === "billboard" ? Cesium.BillboardCollection : Cesium.LabelCollection;
  const collection = new CollectionClass({ scene: viewer.scene }) as T;
  viewer.scene.primitives.add(collection);
  return collection;
}

export function addLabel(
  collection: Cesium.LabelCollection,
  position: Cesium.Cartesian3,
  text: string,
  isNear = false
): Cesium.Label {
  const optionSet = isNear ? options.nearLabel : options.label;

  return collection.add({
    position,
    text,
    ...options.base,
    ...optionSet,
  });
}

export function addBillboard(
  collection: Cesium.BillboardCollection,
  position: Cesium.Cartesian3,
  props: BillboardProps,
  isNear = false
): Cesium.Billboard {
  const extraOptions = isNear ? options.nearBillboard : options.billboard;

  return collection.add({
    position,
    image: props.originalImage,
    id: {
      originalImage: props.originalImage,
      selectedImage: props.selectedImage,
      label: props.label,
      properties: props.properties,
    },
    ...options.base,
    ...extraOptions,
  });
}
