import React, { useEffect, useState } from "react";
import * as Cesium from "cesium";
import { polygon as turfPolygon, area as turfArea, tesselate as turfTesselate } from "@turf/turf";
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

const MAX_EDGE_LENGTH = 100; // 최대 한 변의 길이 (단위: m)

// 삼각형을 분할하는 함수
const subdivideTriangle = (
    triangle: GeoJSON.Feature<GeoJSON.Polygon>,
    maxLength: number
): GeoJSON.Feature<GeoJSON.Polygon>[] => {
    const [p0, p1, p2] = triangle.geometry.coordinates[0];

    const cartesianP0 = Cesium.Cartesian3.fromDegrees(p0[0], p0[1], 0);
    const cartesianP1 = Cesium.Cartesian3.fromDegrees(p1[0], p1[1], 0);
    const cartesianP2 = Cesium.Cartesian3.fromDegrees(p2[0], p2[1], 0);

    const d01 = Cesium.Cartesian3.distance(cartesianP0, cartesianP1);
    const d12 = Cesium.Cartesian3.distance(cartesianP1, cartesianP2);
    const d20 = Cesium.Cartesian3.distance(cartesianP2, cartesianP0);

    if (d01 <= maxLength && d12 <= maxLength && d20 <= maxLength) {
        return [triangle]; // 모든 변의 길이가 기준 이하일 경우 현재 삼각형 반환
    }

    // 중간점을 계산
    const midP01 = [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2];
    const midP12 = [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2];
    const midP20 = [(p2[0] + p0[0]) / 2, (p2[1] + p0[1]) / 2];

    // 새로운 삼각형 생성
    const triangles = [
        turfPolygon([[p0, midP01, midP20, p0]]),
        turfPolygon([[midP01, p1, midP12, midP01]]),
        turfPolygon([[midP12, p2, midP20, midP12]]),
        turfPolygon([[midP01, midP12, midP20, midP01]]),
    ];
    // 재귀적으로 분할
    return triangles.flatMap((subTriangle) => subdivideTriangle(subTriangle, maxLength));
};

const createTessellatedPolygonsWithHeights = async (
    tessellated: GeoJSON.FeatureCollection<GeoJSON.Polygon>,
    toolDataSource: Cesium.CustomDataSource,
    globe: Cesium.Globe
) => {
    const uniqueTriangles: { positions: Cesium.Cartesian3[] }[] = [];

    for (const triangle of tessellated.features) {
        // 삼각형 분할
        const subdividedTriangles = subdivideTriangle(triangle, MAX_EDGE_LENGTH);

        for (const subTriangle of subdividedTriangles) {
            // 좌표를 가져오기
            const coordinates: [number, number][] = subTriangle.geometry.coordinates[0] as [number, number][];
            const cartographics = coordinates.map(([lon, lat]) =>
                Cesium.Cartographic.fromDegrees(lon, lat)
            );

            // 지형 높이 샘플링
            const sampledCartographics = await Cesium.sampleTerrainMostDetailed(
                globe.terrainProvider,
                cartographics
            );

            // 샘플링된 높이를 사용해 Cartesian3 리스트 생성
            const positions = sampledCartographics.map((cartographic) =>
                Cesium.Cartesian3.fromRadians(
                    cartographic.longitude,
                    cartographic.latitude,
                    cartographic.height || 0
                )
            );

            // 중복 확인
            const triangleExists = uniqueTriangles.some((t) =>
                t.positions.every((pos, index) =>
                    Cesium.Cartesian3.equals(pos, positions[index])
                )
            );
            if (!triangleExists) {
                uniqueTriangles.push({ positions });

                // 각 삼각형의 높이를 사용해 3D Polygon 생성
                toolDataSource.entities.add({
                    polygon: {
                        hierarchy: new Cesium.PolygonHierarchy(positions),
                        material: Cesium.Color.BLUE.withAlpha(0.5), // 반투명한 파란색
                        perPositionHeight: true, // 각 좌표에 따라 높이 반영
                        outline: true,
                        outlineColor: Cesium.Color.BLACK,
                    },
                });
            }
        }
    }

    return uniqueTriangles;
};

// 수정된 calculateTerrainArea
const calculateTerrainArea = async (
    cartesians: Cesium.Cartesian3[],
    globe: Cesium.Globe,
    toolDataSource: Cesium.CustomDataSource
) => {
    toolDataSource.entities.removeAll();

    const ellipsoid = Cesium.Ellipsoid.WGS84;
    const cartographics = cartesians.map((cartesian) => Cesium.Cartographic.fromCartesian(cartesian));
    const polygonCoords: number[][] = [];

    // 지형 높이 샘플링
    let sampledCartographics = [];
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

    // 2D 다각형 생성 및 tessellation
    const polygon2D = turfPolygon([polygonCoords.map(([lon, lat]) => [lon, lat])]);
    const tessellated = turfTesselate(polygon2D);
    const baseArea = turfArea(polygon2D);

    // 3D tessellated 삼각형 생성
    const uniqueTriangles = await createTessellatedPolygonsWithHeights(
        tessellated,
        toolDataSource,
        globe
    );

    // 3D 면적 계산
    let terrainArea = 0;
    uniqueTriangles.forEach(({ positions }) => {
        const [p0, p1, p2] = positions;

        const a = Cesium.Cartesian3.distance(p0, p1);
        const b = Cesium.Cartesian3.distance(p1, p2);
        const c = Cesium.Cartesian3.distance(p2, p0);

        const s = (a + b + c) / 2; // 반둘레
        terrainArea += Math.sqrt(s * (s - a) * (s - b) * (s - c)); // 헤론의 공식
    });

    return { baseArea, terrainArea };
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
                const { baseArea, terrainArea } = await calculateTerrainArea(cartesians, viewer.scene.globe, toolDataSource);
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

