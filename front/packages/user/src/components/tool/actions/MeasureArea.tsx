import React, { useEffect, useState } from "react";
import * as Cesium from "cesium";
import { polygon as turfPolygon, area as turfArea } from "@turf/turf";
import { GlobeController } from "@/api/GlobeController.ts";
import { eventManager } from "@/components/tool/actions/eventManager.ts";
import { getAreaUnitFactor } from "@/components/utils/unit.ts";

interface MeasureAreaProps {
    globeController: GlobeController;
    unit: string;
}

const eventGroupId = "MeasureArea";

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

const createPolygonEntity = (toolDataSource: Cesium.CustomDataSource, cartesians: Cesium.Cartesian3[]) => {
    toolDataSource.entities.add({
        polygon: {
            hierarchy: new Cesium.CallbackProperty(() => new Cesium.PolygonHierarchy(cartesians), false),
            material: Cesium.Color.RED.withAlpha(0.5),
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        },
        id: "areaPolygon",
    });
};

const createLabelEntity = (toolDataSource: Cesium.CustomDataSource) => {
    toolDataSource.entities.add({
        position: Cesium.Cartesian3.fromDegrees(0, 0),
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
        id: "areaLabel",
    });
};

const calculateTerrainArea = async (cartesians: Cesium.Cartesian3[], globe: Cesium.Globe) => {
    const ellipsoid = Cesium.Ellipsoid.WGS84;
    const cartographics = cartesians.map((cartesian) => Cesium.Cartographic.fromCartesian(cartesian));
    const polygonCoords: [number, number, number][] = [];

    // 지형 높이 샘플링
    let sampledCartographics: Cesium.Cartographic[] = [];

    if (globe.terrainProvider instanceof Cesium.EllipsoidTerrainProvider) {
        console.warn("No terrain detected. Using ellipsoid-based heights for area calculation.");
        sampledCartographics = cartographics.map((cartographic) => {
            const height = ellipsoid.cartesianToCartographic(
                Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 0)
            ).height;
            return new Cesium.Cartographic(cartographic.longitude, cartographic.latitude, height);
        });
    } else {
        sampledCartographics = await Cesium.sampleTerrainMostDetailed(globe.terrainProvider, cartographics);
    }

    // 좌표 데이터 생성
    sampledCartographics.forEach((cartographic) => {
        polygonCoords.push([
            Cesium.Math.toDegrees(cartographic.longitude),
            Cesium.Math.toDegrees(cartographic.latitude),
            cartographic.height || 0,
        ]);
    });

    // 첫 번째 좌표를 끝에 추가
    if (polygonCoords.length > 0) {
        polygonCoords.push([...polygonCoords[0]]);
    }

    // 2D 면적 계산 (Turf.js)
    const polygon2D = turfPolygon([polygonCoords.map(([lon, lat]) => [lon, lat])]);
    const baseArea = turfArea(polygon2D);

    // 3D 면적 계산
    const terrainArea = calculate3DArea(polygonCoords);

    return { baseArea, terrainArea };
};

const calculate3DArea = (polygonCoords: [number, number, number][]) => {
    let terrainArea = 0;
    for (let i = 1; i < polygonCoords.length - 1; i++) {
        const p0 = polygonCoords[0];
        const p1 = polygonCoords[i];
        const p2 = polygonCoords[i + 1];

        const a = Cesium.Cartesian3.distance(
            Cesium.Cartesian3.fromDegrees(p0[0], p0[1], p0[2]),
            Cesium.Cartesian3.fromDegrees(p1[0], p1[1], p1[2])
        );
        const b = Cesium.Cartesian3.distance(
            Cesium.Cartesian3.fromDegrees(p1[0], p1[1], p1[2]),
            Cesium.Cartesian3.fromDegrees(p2[0], p2[1], p2[2])
        );
        const c = Cesium.Cartesian3.distance(
            Cesium.Cartesian3.fromDegrees(p2[0], p2[1], p2[2]),
            Cesium.Cartesian3.fromDegrees(p0[0], p0[1], p0[2])
        );

        const s = (a + b + c) / 2; // 반둘레
        terrainArea += Math.sqrt(s * (s - a) * (s - b) * (s - c)); // 헤론의 공식
    }
    return terrainArea;
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

export const MeasureArea = ({ globeController, unit }: MeasureAreaProps) => {
    const initResult = { baseArea: 0, terrainArea: 0 };
    const [result, setResult] = useState(initResult);

    useEffect(() => {
        const { viewer, toolDataSource } = globeController;
        if (!viewer) return;

        const cartesians: Cesium.Cartesian3[] = [];

        createPolygonEntity(toolDataSource, cartesians);
        createLabelEntity(toolDataSource);

        const leftClickHandler = async (event: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
            const scene = viewer.scene;
            const ray = scene.camera.getPickRay(event.position);
            if (!ray) return;

            const cartesian = scene.globe.pick(ray, scene);
            if (!cartesian) return;

            cartesians.push(cartesian);
            createPointEntity(toolDataSource, cartesian);

            if (cartesians.length >= 3) {
                const { baseArea, terrainArea } = await calculateTerrainArea(cartesians, viewer.scene.globe);
                const baseAreaUnitValue = Math.round((baseArea / getAreaUnitFactor(unit)) * 100) / 100;
                const terrainAreaUnitValue = Math.round((terrainArea / getAreaUnitFactor(unit)) * 100) / 100;
                setResult({
                    baseArea: baseAreaUnitValue,
                    terrainArea: terrainAreaUnitValue,
                });

                const center = Cesium.BoundingSphere.fromPoints(cartesians).center;
                const labelEntity = toolDataSource.entities.getById("areaLabel");
                if (labelEntity?.label) {
                    labelEntity.position = new Cesium.ConstantPositionProperty(center);
                    labelEntity.label.text = new Cesium.ConstantProperty(
                        `Base: ${baseAreaUnitValue.toFixed(2)} ${unit}\nTerrain: ${terrainAreaUnitValue.toFixed(2)} ${unit}`
                    );
                }
            }
        };

        const escKeyHandler = (keyboardEvent: KeyboardEvent) => {
            if (keyboardEvent.key === "Escape") {
                cartesians.length = 0;
                toolDataSource.entities.removeAll();
                setResult(initResult);
                createPolygonEntity(toolDataSource, cartesians);
                createLabelEntity(toolDataSource);
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
        <div>
            <h3>Measure Terrain Area</h3>
            <div>Base Area: {result.baseArea.toFixed(2)} {unit}</div>
            <div>Terrain Area: {result.terrainArea.toFixed(2)} {unit}</div>
        </div>
    );
};

