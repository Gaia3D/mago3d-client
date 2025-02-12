import React, {useEffect, useState} from 'react';
import * as Cesium from "cesium";
import { eventManager } from "@/components/tool/actions/eventManager.ts";
import {GlobeController} from "@/api/GlobeController.ts";

interface LayerInfoProps {
    globeController: GlobeController;
}

const eventGroupId = "LayerInfo";

const createPointEntity = (toolDataSource: Cesium.CustomDataSource, cartesian: Cesium.Cartesian3) => {
    toolDataSource.entities.add({
        id: "layerInfoPoint",
        position: cartesian,
        point: {
            show: true,
            pixelSize: 10,
            color: Cesium.Color.RED,
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
        }
    });
};

const LayerInfo = ({globeController}: LayerInfoProps) => {
    const { viewer, toolDataSource } = globeController;
    const [selectedFeatures, setSelectedFeatures] = useState<Cesium.ImageryLayerFeatureInfo[]>([]);

    useEffect(() => {
        if (!viewer) return;

        const leftClickHandler = async (event: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
            if (!event.position) {
                console.error("event.position is undefined.");
                return;
            }

            const scene = viewer.scene;
            const cartesian = globeController.pickPosition(event.position);
            const ray = scene.camera.getPickRay(event.position);

            if (!cartesian) {
                console.error("Cartesian position could not be determined.");
                return;
            }
            if (!ray) {
                console.error("Ray could not be determined.");
                return;
            }

            try {
                const pickedFeatures = await viewer.imageryLayers.pickImageryLayerFeatures(ray, scene);

                if (pickedFeatures && pickedFeatures.length > 0) {
                    console.log("Picked features:", pickedFeatures);
                    setSelectedFeatures(pickedFeatures);
                } else {
                    setSelectedFeatures([]);
                    console.log("No layer features found at this position.");
                }

                toolDataSource.entities.removeById("layerInfoPoint");
                createPointEntity(toolDataSource, cartesian);
            } catch (error) {
                console.error("Error fetching layer features:", error);
            }
        };

        eventManager.init(viewer);
        eventManager.addHandler(eventGroupId, Cesium.ScreenSpaceEventType.LEFT_CLICK, leftClickHandler);

        return () => {
            toolDataSource.entities.removeById("layerInfoPoint");
            eventManager.destroyGroup(eventGroupId);
        };
    }, [viewer, toolDataSource, globeController]);

    return (
        <div style={{position: "fixed", top: "100px", right: "100px", color: "black", backgroundColor: "white", padding: "10px"}}>
            {selectedFeatures.map((feature, index) => (
                <div key={index} dangerouslySetInnerHTML={{__html: feature?.description ?? ""}}/>
            ))}
        </div>

    );
};

export default LayerInfo;
