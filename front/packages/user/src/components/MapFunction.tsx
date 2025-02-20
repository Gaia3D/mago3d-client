import { useEffect } from "react";
import { useLayerManagement } from "../hooks/useLayerManagement";
import * as Cesium from "cesium";
import {useGlobeController} from "@/components/providers/GlobeControllerProvider.tsx";

const MapFunction = () => {
    const { initialized, globeController } = useGlobeController();
    const { iconLayer } = useLayerManagement();

    useEffect(() => {
        if (!initialized || !globeController?.viewer || !iconLayer) return;

        const viewer = globeController.viewer;
        const layer = iconLayer.properties?.layer;
        if (!layer || !layer.resource) {
            console.error("Error: layer or layer.resource is undefined", layer);
            return;
        }

        const { resource } = layer;
        const dataSourceId = iconLayer.assetId;

        if (viewer.dataSources.getByName(dataSourceId).length > 0) return;

        Cesium.GeoJsonDataSource.load(
            `${import.meta.env.VITE_GEOSERVER_WFS_SERVICE_URL}?service=WFS&version=1.1.1&request=GetFeature&typeName=${resource.name}&outputFormat=application/json`
        ).then((dataSource) => {
            const falseProperty = new Cesium.ConstantProperty(false);
            dataSource.entities.values.forEach(entity => {
                if (entity.billboard) {
                    entity.billboard.show = falseProperty;
                }
                if (!entity.point) {
                    entity.point = new Cesium.PointGraphics({
                        pixelSize: 10,
                        color: Cesium.Color.WHITE,
                        outlineColor: Cesium.Color.RED,
                        outlineWidth: 2,
                        disableDepthTestDistance: Number.POSITIVE_INFINITY
                    });
                }
            });

            dataSource.name = dataSourceId;
            dataSource.show = false;
            viewer.dataSources.add(dataSource);
        }).catch(error => console.error("Failed to load WFS data", error));
    }, [initialized, iconLayer]);

    return null;
};

export default MapFunction;
