import React, { useEffect, useState } from "react";
import * as Cesium from "cesium";
import { polygon as turfPolygon, area as turfArea, tesselate as turfTesselate } from "@turf/turf";
import { GlobeController } from "@/api/GlobeController.ts";
import { eventManager } from "@/components/tool/eventManager.ts";
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
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        },
        id: "areaLabel",
    });
};

// 삼각형을 분할하는 함수
const subdivideTriangle = (
    triangle: GeoJSON.Feature<GeoJSON.Polygon>,
    maxLength: number
): GeoJSON.Feature<GeoJSON.Polygon>[] => {
    const [p0, p1, p2] = triangle.geometry.coordinates[0];
    const cartesianCoords = [p0, p1, p2].map(([lon, lat]) =>
        Cesium.Cartesian3.fromDegrees(lon, lat, 0)
    );

    const distances = [
        Cesium.Cartesian3.distance(cartesianCoords[0], cartesianCoords[1]),
        Cesium.Cartesian3.distance(cartesianCoords[1], cartesianCoords[2]),
        Cesium.Cartesian3.distance(cartesianCoords[2], cartesianCoords[0]),
    ];

    if (distances.every((d) => d <= maxLength)) {
        return [triangle];
    }

    const midpoints = [
        [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2],
        [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2],
        [(p2[0] + p0[0]) / 2, (p2[1] + p0[1]) / 2],
    ];

    const triangles = [
        turfPolygon([[p0, midpoints[0], midpoints[2], p0]]),
        turfPolygon([[midpoints[0], p1, midpoints[1], midpoints[0]]]),
        turfPolygon([[midpoints[1], p2, midpoints[2], midpoints[1]]]),
        turfPolygon([[midpoints[0], midpoints[1], midpoints[2], midpoints[0]]]),
    ];

    return triangles.flatMap((t) => subdivideTriangle(t, maxLength));
};

// MAX_EDGE_LENGTH를 동적으로 계산하는 함수
const calculateMaxEdgeLength = (baseArea: number) => {
    // baseArea가 클수록 MAX_EDGE_LENGTH를 증가시킴
    return Math.sqrt(baseArea) / 5; // baseArea의 제곱근을 사용하여 동적으로 조절
};

// 3D Tessellated Polygon 생성 및 면적 계산
const calculateTessellatedArea = async (
    tessellated: GeoJSON.FeatureCollection<GeoJSON.Polygon>,
    globe: Cesium.Globe,
    baseArea: number
): Promise<number> => {
    const maxEdgeLength = calculateMaxEdgeLength(baseArea); // baseArea에 따른 MAX_EDGE_LENGTH 설정
    let totalArea = 0;

    for (const triangle of tessellated.features) {
        const subdivided = subdivideTriangle(triangle, maxEdgeLength);

        for (const subTriangle of subdivided) {
            const coords = subTriangle.geometry.coordinates[0] as [number, number][];
            const cartographics = coords.map(([lon, lat]) => Cesium.Cartographic.fromDegrees(lon, lat));

            const sampledCartographics = await Cesium.sampleTerrainMostDetailed(
                globe.terrainProvider,
                cartographics
            );

            const positions = sampledCartographics.map((cartographic) =>
                Cesium.Cartesian3.fromRadians(
                    cartographic.longitude,
                    cartographic.latitude,
                    cartographic.height || 0
                )
            );

            const [p0, p1, p2] = positions;
            const a = Cesium.Cartesian3.distance(p0, p1);
            const b = Cesium.Cartesian3.distance(p1, p2);
            const c = Cesium.Cartesian3.distance(p2, p0);
            const s = (a + b + c) / 2;

            totalArea += Math.sqrt(s * (s - a) * (s - b) * (s - c)); // 헤론의 공식으로 면적 계산
        }
    }

    return totalArea;
};

// 최적화된 calculateTerrainArea 함수
const calculateTerrainArea = async (
    cartesians: Cesium.Cartesian3[],
    globe: Cesium.Globe
) => {
    const ellipsoid = Cesium.Ellipsoid.WGS84;
    const cartographics = cartesians.map((cartesian) => Cesium.Cartographic.fromCartesian(cartesian));

    const sampledCartographics = globe.terrainProvider instanceof Cesium.EllipsoidTerrainProvider
        ? cartographics.map((cartographic) => ({
            ...cartographic,
            height: ellipsoid.cartesianToCartographic(
                Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 0)
            ).height,
        }))
        : await Cesium.sampleTerrainMostDetailed(globe.terrainProvider, cartographics);

    const polygonCoords = sampledCartographics.map(({ longitude, latitude, height }) => [
        Cesium.Math.toDegrees(longitude),
        Cesium.Math.toDegrees(latitude),
        height || 0,
    ]);

    if (polygonCoords.length > 0) polygonCoords.push([...polygonCoords[0]]);

    const polygon2D = turfPolygon([polygonCoords.map(([lon, lat]) => [lon, lat])]);
    const tessellated = turfTesselate(polygon2D);
    const baseArea = turfArea(polygon2D); // baseArea 계산

    const terrainArea = await calculateTessellatedArea(tessellated, globe, baseArea); // baseArea를 전달

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

