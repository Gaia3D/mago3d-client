import React, {useEffect, useMemo} from "react";
import {useGlobeController} from "@/components/providers/GlobeControllerProvider.tsx";
import * as Cesium from "cesium";
import {ClassificationType} from "cesium";
import {FeatureCollection, Geometry} from "@turf/turf";

const Watercourse = () => {
    const { globeController } = useGlobeController();

    const waterMaterial = useMemo(() => new Cesium.Material({
        fabric: {
            type: "Water",
            uniforms: {
                baseWaterColor: new Cesium.Color(0, 0.1, 0.2, 1),
                normalMap: Cesium.buildModuleUrl("/user/images/waterNormals.jpg"),
                frequency: 500.0,
                animationSpeed: 0.01,
                amplitude: 5,
                specularIntensity: 1.0,
            },
        },
    }), []);

    useEffect(() => {
        if (!globeController?.viewer) return;

        const scene = globeController.viewer.scene;
        const primitives = scene.primitives;
        const waterPrimitiveCollection = new Cesium.PrimitiveCollection();
        primitives.add(waterPrimitiveCollection);

        let isCancelled = false;

        const loadGeojson = async () => {
            try {
                const response = await fetch("/user/geojson/water.geojson");
                if (!response.ok) throw new Error("Failed to load geojson data");
                const geojsonData = await response.json();
                renderWaterPrimitives(geojsonData);
            } catch (error) {
                console.error("Error loading geojson data:", error);
            }
        };

        const renderWaterPrimitives = (vectorData: FeatureCollection) => {
            if (!scene || isCancelled) return;

            const batchSize = 100;
            let batchIndex = 0;
            const featureCount = vectorData.features.length;

            const addNextBatch = () => {
                if (isCancelled || batchIndex >= featureCount) return;

                const instances: Cesium.GeometryInstance[] = [];
                const endIndex = Math.min(batchIndex + batchSize, featureCount);

                for (; batchIndex < endIndex; batchIndex++) {
                    const feature = vectorData.features[batchIndex];
                    const geometry = feature.geometry as Geometry;
                    const properties = feature.properties as { hack_ord: number };
                    const width = (10 - properties.hack_ord) * 3;

                    if (geometry.type === "MultiLineString") {
                        for (const line of geometry.coordinates as number[][][]) {
                            const positions = line.map((coord: number[]) =>
                                Cesium.Cartesian3.fromDegrees(coord[0], coord[1])
                            );

                            instances.push(
                                new Cesium.GeometryInstance({
                                    geometry: new Cesium.CorridorGeometry({
                                        positions,
                                        width,
                                        vertexFormat: Cesium.VertexFormat.POSITION_AND_ST,
                                    }),
                                    attributes: {
                                        color: new Cesium.ColorGeometryInstanceAttribute(
                                            0, 0.1, 0.2, 1
                                        ),
                                        distanceDisplayCondition : new Cesium.DistanceDisplayConditionGeometryInstanceAttribute(0, 5000.0)
                                    },
                                })
                            );
                        }
                    }
                }

                if (instances.length > 0) {
                    const waterPrimitive = new Cesium.GroundPrimitive({
                        geometryInstances: instances,
                        appearance: new Cesium.MaterialAppearance({
                            material: waterMaterial,
                            translucent: true,
                        }),
                        asynchronous: true,
                        classificationType: ClassificationType.TERRAIN
                    });

                    waterPrimitiveCollection.add(waterPrimitive);
                }

                // requestIdleCallback(addNextBatch);
                setTimeout(addNextBatch, 100);
            };

            addNextBatch();
        };

        loadGeojson();

        return () => {
            isCancelled = true;
            primitives.remove(waterPrimitiveCollection);
        };
    }, [globeController]);

    return null;
};

export default Watercourse;
