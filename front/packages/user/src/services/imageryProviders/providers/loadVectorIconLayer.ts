import {
  LayerStyle,
  UserLayerAsset,
} from "@mnd/shared/src/types/layerset/gql/graphql.ts";
import * as Cesium from "cesium";
import { SetterOrUpdater } from "recoil";
import { LoadingStateType } from "@/recoils/Spinner.ts";
import { getInstance } from "@/api/GlobeController.ts";
import {
  addBillboard,
  addLabel,
  createCollection,
  getOptions,
} from "@/utils/iconLayerUtils.ts";

export const loadVectorIconLayer = async (
  layer: UserLayerAsset,
  style: LayerStyle,
  viewer: Cesium.Viewer,
  setLoadingState: SetterOrUpdater<LoadingStateType>
) => {
  if (!viewer || !style?.context || !layer?.properties?.layer?.name || !layer.visible) return;

  const globeController = getInstance();
  if (globeController.primitiveMap.has(layer.assetId)) return;

  setLoadingState({ loading: true, msg: "" });

  const context = style.context;
  const layerName = layer.properties.layer.resource.name;

  const iconImage = await loadIconImage(context.iconStyle.images[0], setLoadingState);
  if (!iconImage) return;

  const datasource = await loadGeoJson(layerName, setLoadingState);
  if (!datasource) return;

  const entities = datasource.entities?.values ?? [];
  if (entities.length === 0) {
    setLoadingState({ loading: false, msg: "표시할 데이터가 없습니다." });
    return;
  }

  const collections = createAllCollections(viewer);
  const opts = getOptionsFromContext(context);

  renderEntities({
    entities,
    context,
    collections,
    opts,
    iconImage,
    globeController,
    layer,
    setLoadingState,
  });
};

const loadIconImage = async (
  url: string,
  setLoadingState: SetterOrUpdater<LoadingStateType>
): Promise<HTMLImageElement | ImageBitmap | null> => {
  try {
    const image = await Cesium.Resource.fetchImage({url});
    if (!image) throw new Error("iconImage is null");
    return image;
  } catch (e) {
    console.error("아이콘 이미지 로드 실패:", e);
    setLoadingState({ loading: false, msg: "아이콘 이미지 로드 실패" });
    return null;
  }
};

const loadGeoJson = async (
  layerName: string,
  setLoadingState: SetterOrUpdater<LoadingStateType>
): Promise<Cesium.GeoJsonDataSource | null> => {
  const url = `${import.meta.env.VITE_GEOSERVER_WFS_SERVICE_URL}service=WFS&version=2.0.0&request=GetFeature&typeName=${layerName}&outputFormat=application/json`;
  try {
    return await Cesium.GeoJsonDataSource.load(url);
  } catch (e) {
    console.error("GeoJSON 데이터 로드 실패:", e);
    setLoadingState({ loading: false, msg: "GeoJSON 데이터 로드 실패" });
    return null;
  }
};

const createAllCollections = (viewer: Cesium.Viewer) => ({
  billboardCollection: createCollection<Cesium.BillboardCollection>(viewer, "billboard"),
  nearBillboardCollection: createCollection<Cesium.BillboardCollection>(viewer, "billboard"),
  labelCollection: createCollection<Cesium.LabelCollection>(viewer, "label"),
  nearLabelCollection: createCollection<Cesium.LabelCollection>(viewer, "label"),
});

const getOptionsFromContext = (context: LayerStyle["context"]) => {
  const scale = context.iconStyle.scale;
  const min = getCameraDistanceFromScale(context.minScale);
  const max = context.maxScale ? getCameraDistanceFromScale(context.maxScale) : Number.POSITIVE_INFINITY;
  return getOptions(min, max, scale);
};

const renderEntities = ({
  entities,
  context,
  collections,
  opts,
  iconImage,
  globeController,
  layer,
  setLoadingState,
}: {
  entities: Cesium.Entity[];
  context: LayerStyle["context"];
  collections: ReturnType<typeof createAllCollections>;
  opts: ReturnType<typeof getOptions>;
  iconImage: HTMLImageElement | ImageBitmap;
  globeController: ReturnType<typeof getInstance>;
  layer: UserLayerAsset;
  setLoadingState: SetterOrUpdater<LoadingStateType>;
}) => {
  const BATCH_SIZE = 300;
  let index = 0;
  const isLabel = !!context.labelStyle;

  const batch = () => {
    const now = Cesium.JulianDate.now();
    const end = Math.min(index + BATCH_SIZE, entities.length);

    for (let i = index; i < end; i++) {
      const entity = entities[i];
      ensureEntityPosition(entity);
      const position = entity.position?.getValue(now);
      if (!position) {
        console.warn(`엔티티 ${i} 위치 없음`);
        continue;
      }

      const labelText = isLabel
        ? getLabelText(context.labelStyle.attributeName, entity)
        : undefined;

      const label = isLabel
        ? addLabel(collections.labelCollection, position, labelText!, false, opts)
        : undefined;

      const nearLabel = isLabel
        ? addLabel(collections.nearLabelCollection, position, labelText!, true, opts)
        : undefined;

      addBillboard(collections.billboardCollection, position, {
        originalImage: iconImage,
        selectedImage: iconImage,
        label,
        properties: entity.properties,
      }, false, opts);

      addBillboard(collections.nearBillboardCollection, position, {
        originalImage: iconImage,
        selectedImage: iconImage,
        label: nearLabel,
        properties: entity.properties,
      }, true, opts);
    }
    console.log("entities.length", entities.length);
    index = end;
    if (index < entities.length) {
      requestAnimationFrame(batch);
    } else {
      console.log("layer.assetId", layer.assetId);
      globeController.primitiveMap.set(layer.assetId, collections);
      setLoadingState({ loading: false, msg: "" });
    }
  };

  requestAnimationFrame(batch);
};

const getLabelText = (attribute: string, entity: Cesium.Entity): string => {
  const raw = entity.properties?.[attribute];
  const val = raw?._value ?? raw;
  return val != null ? String(val) : "속성 없음";
};

function ensureEntityPosition(entity: Cesium.Entity): void {
  if (entity.position) return;
  const now = Cesium.JulianDate.now();

  if (entity.polygon?.hierarchy) {
    const hierarchy = entity.polygon.hierarchy.getValue(now);
    if (hierarchy?.positions?.length > 0) {
      const center = Cesium.BoundingSphere.fromPoints(hierarchy.positions).center;
      entity.position = new Cesium.ConstantPositionProperty(center);
    }
  }

  if (!entity.position && entity.polyline?.positions) {
    const positions = entity.polyline.positions.getValue(now);
    if (positions?.length > 0) {
      entity.position = new Cesium.ConstantPositionProperty(positions[0]);
    }
  }
}

export const getCameraDistanceFromScale = (
  scaleDenominator: number,
  screenWidthInPixels = 1920,
  dpi = 96,
  fovDegrees = 60
): number => {
  if (scaleDenominator === undefined) return Number.MAX_SAFE_INTEGER;

  const inchesPerPixel = 1 / dpi;
  const metersPerPixel = inchesPerPixel * 0.0254;
  const visibleGround = scaleDenominator * metersPerPixel * screenWidthInPixels;
  const halfFov = (fovDegrees * Math.PI) / 180 / 2;

  return (visibleGround / 2) / Math.tan(halfFov);
};
