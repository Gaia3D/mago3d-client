import * as Cesium from "cesium";

export const loadGeojson = async (viewer: any, url: string) => {
    if (!viewer) return;

    try {
        const dataSource = await Cesium.GeoJsonDataSource.load(url);
        const entities = dataSource.entities.values;
        const heightOffset = 0.0;
        const fixedFloorHeight = 2.5; // apartment floor height 2.4 ~ 2.6m

        for (const entity of entities) {
            const height = entity.properties?.height || 10;
            const floorSize = Math.floor(height / fixedFloorHeight);
            const layerName = entity.properties?.layer.getValue();
            const customDataSource = new Cesium.CustomDataSource(layerName);
            const color = Cesium.Color.STEELBLUE;

            for (let index = 0; index < floorSize; index++) {
                const floorHeight = fixedFloorHeight * index;
                const value = index / floorSize;

                const floorColor = color.clone();
                floorColor.red = Math.min(color.red + value, 1.0);
                floorColor.green = Math.min(color.green + value, 1.0);
                floorColor.blue = Math.min(color.blue + value, 1.0);

                const polygonFloorEntity = new Cesium.Entity({
                    name: `apartments ${index}`,
                    polygon: {
                        hierarchy: entity.polygon?.hierarchy,
                        material: floorColor,
                        height: heightOffset + floorHeight,
                        extrudedHeight: heightOffset + floorHeight + fixedFloorHeight,
                        shadows: Cesium.ShadowMode.ENABLED,
                        outline: false,
                        outlineColor: floorColor.withAlpha(0.5),
                    },
                    properties: {
                        floor: index,
                        height: fixedFloorHeight,
                    },
                });
                customDataSource.entities.add(polygonFloorEntity);
            }
            viewer?.dataSources.add(customDataSource);
        }
    } catch (error) {
        console.error("Error loading GeoJSON:", error);
    }
};
