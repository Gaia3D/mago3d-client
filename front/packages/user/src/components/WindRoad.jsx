import React, {useEffect, useState, useCallback, useRef} from 'react';
import { useGlobeController } from "@/components/providers/GlobeControllerProvider";
import * as Cesium from "cesium";
import { getWindData } from "@/modules/streamline/getStreamData.js";
import ParticleSystem from "@/modules/streamline/ParticleSystem.js";
import {viewRectangleToLonLatRange} from "@/modules/streamline/viewRectangleToLonLatRange.js";

const verticalScale = 1.0;
const particlesTextureSize = 100;
const globeBoundingSphere = new Cesium.BoundingSphere(Cesium.Cartesian3.ZERO, 0.99 * 6378137.0);

const WindRoad = () => {
    const [isWindVisible, setIsWindVisible] = useState(false);
    const { globeController, initialized } = useGlobeController();
    const { windPrimitives, viewer } = globeController;
    const [windData, setWindData] = useState(null);
    const [windowResized, setWindowResized] = useState(false);
    const [particleSystem, setParticleSystem] = useState(undefined);
    const particleSystemRef = useRef({});
    const addedAxesRef = useRef([]);

    const [viewerParameters, setViewerParameters] = useState({
        lonRange: new Cesium.Cartesian2(),
        latRange: new Cesium.Cartesian2(),
        levRange: new Cesium.Cartesian2(),
        cameraPosition: new Cesium.Cartesian3(),
        pixelSize: 0.1,   // 줌레벨 관련 설정 (태국의 경우 메뉴얼로 설정해야 함. pixelSize를 수정하면 speedFactor, lineWidth 모두 적절한 값으로 수정해야 함)
        verticalScale: 1.0,
    });

    const [particleSystemOptions, setParticleSystemOptions] = useState({
        particlesTextureSize: particlesTextureSize,             // 파티클 텍스쳐 가로(혹은 세로) 길이
        maxParticles: Math.pow(particlesTextureSize, 2.0),      // 무조건 n*n 형태여야 함
        fadeOpacity: 0.996,
        dropRate: 0.003,
        dropRateBump: 0.01,
        speedFactor: 2.0,  // 바람 속도 계수
        lineWidth: 100.0, // 바람 파티클 가로 크기
    });

    const handleWindVisibilityToggle = () => setIsWindVisible(prev => !prev);

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
    };


    const fetchAndDisplayWindData = useCallback(async () => {
        if (!viewer || !isWindVisible) return;

        viewer.scene.skyAtmosphere.show = false;
        viewer.scene.globe.showGroundAtmosphere = false;
        viewer.scene.fog.enabled = false;

        viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(100.5452771, 13.72494, 15000),
            duration: 2,
        });

        const { newWindData, newAxes } = await getWindData(verticalScale);
        setWindData(newWindData);

        if (newAxes?.length) {
            newAxes.forEach(axis => {
                viewer.dataSources.add(axis);
                addedAxesRef.current.push(axis); // ref 배열에 추가
            });
        }

        setEventListeners();
        updateViewerParameters();
    }, [isWindVisible, viewer]);

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
            if (particleSystem?.primitiveCollection && !particleSystem.primitiveCollection.isDestroyed()) {
                windPrimitives.remove(particleSystem.primitiveCollection);
            }
        }
    }, [particleSystem]);

    useEffect(() => {
        fetchAndDisplayWindData();

        return () => {
            if (!viewer) return;
            // 클린업 함수에서 ref 배열을 사용하여 viewer에서 axes 제거
            addedAxesRef.current.forEach(axis => viewer.dataSources.remove(axis));
            addedAxesRef.current = []; // ref 배열 초기화
            unsetEventListeners();
            windPrimitives.removeAll();
        };
    }, [fetchAndDisplayWindData]);

    useEffect(() => {
        particleSystemRef.current = particleSystem;
    }, [particleSystem]);

    return (
        <div>
            <button onClick={handleWindVisibilityToggle}>
                {isWindVisible ? 'Hide Wind' : 'Show Wind'}
            </button>
        </div>
    );
};

export default WindRoad;
