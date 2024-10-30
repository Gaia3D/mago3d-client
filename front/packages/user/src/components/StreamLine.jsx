import React, {useEffect, useRef, useState} from 'react';
import * as Cesium from 'cesium';
import ParticleSystem from '@/modules/streamline/ParticleSystem';
import { useGlobeController } from '@/components/providers/GlobeControllerProvider.tsx';

// constants
const particlesTextureSize = Math.ceil(100); // 무조건 int

// variables
const globeBoundingSphere = new Cesium.BoundingSphere(Cesium.Cartesian3.ZERO, 0.99 * 6378137.0)

const StreamLine = () => {
    const { globeController, initialized } = useGlobeController();
    const { windPrimitives } = globeController;
    const { viewer } = globeController;

    const [windData, setWindData] = useState(undefined);
    const [windowResized, setWindowResized] = useState(false);
    const [axes, setAxes] = useState([]);
    const [particleSystem, setParticleSystem] = useState(undefined);

    const [viewerParameters, setViewerParameters] = useState({
        lonRange: new Cesium.Cartesian2(),
        latRange: new Cesium.Cartesian2(),
        levRange: new Cesium.Cartesian2(),
        cameraPosition: new Cesium.Cartesian3(),
        pixelSize: 0.1,   // 줌레벨 관련 설정 (태국의 경우 메뉴얼로 설정해야 함. pixelSize를 수정하면 speedFactor, lineWidth 모두 적절한 값으로 수정해야 함)
        verticalScale: 1.0,
    })

    const [particleSystemOptions, setParticleSystemOptions] = useState({
        particlesTextureSize: particlesTextureSize,             // 파티클 텍스쳐 가로(혹은 세로) 길이
        maxParticles: Math.pow(particlesTextureSize, 2.0),      // 무조건 n*n 형태여야 함

        fadeOpacity: 0.996,
        dropRate: 0.003,
        dropRateBump: 0.01,
        speedFactor: 2.0,  // 바람 속도 계수
        lineWidth: 100.0, // 바람 파티클 가로 크기
    })

    useEffect(() => {
        if (!viewer) return;
        setParticleSystem(windData ? new ParticleSystem(viewer.scene.context, windData, particleSystemOptions, viewerParameters) : undefined);
    }, [viewer, windData, particleSystemOptions, viewerParameters]);

    useEffect(() => {
        if (particleSystem?.primitiveCollection) {
            windPrimitives.add(particleSystem.primitiveCollection);
            // sort
            const length = windPrimitives.length;
            const windPrimitiveCollections = Array(length).fill().map((v, i) =>
                windPrimitives.get(i)
            );
            const sorted = windPrimitiveCollections.sort((a, b) => a.originalData.altitudesOfLevel[1] - b.originalData.altitudesOfLevel[1]);
            console.log(sorted.map(w => w.originalData.altitudesOfLevel[1]));
            sorted.forEach(wind => {
                windPrimitives.raiseToTop(wind)
            });
        }

        return () => {
            if (particleSystem?.primitiveCollection) {
                windPrimitives.remove(particleSystem.primitiveCollection);
            }
        }
    }, [particleSystem]);

    const updateViewerParameters = () => {
        const scene = viewer.scene;
        const camera = viewer.camera;

        const viewRectangle = camera.computeViewRectangle(scene.globe.ellipsoid);
        const lonLatRange = viewRectangleToLonLatRange(viewRectangle);

        // globeBoundingSphere 를 카메라 앞으로 옮겨준다 (center를 지구중심에 둘 경우 카메라 각도에 따라 pixelSize가 0이 나옴을 방지)
        globeBoundingSphere.center = Cesium.Cartesian3.add(camera.positionWC,
            Cesium.Cartesian3.multiplyByScalar(
                Cesium.Cartesian3.normalize(camera.directionWC, new Cesium.Cartesian3()),
                Cesium.Cartesian3.magnitude(camera.positionWC),
                new Cesium.Cartesian3()
            ),
            new Cesium.Cartesian3()
        )
        // let newPixelSize = camera.getPixelSize(
        //   globeBoundingSphere,
        //   scene.drawingBufferWidth,
        //   scene.drawingBufferHeight
        // );
        // if (newPixelSize > 0) {
        //   newPixelSize = Math.min(newPixelSize, 5000);    // 5000으로 clamp
        // }

        // update viewerParameters
        setViewerParameters({
            lonRange: new Cesium.Cartesian2(lonLatRange.lon.min, lonLatRange.lon.max),
            latRange: new Cesium.Cartesian2(lonLatRange.lat.min, lonLatRange.lat.max),
            levRange: new Cesium.Cartesian2(0, camera.positionCartographic.height),
            cameraPosition: new Cesium.Cartesian3(
                camera.positionCartographic.longitude * Cesium.Math.DEGREES_PER_RADIAN,
                camera.positionCartographic.latitude * Cesium.Math.DEGREES_PER_RADIAN,
                camera.positionCartographic.height
            ),
            pixelSize: viewerParameters.pixelSize,
            verticalScale: 1.0,
        })
        console.log('??', viewerParameters.pixelSize)
    };

    const viewRectangleToLonLatRange = (viewRectangle) => {
        const range = {};
        const postiveWest = Cesium.Math.mod(viewRectangle.west, Cesium.Math.TWO_PI);
        const postiveEast = Cesium.Math.mod(viewRectangle.east, Cesium.Math.TWO_PI);
        const width = viewRectangle.width;

        let longitudeMin, longitudeMax;
        if (width > Cesium.Math.THREE_PI_OVER_TWO) {
            longitudeMin = 0.0;
            longitudeMax = Cesium.Math.TWO_PI;
        } else {
            if (postiveEast - postiveWest < width) {
                longitudeMin = postiveWest;
                longitudeMax = postiveWest + width;
            } else {
                longitudeMin = postiveWest;
                longitudeMax = postiveEast;
            }
        }

        range.lon = {
            min: Cesium.Math.toDegrees(longitudeMin),
            max: Cesium.Math.toDegrees(longitudeMax)
        }

        const south = viewRectangle.south;
        const north = viewRectangle.north;
        const height = viewRectangle.height;

        const extendHeight = height > Cesium.Math.PI / 12 ? height / 2 : height / 2;
        let extendedSouth = Cesium.Math.clampToLatitudeRange(south - extendHeight);
        let extendedNorth = Cesium.Math.clampToLatitudeRange(north + extendHeight);
        // extend the bound in high latitude area to make sure it can cover all the visible area
        if (extendedSouth < -Cesium.Math.PI_OVER_THREE) {
            extendedSouth = -Cesium.Math.PI_OVER_TWO;
        }
        if (extendedNorth > Cesium.Math.PI_OVER_THREE) {
            extendedNorth = Cesium.Math.PI_OVER_TWO;
        }

        range.lat = {
            min: Cesium.Math.toDegrees(extendedSouth),
            max: Cesium.Math.toDegrees(extendedNorth)
        }

        return range;
    };

    const particleSystemRef = useRef();
    useEffect(() => {
        particleSystemRef.current = particleSystem;
    }, [particleSystem]);
    const onCameraMoveStart = () => {
        if (particleSystemRef.current?.primitiveCollection) {
            particleSystemRef.current.primitiveCollection.show = false;  // particle 숨기기
        }
    }

    const onCameraMoveEnd = () => {
        updateViewerParameters();
    }

    const onWindowResize = () => {
        setWindowResized(true);
        if (particleSystem?.primitiveCollection) {
            particleSystem.primitiveCollection.show = false;  // particle 숨기기
        }
    }

    const onScenePreRender = () => {
        if (windowResized) {
            setWindowResized(false);

            setParticleSystem(windData ? new ParticleSystem(viewer.scene.context, windData, particleSystemOptions, viewerParameters) : undefined);
            // particleSystem.canvasResize(_viewer.scene.context);
            // TODO
            // that.addPrimitives();
            // if (windPrimitiveCollection)
            //     windPrimitiveCollection.show = true;
            // that.showPrimitives(true);
            // that.scene.primitives.show = true;
        }
    }

    const setEventListeners = () => {
        viewer.scene.camera.moveStart.addEventListener(onCameraMoveStart);
        viewer.scene.camera.moveEnd.addEventListener(onCameraMoveEnd);

        window.addEventListener("resize", onWindowResize);

        viewer.scene.preRender.addEventListener(onScenePreRender);
    }
    const unsetEventListeners = () => {
        viewer.scene.preRender.removeEventListener(onScenePreRender);

        window.removeEventListener("resize", onWindowResize);

        viewer.scene.camera.moveEnd.removeEventListener(onCameraMoveEnd);
        viewer.scene.camera.moveStart.removeEventListener(onCameraMoveStart);
    }

    const makeAxisLines = (st_lon, st_lat, st_elev, end_lon, end_lat, end_elev, count_axis_lon, count_axis_lat, count_axis_elev) => {
        const datasource = new Cesium.CustomDataSource()

        const rhumb = Cesium.ArcType.RHUMB

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

        elevationAxis.map(elev => {
            longitudeAxis.map(lon => {
                datasource.entities.add({
                    polyline: {
                        positions: [
                            Cesium.Cartesian3.fromDegrees(lon, st_lat, elev),
                            Cesium.Cartesian3.fromDegrees(lon, end_lat, elev),
                        ],
                        arcType: rhumb,
                        material: new Cesium.Color(1, 1, 1, 0.1),
                    }
                })
            })

            latitudeAxis.map(lat => {
                datasource.entities.add({
                    polyline: {
                        positions: [
                            Cesium.Cartesian3.fromDegrees(st_lon, lat, elev),
                            Cesium.Cartesian3.fromDegrees(end_lon, lat, elev),
                        ],
                        arcType: rhumb,
                        material: new Cesium.Color(1, 1, 1, 0.1),
                    }
                })
            })

            longitudeAxis.map(lon => {
                latitudeAxis.map(lat => {
                    datasource.entities.add({
                        polyline: {
                            positions: [
                                Cesium.Cartesian3.fromDegrees(lon, lat, st_elev),
                                Cesium.Cartesian3.fromDegrees(lon, lat, end_elev),
                            ],
                            arcType: rhumb,
                            material: new Cesium.Color(1, 1, 1, 0.1),
                        }
                    })
                })
            })
        })

        return datasource
    }

    useEffect(() => {
        if (!initialized || !viewer) return;

        initializeData();
        return () => {
            unsetEventListeners();

            if (particleSystem?.primitiveCollection) {
                windPrimitives.remove(particleSystem.primitiveCollection);
            }
            axes.forEach(axis => {
                viewer.dataSources.remove(axis);
            });
        };
    }, [initialized, viewer]);

    const initializeData = async () => {
        try{
            viewer.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(100.5452771, 13.72494, 15000),
                duration: 0
            })

            viewer.scene.skyAtmosphere.show = false;
            viewer.scene.globe.showGroundAtmosphere = false;
            viewer.scene.fog.enabled = false;

            setEventListeners();
            updateViewerParameters();

            // end conditions
            let data = null;
            // let stream = await getProductFile(product.product_name.replace(/\\/g, '/'));
            // const json = stream.data;
            const loadText = async (filePath) => {
                const response = await fetch(filePath);
                if (!response.ok) throw new Error(`Failed to load file: ${response.statusText}`);
                const text = await response.text();
                if (!text) throw new Error('Empty response');
                return JSON.parse(text);
            };
            // const url = `stream.txt`;
            const url = `/txt/stream_bangkok.txt`;
            const json = await loadText(url);
            const streamlineInfo = {
                dimensions: {
                    lon: json.dimensions[0],
                    lat: json.dimensions[1],
                    lev: json.dimensions[2],
                },
                boundary: {
                    lon: json.boundaryLon,
                    lat: json.boundaryLat,
                    lev: json.boundaryAlt,
                },
                altitudesOfLevel: json.altitudesOfLevel,
                UVW0: [
                    new Float32Array(json.U0),
                    new Float32Array(json.V0),
                    new Float32Array(json.W0),
                ],
                UVW1: [
                    new Float32Array(json.U1),
                    new Float32Array(json.V1),
                    new Float32Array(json.W1),
                ],
                UVW2: [
                    new Float32Array(json.U2),
                    new Float32Array(json.V2),
                    new Float32Array(json.W2),
                ],
                valueRange: {
                    U: json.URange,
                    V: json.VRange,
                    W: json.WRange,
                }
            }
            // console.log(streamlineInfo);//, new Date());

            data = streamlineInfo;
            // vertical scale
            const verticalScale = viewerParameters.verticalScale;
            data.boundary.lev = data.boundary.lev.map(v => v ? v * verticalScale : 0);
            data.altitudesOfLevel = data.altitudesOfLevel.map(v => v ? v * verticalScale : 0);
            data.UVW0[2] = data.UVW0[2].map(v => v ? v * verticalScale : 0);
            data.UVW1[2] = data.UVW1[2].map(v => v ? v * verticalScale : 0);
            data.UVW2[2] = data.UVW2[2].map(v => v ? v * verticalScale : 0);
            // axis
            data.altitudesOfLevel.forEach((altitude, i) => {
                if (i == data.altitudesOfLevel.length - 1)
                    return;
                const axis = makeAxisLines(data.boundary.lon[0], data.boundary.lat[0], data.altitudesOfLevel[i], data.boundary.lon[1], data.boundary.lat[1], data.altitudesOfLevel[i + 1],
                    1,//Math.floor(data.dimensions.lon / 10),
                    1,//Math.floor(data.dimensions.lat / 10),
                    1)
                viewer.dataSources.add(axis);
                setAxes([...axes, axis]);
            });
            // display wind
            setWindData(data);

        } catch (e) {
            console.log(e)
        }
    }

    return <></>;
};

export default StreamLine;
