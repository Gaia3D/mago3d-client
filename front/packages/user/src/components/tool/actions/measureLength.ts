import * as Cesium from "cesium";
import { eventManager } from "@/components/tool/actions/eventManager.ts";
import { GlobeController } from "@/api/GlobeController.ts";
import { getUnitFactor } from "@/components/tool/actions/index.ts";

const color = Cesium.Color.WHITE;
const outlineColor = Cesium.Color.RED;
const bgColor = Cesium.Color.WHITE.withAlpha(1);
const cartesians: Cesium.Cartesian3[] = [];
const segmentDistances: number[] = []; // 각 구간의 거리를 저장

const getUnitDistance = (distance: number, unit: string): string => {
    return `${Math.round((distance / getUnitFactor(unit)) * 100) / 100} ${unit}`;
};

export const createMeasureLength = (globeController: GlobeController, unit: string) => {
    const { viewer, toolDataSource } = globeController;
    if (!viewer) return;

    const scene = viewer.scene;
    const globe = scene.globe;

    eventManager.init(viewer);

    const calculateTerrainDistance = async (start: Cesium.Cartographic, end: Cesium.Cartographic) => {
        if (!(globe.terrainProvider instanceof Cesium.EllipsoidTerrainProvider)) {
            const positions = await Cesium.sampleTerrainMostDetailed(globe.terrainProvider, [start, end]);

            let terrainDistance = 0;
            for (let i = 0; i < positions.length - 1; i++) {
                const cartographic1 = positions[i];
                const cartographic2 = positions[i + 1];
                const cartesian1 = Cesium.Cartesian3.fromRadians(
                    cartographic1.longitude,
                    cartographic1.latitude,
                    cartographic1.height
                );
                const cartesian2 = Cesium.Cartesian3.fromRadians(
                    cartographic2.longitude,
                    cartographic2.latitude,
                    cartographic2.height
                );
                terrainDistance += Cesium.Cartesian3.distance(cartesian1, cartesian2);
            }
            return terrainDistance;
        } else {
            console.warn("Terrain provider does not support tile availability. Returning straight-line distance.");
            const cartesianStart = Cesium.Cartesian3.fromRadians(start.longitude, start.latitude, start.height);
            const cartesianEnd = Cesium.Cartesian3.fromRadians(end.longitude, end.latitude, end.height);
            return Cesium.Cartesian3.distance(cartesianStart, cartesianEnd);
        }
    };

    const leftClickHandler = async (event: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
        const ray = scene.camera.getPickRay(event.position);
        if (!ray) return;

        const cartesian = scene.globe.pick(ray, scene);
        if (!cartesian) return;

        const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
        cartesians.push(cartesian);

        // 클릭한 위치에 포인트 생성
        toolDataSource.entities.add({
            position: cartesian,
            point: {
                pixelSize: 10,
                color: color,
                outlineColor: outlineColor,
                outlineWidth: 2,
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
            },
        });

        // 두 번째 점 이상부터는 폴리라인과 라벨 생성
        if (cartesians.length > 1) {
            const start = Cesium.Cartographic.fromCartesian(cartesians[cartesians.length - 2]);
            const end = cartographic;

            // 폴리라인 생성
            toolDataSource.entities.add({
                polyline: {
                    positions: cartesians,
                    width: 2,
                    material: outlineColor,
                    clampToGround: true,
                },
            });

            // 지형 거리를 계산하여 라벨에 표시
            const terrainDistance = await calculateTerrainDistance(start, end);
            segmentDistances.push(terrainDistance);
            const totalLength = segmentDistances.reduce((sum, distance) => sum + distance, 0);
            console.log(`Total length: ${getUnitDistance(totalLength, unit)}`);

            // 중간 지점 계산
            const midPoint = Cesium.Cartesian3.midpoint(
                cartesians[cartesians.length - 2],
                cartesian,
                new Cesium.Cartesian3()
            );

            // 라벨 표시
            toolDataSource.entities.add({
                position: midPoint,
                label: {
                    text: getUnitDistance(terrainDistance, unit),
                    font: "14px monospace",
                    showBackground: true,
                    backgroundColor: bgColor,
                    horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                    fillColor: outlineColor,
                    disableDepthTestDistance: Number.POSITIVE_INFINITY,
                },
            });
        }
    };

    const escKeyHandler = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
            cartesians.length = 0;
            segmentDistances.length = 0;
            toolDataSource.entities.removeAll(); // ESC로 초기화
        }
    };

    // 등록된 Cesium 이벤트 핸들러
    eventManager.addHandler(Cesium.ScreenSpaceEventType.LEFT_CLICK, leftClickHandler);

    // 키보드 ESC 이벤트 추가
    window.addEventListener("keydown", escKeyHandler);
};

export const removeMeasureLength = (globeController: GlobeController) => {
    const { viewer, toolDataSource } = globeController;
    if (!viewer) return;

    toolDataSource.entities.removeAll();
    eventManager.destroy();
};
