import React, { useEffect, useState } from "react";
import * as Cesium from "cesium";
import { GlobeController } from "@/api/GlobeController.ts";
import { eventManager } from "@/components/tool/actions/eventManager.ts";
import { getLengthUnitFactor } from "@/components/utils/unit.ts";

interface MeasureRadiusProps {
    globeController: GlobeController;
    unit: string;
}

const eventGroupId = "MeasureRadius";

const createPointEntity = (toolDataSource: Cesium.CustomDataSource, cartesian: Cesium.Cartesian3) => {
    toolDataSource.entities.add({
        position: cartesian,
        point: {
            pixelSize: 10,
            color: Cesium.Color.RED,
            outlineColor: Cesium.Color.WHITE,
            outlineWidth: 2,
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
        },
    });
};

const createDashLineEntity = (toolDataSource: Cesium.CustomDataSource, start: Cesium.Cartesian3, end: Cesium.Cartesian3) => {
    toolDataSource.entities.add({
        polyline: {
            positions: new Cesium.CallbackProperty(() => [start, end], false),
            width: 4,
            material: new Cesium.PolylineDashMaterialProperty({
                color: Cesium.Color.RED,
                dashLength: 10.0,
                dashPattern: 255,
            }),
        },
    });
};

const createEllipsoidEntity = async (
    toolDataSource: Cesium.CustomDataSource,
    start: Cesium.Cartesian3,
    end: Cesium.Cartesian3,
    globe: Cesium.Globe
) => {
    // 지표면 높이를 계산
    const cartographic = Cesium.Cartographic.fromCartesian(start);
    const sampledPositions = await Cesium.sampleTerrainMostDetailed(globe.terrainProvider, [cartographic]);
    const heightAdjustedPosition = Cesium.Cartesian3.fromRadians(
        sampledPositions[0].longitude,
        sampledPositions[0].latitude,
        sampledPositions[0].height || 0
    );

    // Ellipsoid 엔티티 생성
    const ellipsoid = toolDataSource.entities.add({
        position: heightAdjustedPosition,
        ellipsoid: {
            radii: new Cesium.CallbackProperty(() => {
                const distance = Cesium.Cartesian3.distance(heightAdjustedPosition, end);
                return new Cesium.Cartesian3(distance, distance, distance);
            }, false),
            material: Cesium.Color.RED.withAlpha(0.3),
            outline: true,
            outlineColor: Cesium.Color.RED,
            outlineWidth: 2,
        },
    });

    return ellipsoid;
};

export const MeasureRadius = ({ globeController, unit }: MeasureRadiusProps) => {
    const [result, setResult] = useState("0 m");
    let ellipsoidEntity: Cesium.Entity | undefined;
    let clickCount = 0;

    useEffect(() => {
        const { viewer, toolDataSource } = globeController;
        if (!viewer) return;

        const cartesians: { start?: Cesium.Cartesian3; end?: Cesium.Cartesian3 } = {};

        const leftClickHandler = async (event: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
            clickCount++;
            const scene = viewer.scene;
            const ray = scene.camera.getPickRay(event.position);
            if (!ray) return;

            const cartesian = scene.globe.pick(ray, scene);
            if (!cartesian) return;

            if (clickCount % 2 === 1) {
                // 홀수 클릭
                if (!eventManager.eventGroups.get(eventGroupId)?.some((e) => e.type === Cesium.ScreenSpaceEventType.MOUSE_MOVE)) {
                    eventManager.addHandler(eventGroupId, Cesium.ScreenSpaceEventType.MOUSE_MOVE, moveHandler);
                }

                if (ellipsoidEntity) {
                    toolDataSource.entities.removeAll();
                    ellipsoidEntity = undefined;
                }

                cartesians.start = cartesian;
                cartesians.end = cartesian;
                createPointEntity(toolDataSource, cartesian);
            } else {
                // 짝수 클릭
                if (ellipsoidEntity) {
                    toolDataSource.entities.removeAll();
                    ellipsoidEntity = undefined;
                }

                cartesians.end = cartesian;
                createPointEntity(toolDataSource, cartesian);
                createDashLineEntity(toolDataSource, cartesians.start!, cartesians.end!);

                // 비동기 로직으로 Ellipsoid 생성
                ellipsoidEntity = await createEllipsoidEntity(toolDataSource, cartesians.start!, cartesians.end!, viewer.scene.globe);

                const distance = Cesium.Cartesian3.distance(cartesians.start!, cartesians.end!);
                const convertedDistance = (distance / getLengthUnitFactor(unit)).toFixed(2);
                setResult(`${convertedDistance} ${unit}`);
                eventManager.removeSpecificHandler(eventGroupId, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
            }
        };

        const moveHandler = async (event: Cesium.ScreenSpaceEventHandler.MotionEvent) => {
            if (!cartesians.start) return;
            const scene = viewer.scene;
            const ray = scene.camera.getPickRay(event.endPosition);
            if (!ray) return;

            const cartesian = scene.globe.pick(ray, scene);
            if (!cartesian) return;

            cartesians.end = cartesian;

            if (!ellipsoidEntity) {
                ellipsoidEntity = await createEllipsoidEntity(toolDataSource, cartesians.start, cartesians.end, viewer.scene.globe);
            } else {
                ellipsoidEntity.ellipsoid!.radii = new Cesium.CallbackProperty(() => {
                    const distance = Cesium.Cartesian3.distance(cartesians.start!, cartesians.end!);
                    return new Cesium.Cartesian3(distance, distance, distance);
                }, false);
            }

            const distance = Cesium.Cartesian3.distance(cartesians.start!, cartesians.end!);
            const convertedDistance = (distance / getLengthUnitFactor(unit)).toFixed(2);
            setResult(`${convertedDistance} ${unit}`);
        };

        const escKeyHandler = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                cartesians.start = undefined;
                cartesians.end = undefined;
                toolDataSource.entities.removeAll();
                eventManager.removeSpecificHandler(eventGroupId, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
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
            <h3>Measure Radius</h3>
            <div>Distance: {result}</div>
        </div>
    );
};
