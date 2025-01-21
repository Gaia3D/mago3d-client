import React, {useEffect, useState} from "react";
import * as Cesium from "cesium";
import { eventManager } from "@/components/tool/actions/eventManager.ts";
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

const MeasureLength = ({ globeController, unit }: MeasureLengthProps) => {
    const [totalLength, setTotalLength] = useState(0);

    useEffect(() => {
        const { viewer, toolDataSource } = globeController;

        if (!viewer) return;
        const cartesians: Cesium.Cartesian3[] = [];
        const segmentDistances: number[] = [];

        const calculateTerrainDistance = async (start: Cesium.Cartographic, end: Cesium.Cartographic) => {
            const globe = viewer.scene.globe;

            // 두 점 사이를 일정 간격으로 분할하여 지형 샘플링
            const interpolationSteps = 100; // 분할 개수
            const longitudes = interpolateArray(start.longitude, end.longitude, interpolationSteps);
            const latitudes = interpolateArray(start.latitude, end.latitude, interpolationSteps);
            const positions = longitudes.map((lon, idx) =>
                Cesium.Cartographic.fromRadians(lon, latitudes[idx])
            );

            // terrain이 없는 경우 EllipsoidTerrainProvider를 사용하여 처리
            if (globe.terrainProvider instanceof Cesium.EllipsoidTerrainProvider) {
                console.warn("No terrain detected. Using Ellipsoid for distance calculation.");
                let ellipsoidDistance = 0;
                for (let i = 0; i < positions.length - 1; i++) {
                    const cartesian1 = Cesium.Cartesian3.fromRadians(
                        positions[i].longitude,
                        positions[i].latitude,
                        0
                    );
                    const cartesian2 = Cesium.Cartesian3.fromRadians(
                        positions[i + 1].longitude,
                        positions[i + 1].latitude,
                        0
                    );
                    ellipsoidDistance += Cesium.Cartesian3.distance(cartesian1, cartesian2);
                }
                return ellipsoidDistance;
            }

            // terrain이 있는 경우 샘플링 후 처리
            const sampledPositions = await Cesium.sampleTerrainMostDetailed(
                globe.terrainProvider,
                positions
            );

            let terrainDistance = 0;
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
            return terrainDistance;
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

                const terrainDistance = await calculateTerrainDistance(start, end);
                segmentDistances.push(terrainDistance);

                setTotalLength(segmentDistances.reduce((sum, distance) => sum + distance, 0));

                const midPoint = Cesium.Cartesian3.midpoint(
                    cartesians[cartesians.length - 2],
                    cartesian,
                    new Cesium.Cartesian3()
                );

                const labelEntity = createLabelEntity(toolDataSource, midPoint);
                if (!labelEntity?.label) return;
                labelEntity.label.text = new Cesium.ConstantProperty(getUnitDistance(terrainDistance, unit));
            }
        };

        const escKeyHandler = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                cartesians.length = 0;
                segmentDistances.length = 0;
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
            <h3>Measure Terrain Length</h3>
            <div>total length: {totalLength.toFixed(2)} {unit}</div>
        </div>
    );
};

export default MeasureLength;
