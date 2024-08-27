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

export const loadGridGeojson = async (viewer: any, url: string) => {
    if (!viewer) return;

    function getHeightColor(height: any) {
        // 스틸블루 색상 정의 (RGB 값)
        const steelBlue = Cesium.Color.STEELBLUE;

        // 흰색과 스틸블루 사이의 색상 보간
        const value = Math.max(0, Math.min((height - 1) / 49, 1)); // 높이 1일 때 0, 높이 50일 때 1로 변환

        // Red와 Green, Blue는 흰색에서 스틸블루로 갈수록 증가
        const red = (1 - value) + steelBlue.red * value; // 흰색에서 스틸블루로 전환
        const green = (1 - value) + steelBlue.green * value; // 흰색에서 스틸블루로 전환
        const blue = (1 - value) + steelBlue.blue * value; // 흰색에서 스틸블루로 전환

        return new Cesium.Color(red, green, blue, 1.0); // alpha는 1로 설정
    }

    try {
        const dataSource = await Cesium.GeoJsonDataSource.load(url);
        const entities = dataSource.entities.values as EntityWithHeight[];
        const heightOffset = 0.0;
        const fixedFloorHeight = 2.5; // apartment floor height 2.4 ~ 2.6m

        // Create a single custom data source for all entities
        const customDataSource = new Cesium.CustomDataSource("buildings");
        const currentTime = Cesium.JulianDate.now();

        // Iterate through entities and create building entities
        entities.forEach((entity) => {
            const height = entity.properties?.height ? entity.properties.height.getValue(currentTime) : 10;
            const color = getHeightColor(height);

            // Create a single entity with the total building height and color
            const buildingEntity = new Cesium.Entity({
                name: `Building with height ${height}`,
                polygon: {
                    hierarchy: entity.polygon?.hierarchy,
                    material: color,
                    height: heightOffset,
                    extrudedHeight: (heightOffset + height) * 10,
                    shadows: Cesium.ShadowMode.ENABLED,
                    outline: false,
                    outlineColor: color.withAlpha(0.5),
                },
                properties: {
                    totalHeight: height,
                },
            });

            customDataSource.entities.add(buildingEntity);
        });

        // Add the custom data source to the viewer once
        viewer.dataSources.add(customDataSource);

    } catch (error) {
        console.error("Error loading GeoJSON:", error);
    }
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
