import * as Cesium from "cesium";
import { useRecoilState } from "recoil";
import { OptionsState } from "@/recoils/Tool.ts";
import {useEffect, useState} from "react";
import {useGlobeController} from "@/components/providers/GlobeControllerProvider.tsx";
import {current} from "immer";

let currentFeature: any = undefined;
const color = Cesium.Color.ORANGE;

export const useObjectSelector = () => {
    const { globeController } = useGlobeController();
    const { viewer } = globeController;
    const [options, setOptions] = useRecoilState(OptionsState);
    const selected = {
        feature: undefined,
        originalColor: new Cesium.Color(),
    };
    const selectedEntity = new Cesium.Entity();

    let mouseMoveHandler: any = undefined;
    let leftDownHandler: any = undefined;
    let leftClickHandler: any = undefined;
    let silhouetteStage: any = undefined;
    // let silhouetteStage: Cesium.PostProcessStage | undefined = undefined;
    // const [currentFeature, setCurrentFeature] = useState<any>(undefined);

    useEffect(() => {
        return () => {
            if (viewer) offObjectSelector(viewer); // 컴포넌트 언마운트 시 이벤트 핸들러 제거
        };
    }, []);

    function addDivElement() {
        setOptions((prevOptions) => ({
            ...prevOptions,
            isOpenObjectTool: true,
        }));
    }

    const onObjectSelector = (viewer: Cesium.Viewer) => {
        const clickHandler = viewer.screenSpaceEventHandler.getInputAction(
            Cesium.ScreenSpaceEventType.LEFT_CLICK
        );

        if (!Cesium.PostProcessStageLibrary.isSilhouetteSupported(viewer.scene)) {
            console.log("실루엣 효과가 지원되지 않습니다.");
            return;
        }

        if (silhouetteStage) {
            viewer.scene.postProcessStages.remove(silhouetteStage);
        }

        const silhouetteBlue = Cesium.PostProcessStageLibrary.createEdgeDetectionStage();
        silhouetteBlue.uniforms.color = Cesium.Color.BLUE;
        silhouetteBlue.uniforms.length = 0.01;
        silhouetteBlue.selected = [];

        const silhouetteGreen = Cesium.PostProcessStageLibrary.createEdgeDetectionStage();
        silhouetteGreen.uniforms.color = Cesium.Color.LIME;
        silhouetteGreen.uniforms.length = 0.01;
        silhouetteGreen.selected = [];

        silhouetteStage = viewer.scene.postProcessStages.add(
            Cesium.PostProcessStageLibrary.createSilhouetteStage([silhouetteBlue, silhouetteGreen])
        );

        mouseMoveHandler = function (movement: any) {
            silhouetteBlue.selected = [];
            let pickedFeature = viewer.scene.pick(movement.endPosition);

            if (!Cesium.defined(pickedFeature)) {
                return;
            }

            if (pickedFeature?.id instanceof Cesium.Entity) {
                pickedFeature = pickedFeature.id;
            }

            if (pickedFeature !== selected.feature) {
                silhouetteBlue.selected = [pickedFeature];
            }
        };

        viewer.screenSpaceEventHandler.setInputAction(mouseMoveHandler, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        leftDownHandler = function (movement: any) {
            const pickedFeature = viewer.scene.pick(movement.position);
            if(pickedFeature) {
                currentFeature = pickedFeature;
            } else {
                currentFeature = undefined;
                setOptions((prevOptions) => ({
                    ...prevOptions,
                    isOpenObjectTool: false,
                }));
            }
        }

        leftClickHandler = async function (movement: any) {
            silhouetteGreen.selected = [];
            // if (currentFeature?.id instanceof Cesium.Entity) {
            //     currentFeature = currentFeature.id;
            // }
            if (!Cesium.defined(currentFeature)) {
                if (clickHandler) {
                    clickHandler(movement);
                }
                return;
            }
            if (silhouetteGreen.selected[0] === currentFeature) {
                return;
            }
            const pickedPosition = viewer.scene.pickPosition(movement.position);
            if (pickedPosition) {
                const terrainProvider = viewer.terrainProvider;
                const cartographic = Cesium.Cartographic.fromCartesian(pickedPosition);
                const positions = [cartographic];
                const updatedPositions = await Cesium.sampleTerrainMostDetailed(terrainProvider, positions);
                const clampedPosition = Cesium.Cartesian3.fromRadians(
                    cartographic.longitude,
                    cartographic.latitude,
                    updatedPositions[0].height
                );
                // Cesium 객체를 직접 상태에 저장하지 않고, 필요한 최소한의 정보만 저장
                setOptions((prevOptions) => ({
                    ...prevOptions,
                    pickedObject: { id: currentFeature._id, name: currentFeature._name, position: clampedPosition },
                }));
                addDivElement();
            }
            silhouetteBlue.selected = [];
            silhouetteGreen.selected = [currentFeature];
            viewer.selectedEntity = selectedEntity;
        };

        viewer.screenSpaceEventHandler.setInputAction(leftDownHandler, Cesium.ScreenSpaceEventType.LEFT_DOWN);
        viewer.screenSpaceEventHandler.setInputAction(leftClickHandler, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    };

    const offObjectSelector = (viewer: Cesium.Viewer) => {
        if (mouseMoveHandler) {
            viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
            mouseMoveHandler = undefined;
        }
        if (leftDownHandler) {
            viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOWN);
            leftDownHandler = undefined;
        }
        if (leftClickHandler) {
            viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
            leftClickHandler = undefined;
        }
        if (silhouetteStage) {
            viewer.scene.postProcessStages.remove(silhouetteStage);
            silhouetteStage = undefined;
        }
        setTimeout(() => {
            setOptions((prevOptions) => ({
                ...prevOptions,
                isOpenObjectTool: false,
                pickedObject: {
                    id: '',
                    name: '',
                    position: undefined
                }
            }));
        }, 0);
        currentFeature = undefined;
    };

    const onRemoveObject = (viewer: Cesium.Viewer) => {
        if(!confirm("해당 건물을 삭제하시겠습니까?")) return;
        if (!currentFeature || !viewer) return;

        if (currentFeature && Cesium.defined(currentFeature)) {
            if (currentFeature?.primitive instanceof Cesium.Primitive) {
                const entityCollection = currentFeature.id.entityCollection;
                entityCollection.removeAll()
            } else if (currentFeature?.primitive instanceof Cesium.Cesium3DTileset) {
                const tileset = currentFeature.primitive;
                viewer.scene.primitives.remove(tileset);
            } else if (currentFeature?.primitive instanceof Cesium.Model) {
                const model = currentFeature.primitive;
                viewer.scene.primitives.remove(model);
            }
        }
        currentFeature = undefined;
        setTimeout(() => {
            setOptions((prevOptions) => ({
                ...prevOptions,
                isOpenObjectTool: false,
                pickedObject: {
                    id: '',
                    name: '',
                    position: undefined,
                },
            }));
        }, 0);
    }

    const addBuildingFloor = (viewer : Cesium.Viewer) => {
        if (!(currentFeature?.primitive instanceof Cesium.Primitive)) {
            return;
        }

        const entityCollection = currentFeature.id.entityCollection;
        const entities = entityCollection.values;
        const length = entities.length;
        const lastEntity = entities[length - 1];
        const lastPolygon = lastEntity.polygon;

        const polygonHierarchy = lastPolygon.hierarchy;
        const positions = polygonHierarchy.getValue().positions;

        const floorHeight = lastPolygon.extrudedHeight.getValue() - lastPolygon.height.getValue(); // 2.5
        const altitude = lastPolygon.extrudedHeight.getValue();
        const extrudedHeight = lastPolygon.extrudedHeight.getValue() + floorHeight;
        const newEntity = new Cesium.Entity({
            polygon: {
                hierarchy: new Cesium.PolygonHierarchy(positions),
                material: color,
                outline: false,
                height: altitude,
                extrudedHeight: extrudedHeight,
                shadows: Cesium.ShadowMode.ENABLED,
                outlineColor: color.withAlpha(0.5),
            }
        });
        entityCollection.add(newEntity);

        relocateBuilding(currentFeature);
    }

    const removeBuildingFloor = (viewer: Cesium.Viewer) => {
        const entityCollection = currentFeature.id.entityCollection;
        const entities = entityCollection.values;
        const length = entities.length;
        const lastEntity = entities[length - 1];

        entityCollection.remove(lastEntity);

        relocateBuilding(currentFeature);
    }

    const onObjectColoring = (viewer:Cesium.Viewer, pickedColor: string) => {
        if (currentFeature.primitive instanceof Cesium.Primitive) {
            if (currentFeature.id.entityCollection) {
                const entityCollection = currentFeature.id.entityCollection;
                const entities = entityCollection._entities._array;
                entities.forEach((entity : any) => {
                    const polygon = entity.polygon;
                    if (polygon) {
                        polygon.material = Cesium.Color.fromCssColorString(pickedColor);
                    }
                });

                currentFeature.id.entityCollection.show = false;
                relocateBuilding(currentFeature);
            } else {
                currentFeature.primitive.color = Cesium.Color.fromCssColorString(pickedColor);
            }

        } else if (currentFeature.primitive instanceof Cesium.Model) {
            currentFeature.primitive.color = Cesium.Color.fromCssColorString(pickedColor);
        } else if (currentFeature.primitive instanceof Cesium.Cesium3DTileset) {
            currentFeature.primitive.style = new Cesium.Cesium3DTileStyle({
                color: `color('${pickedColor}')`
            });
        }
    }

    const onObjectCopy = (viewer: Cesium.Viewer) => {
        if (currentFeature && Cesium.defined(currentFeature)) {
            if (currentFeature?.primitive instanceof Cesium.Primitive) {
                const entityCollection = currentFeature.id.entityCollection;
                const customDataSource = new Cesium.CustomDataSource();
                const entities = entityCollection._entities._array;
                for (let i = 0; i < entities.length; i++) {
                    const entity = entities[i];
                    const polygon = entity.polygon;
                    const newEntity = new Cesium.Entity({
                        polygon: {
                            hierarchy: polygon.hierarchy._value,
                            material: polygon.material,
                            outline: polygon.outline._value,
                            height: polygon.height._value,
                            extrudedHeight: polygon.extrudedHeight._value,
                            shadows: polygon.shadows._value,
                            outlineColor: polygon.outlineColor._value,
                        },
                        //show: false,
                    });
                    customDataSource.entities.add(newEntity);
                    customDataSource.show = false;
                }

                setTimeout(() => {
                    const modelMatrix = currentFeature.primitive.modelMatrix;
                    /* @ts-expect-error: null */
                    const primitives = customDataSource._primitives._primitives;
                    for (let i = 1; i < primitives.length; i++) {
                        const primitive = primitives[i];
                        if (primitive instanceof Cesium.Primitive) {
                            primitive.modelMatrix = modelMatrix;
                        }
                    }
                    customDataSource.show = true;
                }, 100);
                viewer.dataSources.add(customDataSource);
            } else if (currentFeature?.primitive instanceof Cesium.Cesium3DTileset) {
                const tileset = currentFeature.primitive;
                const tilesetCopy = tileset.clone();
                tilesetCopy.readyPromise.then(() => {
                    tilesetCopy.show = true;
                    viewer.scene.primitives.add(tilesetCopy);
                });
            } else if (currentFeature?.primitive instanceof Cesium.Model) {
                const model = currentFeature.primitive;
                const url = model._resource.url;

                const modelCopy = Cesium.Model.fromGltfAsync({
                    url: url,
                    //show: false,
                    modelMatrix: model.modelMatrix,
                    scale: model.scale,
                });
                modelCopy.then((modelCopy) => {
                    //modelCopy.show = true;
                    viewer.scene.primitives.add(modelCopy);
                });
            }
        }
        alert("건물이 복사되었습니다.");
    }

    const relocateBuilding = (feature: any) => {
        const modelMatrix = feature.primitive.modelMatrix;
        feature.id.entityCollection.show = false;
        setTimeout(() => {
            if (feature) {
                const owner = feature.id.entityCollection.owner;
                const primitives = owner._primitives._primitives;
                for (let i = 1; i < primitives.length; i++) {
                    const primitive = primitives[i];
                    if (primitive instanceof Cesium.Primitive) {
                        primitive.modelMatrix = modelMatrix;
                    }
                }
                feature.id.entityCollection.show = true;
            }
        }, 100);
    };

    return {onObjectSelector, offObjectSelector, onRemoveObject, addBuildingFloor, removeBuildingFloor, onObjectColoring, onObjectCopy};
}
