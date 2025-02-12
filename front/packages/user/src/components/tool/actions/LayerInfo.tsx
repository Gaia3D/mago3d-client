import React, { useEffect, useState, useCallback } from "react";
import * as Cesium from "cesium";
import { eventManager } from "@/components/tool/actions/eventManager.ts";
import { GlobeController } from "@/api/GlobeController.ts";
import { useRecoilValue } from "recoil";
import { UserLayerAsset } from "@mnd/shared/src/types/layerset/gql/graphql.ts";
import { layersState } from "@/recoils/Layer.ts";
import LayerInfoTemplate from "@/components/tool/actions/layer-info/LayerInfoTemplate.tsx";

interface LayerInfoProps {
    globeController: GlobeController;
}

const eventGroupId = "LayerInfo";

const createPointEntity = (toolDataSource: Cesium.CustomDataSource, cartesian: Cesium.Cartesian3) => {
    toolDataSource.entities.add({
        id: "layer-info-point",
        position: cartesian,
        point: {
            show: true,
            pixelSize: 10,
            color: Cesium.Color.RED,
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
        }
    });
};

const processPickedFeatures = (
    pickedFeatures: Cesium.ImageryLayerFeatureInfo[],
    layers: UserLayerAsset[]
): Cesium.ImageryLayerFeatureInfo[] => {
    return pickedFeatures.map((feature) => {
        if (!feature.data?.id || typeof feature.data.id !== "string") {
            console.warn("Feature ID가 없거나 잘못된 형식입니다.", feature);
            return feature;
        }

        const featureId = feature.data.id.split(".")[0];
        const tempLayer = layers.find(layer => layer.properties?.layer?.name === featureId);

        return {
            ...Object.create(Object.getPrototypeOf(feature), Object.getOwnPropertyDescriptors(feature)),
            name: tempLayer?.name || "Unknown Layer"
        };
    });
};

const LayerInfo = ({ globeController }: LayerInfoProps) => {
    const { viewer, toolDataSource } = globeController;
    const [selectedFeatures, setSelectedFeatures] = useState<Cesium.ImageryLayerFeatureInfo[]>([]);
    const layers = useRecoilValue<UserLayerAsset[]>(layersState);

    const handleClickEvent = useCallback(async (event: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
        if (!event.position) {
            console.error("event.position이 정의되지 않았습니다.");
            return;
        }

        const scene = viewer?.scene;
        if (!scene) return;

        const cartesian = globeController.pickPosition(event.position);
        const ray = scene.camera.getPickRay(event.position);

        if (!cartesian || !ray) {
            console.error("Cartesian 좌표 또는 Ray를 찾을 수 없습니다.");
            return;
        }

        toolDataSource.entities.removeById("layer-info-point");
        createPointEntity(toolDataSource, cartesian);

        try {
            const pickedFeatures = await viewer.imageryLayers.pickImageryLayerFeatures(ray, scene);

            if (!Array.isArray(pickedFeatures) || pickedFeatures.length === 0) {
                console.warn("선택된 피처가 없습니다.");
                setSelectedFeatures([]);
                return;
            }

            setSelectedFeatures(processPickedFeatures(pickedFeatures, layers));
        } catch (error) {
            console.error("레이어 정보를 가져오는 중 문제가 발생했습니다.", error);
        }
    }, [viewer, globeController, toolDataSource, layers]);

    useEffect(() => {
        if (!viewer) return;

        eventManager.init(viewer);
        eventManager.addHandler(eventGroupId, Cesium.ScreenSpaceEventType.LEFT_CLICK, handleClickEvent);

        return () => {
            toolDataSource.entities.removeById("layer-info-point");
            eventManager.destroyGroup(eventGroupId);
        };
    }, [viewer, toolDataSource, handleClickEvent]);

    return (
        <LayerInfoTemplate selectedFeatures={selectedFeatures} />
    );
};

export default LayerInfo;
