import React, {useEffect, useState} from "react";
import * as Cesium from "cesium";
import { eventManager } from "@/components/tool/eventManager.ts";
import { GlobeController } from "@/api/GlobeController.ts";
import { getLengthUnitFactor } from "@/components/utils/unit.ts";

interface MeasureLengthProps {
    globeController: GlobeController;
    unit: string;
}

const eventGroupId = "MeasureLength";

const createPointEntity = (toolDataSource: Cesium.CustomDataSource, cartesian: Cesium.Cartesian3) => {
    toolDataSource.entities.add({
        position: cartesian,
        point: {
            pixelSize: 10,
            color: Cesium.Color.WHITE,
            outlineColor: Cesium.Color.RED,
            outlineWidth: 2,
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
        },
    });
}

const createPolylineEntity = (toolDataSource: Cesium.CustomDataSource, cartesians: Cesium.Cartesian3[]) => {
    toolDataSource.entities.add({
        polyline: {
            positions: cartesians,
            width: 2,
            material: Cesium.Color.RED,
            clampToGround: true,
        },
    });
}

const createLabelEntity = (toolDataSource: Cesium.CustomDataSource, cartesian: Cesium.Cartesian3) => {
    return toolDataSource.entities.add({
        position: cartesian,
        label: {
            text: "",
            font: "14px monospace",
            showBackground: true,
            backgroundColor: Cesium.Color.WHITE,
            horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            fillColor: Cesium.Color.RED,
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        },
    });
}

const getUnitDistance = (distance: number, unit: string): string => {
    return `${Math.round((distance / getLengthUnitFactor(unit)) * 100) / 100} ${unit}`;
};

// 선형 보간 함수
const lerp = (start: number, end: number, t: number): number => {
    return start + t * (end - start);
};

// 배열 형태의 보간값 생성 함수
const interpolateArray = (start: number, end: number, steps: number): number[] => {
    const result = [];
    for (let i = 0; i < steps; i++) {
        result.push(lerp(start, end, i / steps));
    }
    return result;
};

export const MeasureLength = ({ globeController, unit }: MeasureLengthProps) => {
    const [totalBaseLength, setTotalBaseLength] = useState(0); // 직선 거리
    const [totalTerrainLength, setTotalTerrainLength] = useState(0); // 지형 거리

    useEffect(() => {
        const { viewer, toolDataSource } = globeController;
        if (!viewer) return;

        const cartesians: Cesium.Cartesian3[] = [];
        const baseDistances: number[] = [];
        const terrainDistances: number[] = [];

        const calculateDistances = async (start: Cesium.Cartographic, end: Cesium.Cartographic, globe: Cesium.Globe) => {
            const ellipsoid = Cesium.Ellipsoid.WGS84;

            // 직선 거리 계산
            const startCartesian = Cesium.Cartesian3.fromRadians(start.longitude, start.latitude, 0, ellipsoid);
            const endCartesian = Cesium.Cartesian3.fromRadians(end.longitude, end.latitude, 0, ellipsoid);
            const baseDistance = Cesium.Cartesian3.distance(startCartesian, endCartesian);

            // 샘플링 간격 설정 (1m 단위)
            const divMeter = 1;
            const interpolationSteps = Math.max(1, Math.ceil(baseDistance / divMeter));
            const longitudes = interpolateArray(start.longitude, end.longitude, interpolationSteps);
            const latitudes = interpolateArray(start.latitude, end.latitude, interpolationSteps);

            const positions = longitudes.map((lon, idx) =>
                Cesium.Cartographic.fromRadians(lon, latitudes[idx])
            );

            // 지형 높이 샘플링
            let terrainDistance = 0;
            if (globe.terrainProvider instanceof Cesium.EllipsoidTerrainProvider) {
                console.warn("No terrain detected. Using base distance as terrain distance.");
                terrainDistance = baseDistance; // 지형 데이터가 없는 경우
            } else {
                const sampledPositions = await Cesium.sampleTerrainMostDetailed(globe.terrainProvider, positions);

                for (let i = 0; i < sampledPositions.length - 1; i++) {
                    const cartographic1 = sampledPositions[i];
                    const cartographic2 = sampledPositions[i + 1];

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
            }

            // BaseLength가 TerrainLength보다 큰 경우 보정
            if (terrainDistance < baseDistance) {
                console.warn("Terrain distance is less than base distance. Adjusting terrain distance to base distance.");
                terrainDistance = baseDistance;
            }

            return { baseDistance, terrainDistance };
        };


        const leftClickHandler = async (event: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
            const scene = viewer.scene;
            const ray = scene.camera.getPickRay(event.position);
            if (!ray) return;

            const cartesian = scene.globe.pick(ray, scene);
            if (!cartesian) return;

            const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
            cartesians.push(cartesian);

            createPointEntity(toolDataSource, cartesian);

            if (cartesians.length > 1) {
                const start = Cesium.Cartographic.fromCartesian(cartesians[cartesians.length - 2]);
                const end = cartographic;

                createPolylineEntity(toolDataSource, cartesians);

                const { baseDistance, terrainDistance } = await calculateDistances(start, end, viewer.scene.globe);

                baseDistances.push(baseDistance);
                terrainDistances.push(terrainDistance);

                setTotalBaseLength(baseDistances.reduce((sum, distance) => sum + distance, 0));
                setTotalTerrainLength(terrainDistances.reduce((sum, distance) => sum + distance, 0));

                const midPoint = Cesium.Cartesian3.midpoint(
                    cartesians[cartesians.length - 2],
                    cartesian,
                    new Cesium.Cartesian3()
                );

                const labelEntity = createLabelEntity(toolDataSource, midPoint);
                if (!labelEntity?.label) return;
                labelEntity.label.text = new Cesium.ConstantProperty(
                    `Base: ${getUnitDistance(baseDistance, unit)}\nTerrain: ${getUnitDistance(terrainDistance, unit)}`
                );
            }
        };

        const escKeyHandler = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                cartesians.length = 0;
                baseDistances.length = 0;
                terrainDistances.length = 0;
                setTotalBaseLength(0);
                setTotalTerrainLength(0);
                toolDataSource.entities.removeAll();
            }
        };

        eventManager.init(viewer);
        eventManager.addHandler(eventGroupId, Cesium.ScreenSpaceEventType.LEFT_CLICK, leftClickHandler);
        eventManager.addGlobalHandler(eventGroupId, "keydown", escKeyHandler as EventListener);

        return () => {
            toolDataSource.entities.removeAll();
            eventManager.destroyGroup(eventGroupId);
        };
    }, [globeController, unit]);

    return (
        <div className="measure-length">
            <h3>Measure Length</h3>
            <div>Total Base Length: {totalBaseLength.toFixed(2)} {unit}</div>
            <div>Total Terrain Length: {totalTerrainLength.toFixed(2)} {unit}</div>
        </div>
    );
};