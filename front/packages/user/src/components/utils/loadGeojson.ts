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
        const steelBlue = Cesium.Color.STEELBLUE;
        const value = Math.max(0, Math.min((height - 1) / 49, 1));
        const red = (1 - value) + steelBlue.red * value;
        const green = (1 - value) + steelBlue.green * value;
        const blue = (1 - value) + steelBlue.blue * value;
        return new Cesium.Color(red, green, blue, 1.0);
    }

    try {
        const dataSource = await Cesium.GeoJsonDataSource.load(url);
        const entities = dataSource.entities.values as EntityWithHeight[];
        const customDataSource = new Cesium.CustomDataSource("buildings");

        // 현재 시간과 애니메이션 종료 시간 계산
        // const startTime = Cesium.JulianDate.now();
        // const animationDuration = 1; // 애니메이션 지속 시간 (초)
        // const stopTime = Cesium.JulianDate.addSeconds(startTime, animationDuration, new Cesium.JulianDate());


        entities.forEach((entity) => {
            const targetHeight = entity.properties?.height ? entity.properties.height.getValue(Cesium.JulianDate.now()) : 10;
            const color = getHeightColor(targetHeight);

            // SampledProperty를 사용하여 시간에 따른 높이 변화 정의
            // const heightProperty = new Cesium.SampledProperty(Number);
            // heightProperty.addSample(startTime, 0); // 초기 높이 0
            // heightProperty.addSample(stopTime, targetHeight * 10); // 목표 높이

            // 중심 좌표 구하기 (이전 폴리곤의 중심을 박스의 위치로 설정)
            const positions = entity.polygon?.hierarchy?.getValue(Cesium.JulianDate.now()).positions;
            if (!positions) return;
            const center = Cesium.BoundingSphere.fromPoints(positions).center;
            const cartographicCenter = Cesium.Cartographic.fromCartesian(center);
            const longitude = Cesium.Math.toDegrees(cartographicCenter.longitude);
            const latitude = Cesium.Math.toDegrees(cartographicCenter.latitude);

            // 박스 엔티티 생성, X, Y는 고정, Z는 0으로 시작
            const gridEntity = new Cesium.Entity({
                name: `Building with height ${targetHeight}`,
                position: Cesium.Cartesian3.fromDegrees(longitude, latitude, 0),
                box: {
                    // dimensions: new Cesium.Cartesian3(90, 90, 0), // 초기 박스 높이는 0
                    dimensions: new Cesium.Cartesian3(90, 90, targetHeight * 10),
                    material: color,
                    shadows: Cesium.ShadowMode.ENABLED,
                },
                properties: {
                    // targetHeight: targetHeight * 10,
                    // currentHeight: heightProperty, // SampledProperty로 현재 높이 추적
                },
            });

            customDataSource.entities.add(gridEntity);
        });

        viewer.dataSources.add(customDataSource);

        // 타이머 및 애니메이션을 위한 Clock 설정
        // viewer.clock.startTime = startTime.clone();
        // viewer.clock.stopTime = stopTime.clone();
        // viewer.clock.currentTime = startTime.clone();
        // viewer.clock.clockRange = Cesium.ClockRange.CLAMPED; // 애니메이션이 종료되면 정지
        // viewer.clock.clockStep = Cesium.ClockStep.SYSTEM_CLOCK_MULTIPLIER; // 실제 시간에 따라 이동
        // viewer.clock.multiplier = 0.05; // 시간 속도 조절 (1초에 1초 진행)
        //
        // viewer.timeline?.zoomTo(startTime, stopTime); // 타임라인 줌 조절

        // let previousTime = Cesium.JulianDate.clone(startTime);
        //
        // // onTick 이벤트 핸들러 함수 정의
        // function onTickHandler() {
        //     const currentTime = viewer.clock.currentTime;
        //
        //     // 애니메이션이 종료되었는지 확인
        //     if (Cesium.JulianDate.compare(currentTime, stopTime) >= 0) {
        //         // 애니메이션이 종료되었으면 onTick 이벤트 제거
        //         viewer.clock.onTick.removeEventListener(onTickHandler);
        //         return;
        //     }
        //
        //     if (Cesium.JulianDate.compare(currentTime, previousTime) !== 0) {
        //         customDataSource.entities.values.forEach((entity: any) => {
        //             const totalDuration = Cesium.JulianDate.secondsDifference(stopTime, startTime);
        //             const elapsed = Cesium.JulianDate.secondsDifference(currentTime, startTime);
        //             const heightFactor = Math.min(elapsed / totalDuration, 1); // 0 ~ 1 사이의 값
        //
        //             const currentHeight = entity.properties?.targetHeight * heightFactor;
        //             entity.box.dimensions = new Cesium.Cartesian3(90, 90, currentHeight);
        //         });
        //
        //         Cesium.JulianDate.clone(currentTime, previousTime);
        //     }
        // }
        //
        // // onTick 이벤트 리스너 추가
        // viewer.clock.onTick.addEventListener(onTickHandler);

    } catch (error) {
        console.error("Error loading GeoJSON:", error);
    }
};

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
