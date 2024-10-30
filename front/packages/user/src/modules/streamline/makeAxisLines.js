import * as Cesium from 'cesium';

export const makeAxisLines = (st_lon, st_lat, st_elev, end_lon, end_lat, end_elev, count_axis_lon, count_axis_lat, count_axis_elev) => {
    const datasource = new Cesium.CustomDataSource();
    const rhumb = Cesium.ArcType.RHUMB;

    const longitudeCount = count_axis_lon;//Math.abs(end_lon - st_lon) / (count_axis_lon ?? 10)
    const longitudeStep = (end_lon - st_lon) / (count_axis_lon)
    const longitudeAxis = new Array(longitudeCount).fill().map((v, i) => st_lon + i * longitudeStep)
    longitudeAxis.push(end_lon)

    const latitudeCount = count_axis_lat;//Math.abs(end_lat - st_lat) / (count_axis_lat ?? 10)
    const latitudeStep = (end_lat - st_lat) / (count_axis_lat)
    const latitudeAxis = new Array(latitudeCount).fill().map((v, i) => st_lat + i * latitudeStep)
    latitudeAxis.push(end_lat)

    const elevationCount = count_axis_elev;//Math.abs(end_elev - st_elev) / (count_axis_elev ?? 10)
    const elevationStep = (end_elev - st_elev) / (elevationCount)
    const elevationAxis = new Array(elevationCount + 1).fill().map((v, i) => st_elev + i * elevationStep)


    for (let elev of elevationAxis) {
        for (let lon of longitudeAxis) {
            datasource.entities.add({
                polyline: {
                    positions: [
                        Cesium.Cartesian3.fromDegrees(lon, st_lat, elev),
                        Cesium.Cartesian3.fromDegrees(lon, end_lat, elev),
                    ],
                    arcType: rhumb,
                    material: new Cesium.Color(1, 1, 1, 0.1),
                },
            });
        }

        for (let lat of latitudeAxis) {
            datasource.entities.add({
                polyline: {
                    positions: [
                        Cesium.Cartesian3.fromDegrees(st_lon, lat, elev),
                        Cesium.Cartesian3.fromDegrees(end_lon, lat, elev),
                    ],
                    arcType: rhumb,
                    material: new Cesium.Color(1, 1, 1, 0.1),
                },
            });
        }

        for (let lon of longitudeAxis) {
            for (let lat of latitudeAxis) {
                datasource.entities.add({
                    polyline: {
                        positions: [
                            Cesium.Cartesian3.fromDegrees(lon, lat, st_elev),
                            Cesium.Cartesian3.fromDegrees(lon, lat, end_elev),
                        ],
                        arcType: rhumb,
                        material: new Cesium.Color(1, 1, 1, 0.1),
                    },
                });
            }
        }
    }

    return datasource;
};