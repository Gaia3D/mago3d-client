import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useGlobeController } from "@/components/providers/GlobeControllerProvider";
import * as Cesium from "cesium";
import { getWindData } from "@/modules/streamline/getStreamData.js";
import ParticleSystem from "@/modules/streamline/ParticleSystem.js";
import { viewRectangleToLonLatRange } from "@/modules/streamline/viewRectangleToLonLatRange.js";
import {useTranslation} from "react-i18next";

const verticalScale = 1.0;
const particlesTextureSize = 100;
const globeBoundingSphere = new Cesium.BoundingSphere(Cesium.Cartesian3.ZERO, 0.99 * 6378137.0);

const WindRoad = () => {
    const { t } = useTranslation();
    const [isWindVisible, setIsWindVisible] = useState(false);
    const { globeController: { windPrimitives, viewer } } = useGlobeController();
    const [windData, setWindData] = useState(null);
    const [windowResized, setWindowResized] = useState(false);
    const [particleSystem, setParticleSystem] = useState();
    const particleSystemRef = useRef({});
    const addedAxesRef = useRef([]);
    const urls = [
        "/user/txt/stream_bangkok.txt"
    ];
    const [urlIndex, setUrlIndex] = useState(0);  // URL을 변경할 인덱스

    const [viewerParameters, setViewerParameters] = useState({
        lonRange: new Cesium.Cartesian2(),
        latRange: new Cesium.Cartesian2(),
        levRange: new Cesium.Cartesian2(),
        cameraPosition: new Cesium.Cartesian3(),
        pixelSize: 0.1,
        verticalScale
    });

    const [particleSystemOptions, setParticleSystemOptions] = useState({
        particlesTextureSize,
        maxParticles: Math.pow(particlesTextureSize, 2.0),
        fadeOpacity: 0.996,
        dropRate: 0.003,
        dropRateBump: 0.01,
        speedFactor: 2.0,
        lineWidth: 100.0,
    });

    const handleWindVisibilityToggle = () => setIsWindVisible(prev => !prev);

    const onCameraMoveStart = () => particleSystemRef.current?.primitiveCollection && (particleSystemRef.current.primitiveCollection.show = false);
    const onCameraMoveEnd = () => updateViewerParameters();
    const onWindowResize = () => {
        setWindowResized(true);
        particleSystem?.primitiveCollection && (particleSystem.primitiveCollection.show = false);
    };

    const onScenePreRender = () => {
        if (windowResized) {
            setWindowResized(false);
            setParticleSystem(windData ? new ParticleSystem(viewer.scene.context, windData, particleSystemOptions, viewerParameters.current) : undefined);
        }
    };

    const setEventListeners = useCallback(() => {
        if (!viewer) return;
        viewer.scene.camera.moveStart.addEventListener(onCameraMoveStart);
        viewer.scene.camera.moveEnd.addEventListener(onCameraMoveEnd);
        window.addEventListener("resize", onWindowResize);
        viewer.scene.preRender.addEventListener(onScenePreRender);
    }, [viewer]);

    const unsetEventListeners = useCallback(() => {
        if (!viewer) return;
        viewer.scene.preRender.removeEventListener(onScenePreRender);
        window.removeEventListener("resize", onWindowResize);
        viewer.scene.camera.moveEnd.removeEventListener(onCameraMoveEnd);
        viewer.scene.camera.moveStart.removeEventListener(onCameraMoveStart);
    }, [viewer]);

    const updateViewerParameters = () => {
        const scene = viewer.scene;
        const camera = viewer.camera;

        const viewRectangle = camera.computeViewRectangle(scene.globe.ellipsoid);
        const lonLatRange = viewRectangleToLonLatRange(viewRectangle);
        globeBoundingSphere.center = Cesium.Cartesian3.add(camera.positionWC,
            Cesium.Cartesian3.multiplyByScalar(
                Cesium.Cartesian3.normalize(camera.directionWC, new Cesium.Cartesian3()),
                Cesium.Cartesian3.magnitude(camera.positionWC),
                new Cesium.Cartesian3()
            ),
            new Cesium.Cartesian3()
        )

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
            verticalScale
        });
    };

    const fetchAndDisplayWindData = useCallback(async () => {
        if (!viewer || !isWindVisible) return;
        setEventListeners();
        viewer.scene.skyAtmosphere.show = false;
        viewer.scene.globe.showGroundAtmosphere = false;
        viewer.scene.fog.enabled = false;

        const { newWindData, newAxes } = await getWindData(verticalScale, urls[urlIndex]);
        setWindData(newWindData);
        newAxes.forEach((axis, index) => {
            axis.name = `wind_axis_${index}`
            viewer.dataSources.add(axis);
            addedAxesRef.current.push(axis);
        });

    }, [isWindVisible, viewer, urlIndex]);

    useEffect(() => {
        if (!viewer) return;
        setParticleSystem(windData ? new ParticleSystem(viewer.scene.context, windData, particleSystemOptions, viewerParameters) : undefined);
    }, [viewer, windData, particleSystemOptions, viewerParameters]);

    useEffect(() => {
        if (particleSystem?.primitiveCollection && !particleSystem.primitiveCollection.isDestroyed()) {
            windPrimitives.add(particleSystem.primitiveCollection);

            const length = windPrimitives.length;
            const windPrimitiveCollections = Array(length)
                .fill()
                .map((v, i) => windPrimitives.get(i));
            const sorted = windPrimitiveCollections.sort(
                (a, b) => a.originalData.altitudesOfLevel[1] - b.originalData.altitudesOfLevel[1]
            );
            sorted.forEach(wind => {
                if (!wind.isDestroyed()) windPrimitives.raiseToTop(wind);
            });
        }

        return () => {
            if (particleSystem?.primitiveCollection && !particleSystem.primitiveCollection.isDestroyed()) {
                windPrimitives.remove(particleSystem.primitiveCollection);
            }
        };
    }, [particleSystem]);

    useEffect(() => {
        fetchAndDisplayWindData();
        return () => {
            if (!viewer) return;
            addedAxesRef.current.forEach(axis => viewer.dataSources.remove(axis));
            addedAxesRef.current = [];
            unsetEventListeners();
            windPrimitives.removeAll();
        };
    }, [fetchAndDisplayWindData]);

    useEffect(() => {
        particleSystemRef.current = particleSystem;
    }, [particleSystem]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setUrlIndex(prevIndex => (prevIndex + 1) % urls.length);
        }, 5000); // 5초마다 url 변경
        return () => clearInterval(intervalId); // 컴포넌트 언마운트 시 인터벌 클리어
    }, []);

    return (

            <button
                type="button"
                className={`wind ${isWindVisible? "selected" : "" }`}
                onClick={handleWindVisibilityToggle}
            >
                <div
                    className="toolbox-description--content wind"
                >
                    <div className="title">
                        {t("tool.wind")}
                    </div>
                </div>
            </button>
)
    ;
};

export default WindRoad;
