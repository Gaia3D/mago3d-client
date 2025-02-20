import React, {ChangeEvent, useEffect, useState} from "react";
import * as Cesium from "cesium";
import { polygon as turfPolygon, area as turfArea, tesselate as turfTesselate } from "@turf/turf";
import { GlobeController } from "@/api/GlobeController.ts";
import { eventManager } from "@/components/tool/eventManager.ts";
import { getAreaUnitFactor } from "@/components/utils/unit.ts";
import {useTranslation} from "react-i18next";
import {useRecoilState} from "recoil";
import {AreaUnitState, AreaUnitType} from "@/recoils/Unit.ts";
import {createLabelEntity, createPointEntity, createPolygonEntity} from "@/components/utils/measureEntities.ts";

interface MeasureAreaProps {
    globeController: GlobeController;
}

const eventGroupId = "MeasureArea";

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

    let sampledCartographics;

    if (globe.terrainProvider instanceof Cesium.EllipsoidTerrainProvider) {
        // Ellipsoid Terrain인 경우, 높이를 0으로 설정하여 처리
        sampledCartographics = cartographics.map((cartographic) => ({
            longitude: cartographic.longitude,
            latitude: cartographic.latitude,
            height: ellipsoid.cartesianToCartographic(
                Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 0)
            ).height || 0, // 기본적으로 0 높이 사용
        }));
    } else {
        try {
            sampledCartographics = await Cesium.sampleTerrainMostDetailed(globe.terrainProvider, cartographics);
        } catch (error) {
            console.error("Error in sampleTerrainMostDetailed:", error);
            sampledCartographics = cartographics.map((cartographic) => ({
                longitude: cartographic.longitude,
                latitude: cartographic.latitude,
                height: 0, // fallback height
            }));
        }
    }

    const polygonCoords = sampledCartographics.map(({ longitude, latitude, height }) => [
        Cesium.Math.toDegrees(longitude),
        Cesium.Math.toDegrees(latitude),
        height || 0,
    ]);

    if (polygonCoords.length > 0) polygonCoords.push([...polygonCoords[0]]);

    const polygon2D = turfPolygon([polygonCoords.map(([lon, lat]) => [lon, lat])]);
    const tessellated = turfTesselate(polygon2D);
    const baseArea = turfArea(polygon2D);

    const terrainArea = globe.terrainProvider instanceof Cesium.EllipsoidTerrainProvider
        ? baseArea  // 지형 데이터 없으면 baseArea 사용
        : await calculateTessellatedArea(tessellated, globe, baseArea);

    return { baseArea, terrainArea };
};


export const MeasureArea = ({ globeController }: MeasureAreaProps) => {
    const {t} = useTranslation();
    const [unit, setUnit] = useRecoilState<AreaUnitType>(AreaUnitState);
    const initResult = { baseArea: 0, terrainArea: 0 };
    const [result, setResult] = useState(initResult);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const { viewer, toolDataSource } = globeController;
        if (!viewer) return;

        const cartesians: Cesium.Cartesian3[] = [];

        createPolygonEntity(toolDataSource, cartesians);

        const leftClickHandler = async (event: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
            const scene = viewer.scene;
            const ray = scene.camera.getPickRay(event.position);
            if (!ray) return;

            const cartesian = scene.globe.pick(ray, scene);
            if (!cartesian) return;

            cartesians.push(cartesian);
            createPointEntity(toolDataSource, cartesian);

            if (cartesians.length >= 3) {
                setIsLoading(true);
                const { baseArea, terrainArea } = await calculateTerrainArea(cartesians, viewer.scene.globe);
                const baseAreaUnitValue = Math.round((baseArea / getAreaUnitFactor(unit)) * 100) / 100;
                const terrainAreaUnitValue = Math.round((terrainArea / getAreaUnitFactor(unit)) * 100) / 100;
                setResult({
                    baseArea: baseAreaUnitValue,
                    terrainArea: terrainAreaUnitValue,
                });

                const center = Cesium.BoundingSphere.fromPoints(cartesians).center;
                const labelEntity = toolDataSource.entities.getById("areaLabel");
                const labelText = `Base: ${baseAreaUnitValue.toFixed(2)} ${unit}\nTerrain: ${terrainAreaUnitValue.toFixed(2)} ${unit}`;
                if (labelEntity?.label) {
                    labelEntity.position = new Cesium.ConstantPositionProperty(center);
                    labelEntity.label.text = new Cesium.ConstantProperty(labelText);
                } else {
                    createLabelEntity(toolDataSource, center, labelText, "areaLabel");
                }
                setIsLoading(false);
            }
        };

        const escKeyHandler = (keyboardEvent: KeyboardEvent) => {
            if (keyboardEvent.key === "Escape") {
                cartesians.length = 0;
                toolDataSource.entities.removeAll();
                setResult(initResult);
                createPolygonEntity(toolDataSource, cartesians);
                setIsLoading(false);
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
        <div className="pop-layer-sub measure">
            <div className="pop-layer-header">
                <h3 className="title">{t("measure.area")}</h3>
            </div>
            <div className="pop-layer-content">
                <div className="value-container">
                    <label>{t("measure.area-unit")}</label>
                    <select value={unit} onChange={(e) => setUnit(e.target.value as AreaUnitType)}>
                        <option value="m²">{t("measure.m2")}</option>
                        <option value="km²">{t("measure.km2")}</option>
                        <option value="yd²">{t("measure.yd2")}</option>
                        <option value="mi²">{t("measure.mi2")}</option>
                        <option value="acre">{t("measure.acre")}</option>
                        <option value="ha">{t("measure.ha")}</option>
                    </select>
                </div>
                <div className="value-container">
                    <label>{t("measure.measure-area-base")}</label>
                    <input type="text" value={isLoading ? "loading..." : `${result.baseArea.toFixed(2)} ${unit}`} readOnly/>
                </div>
                <div className="value-container">
                    <label>{t("measure.measure-area-terrain")}</label>
                    <input type="text" value={isLoading ? "loading..." : `${result.terrainArea.toFixed(2)} ${unit}`} readOnly/>
                </div>
            </div>
        </div>
    );
};
