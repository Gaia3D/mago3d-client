import React, { useEffect, useState, useCallback } from "react";
import * as Cesium from "cesium";
import { eventManager } from "@/components/tool/eventManager.ts";
import { GlobeController } from "@/api/GlobeController.ts";
import { useRecoilValue } from "recoil";
import { UserLayerAsset } from "@mnd/shared/src/types/layerset/gql/graphql.ts";
import { layersState } from "@/recoils/Layer.ts";
import LayerInfoTemplate from "@/components/tool/actions/layer-info/LayerInfoTemplate.tsx";
import {createPointEntity} from "@/components/utils/measureEntities.ts";

interface LayerInfoProps {
    globeController: GlobeController;
}

const eventGroupId = "LayerInfo";

const processPickedFeatures = (
    pickedFeatures: Cesium.ImageryLayerFeatureInfo[],
    layers: UserLayerAsset[]
): Cesium.ImageryLayerFeatureInfo[] => {
    return pickedFeatures.map((feature) => {

        if (!feature?.imageryLayer?.imageryProvider?._layers || typeof feature.imageryLayer.imageryProvider._layers !== "string") {
            console.warn("Feature ID가 없거나 잘못된 형식입니다.", feature);
            return feature;
        }

        const featureId = feature.imageryLayer.imageryProvider._layers.split(":")[1];
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
    const handleClickEvent = useCallback(
        async (event: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
            if (!event.position || !viewer) {
                console.error("event.position 또는 viewer가 정의되지 않았습니다.");
                return;
            }

            const scene = viewer.scene;
            const ray = scene.camera.getPickRay(event.position);
            if (!ray) {
                console.error("Ray를 찾을 수 없습니다.");
                return;
            }

            const intersection = scene.globe.pick(ray, scene);
            if (!intersection) {
                console.error("지형과 교차점을 찾을 수 없습니다.");
                return;
            }

            toolDataSource.entities.removeById("layer-info-point");
            createPointEntity(toolDataSource, intersection, "", "layer-info-point");

            try {
                const pickedFeatures = await viewer.imageryLayers.pickImageryLayerFeatures(ray, scene);
                const processedFeatures = Array.isArray(pickedFeatures)
                    ? processPickedFeatures(pickedFeatures, layers)
                    : [];

                const pickedObjects = scene.drillPick(event.position);

                const billboardPick = pickedObjects.find(obj => obj?.id?.properties);

                if (billboardPick?.id?.properties) {
                    const billboardToFeature = new Cesium.ImageryLayerFeatureInfo();
                    billboardToFeature.name = billboardPick.id.properties.layerName ?? "";
                    billboardToFeature.data = {
                        id: billboardPick.id.properties.layerName ?? "",
                        properties: billboardPick.id.properties};
                    processedFeatures.push(billboardToFeature);
                }

                setSelectedFeatures(processedFeatures);
            } catch (error) {
                console.error("피처 정보를 가져오는 중 문제가 발생했습니다.", error);
            }
        },
        [viewer, toolDataSource, layers]
    );

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
