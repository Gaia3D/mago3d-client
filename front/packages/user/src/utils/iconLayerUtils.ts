import * as Cesium from "cesium";

export type PrimitiveType = "billboard" | "label";

export interface BillboardProps {
  originalImage?: HTMLImageElement | ImageBitmap;
  selectedImage?: HTMLImageElement | ImageBitmap;
  label: Cesium.Label;
  properties: unknown;
}

export function createCollection<T extends Cesium.BillboardCollection | Cesium.LabelCollection>(
  viewer: Cesium.Viewer,
  type: PrimitiveType
): T {
  const CollectionClass = type === "billboard" ? Cesium.BillboardCollection : Cesium.LabelCollection;
  const collection = new CollectionClass({ scene: viewer.scene }) as T;
  viewer.scene.primitives.add(collection);
  return collection;
}

export function getOptions(minDistance: number, maxDistance: number) {
  const safeMin = Math.min(minDistance, maxDistance);
  const safeMax = Math.max(minDistance, maxDistance);

  return {
    base: {
      disableDepthTestDistance: 100000,
      heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
    },
    billboard: {
      scaleByDistance: new Cesium.NearFarScalar(100000, 1.0, 200000, 0.5),
      translucencyByDistance: new Cesium.NearFarScalar(100000, 1.0, 200000, 0.5),
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(safeMin, safeMax || Infinity),
    },
    nearBillboard: {
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(safeMin, Math.min(safeMax, 20000)),
    },
    label: {
      font: "14px NanumSquareNeo-r",
      showBackground: true,
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      pixelOffset: new Cesium.Cartesian2(0, -24),
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(safeMin, Math.min(safeMax, 100000)),
    },
    nearLabel: {
      font: "14px NanumSquareNeo-r",
      showBackground: true,
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      pixelOffset: new Cesium.Cartesian2(0, -24),
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(safeMin, Math.min(safeMax, 20000)),
    },
  };
}


export function addLabel(
  collection: Cesium.LabelCollection,
  position: Cesium.Cartesian3,
  text: string,
  isNear = false,
  opts: ReturnType<typeof getOptions>
): Cesium.Label {
  const optionSet = isNear ? opts.nearLabel : opts.label;
  return collection.add({
    position,
    text,
    ...opts.base,
    ...optionSet,
  });
}

export function addBillboard(
  collection: Cesium.BillboardCollection,
  position: Cesium.Cartesian3,
  props: BillboardProps,
  isNear = false,
  opts: ReturnType<typeof getOptions>
): Cesium.Billboard {
  const optionSet = isNear ? opts.nearBillboard : opts.billboard;
  return collection.add({
    position,
    image: props.originalImage,
    id: {
      originalImage: props.originalImage,
      selectedImage: props.selectedImage,
      label: props.label,
      properties: props.properties,
    },
    ...opts.base,
    ...optionSet,
  });
}
