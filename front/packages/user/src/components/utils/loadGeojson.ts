import * as Cesium from "cesium";

interface Viewer {
    dataSources: Cesium.DataSourceCollection;
}

interface CustomPropertyBag extends Cesium.PropertyBag {
    height?: Cesium.Property;
    layer?: Cesium.Property;
}

interface EntityWithHeight extends Cesium.Entity {
    properties: CustomPropertyBag;
    polygon: Cesium.PolygonGraphics;
}

export const loadGeojson = async (viewer: any, url: string) => {
    if (!viewer) return;

    try {
        const dataSource = await Cesium.GeoJsonDataSource.load(url);
        const entities = dataSource.entities.values as EntityWithHeight[];
        const heightOffset = 0.0;
        const fixedFloorHeight = 2.5; // apartment floor height 2.4 ~ 2.6m

        const getFloorColor = (baseColor: Cesium.Color, value: number): Cesium.Color => {
            const floorColor = baseColor.clone();
            floorColor.red = Math.min(baseColor.red + value, 1.0);
            floorColor.green = Math.min(baseColor.green + value, 1.0);
            floorColor.blue = Math.min(baseColor.blue + value, 1.0);
            return floorColor;
        };
        for (const entity of entities) {
            const currentTime = Cesium.JulianDate.now();
            const height = entity.properties?.height ? entity.properties.height.getValue(currentTime) : 10;
            const floorSize = Math.floor(height / fixedFloorHeight);
            const layerName = entity.properties?.layer ? entity.properties.layer.getValue(currentTime) : 'defaultLayer';
            const customDataSource = new Cesium.CustomDataSource(layerName);
            const color = Cesium.Color.STEELBLUE;

            for (let index = 0; index < floorSize; index++) {
                const floorHeight = fixedFloorHeight * index;
                const value = index / floorSize;

                const floorColor = getFloorColor(color, value);

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
            await viewer.dataSources.add(customDataSource);
        }
    } catch (error) {
        console.error("Error loading GeoJSON:", error);
    }
};
