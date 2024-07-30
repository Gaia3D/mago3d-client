import * as Cesium from "cesium";
import { useRecoilState } from "recoil";
import { OptionsState } from "@/recoils/Tool.ts";

let currentFeature: any = undefined;
const color = Cesium.Color.ORANGE;
let tempColor : any = undefined;

export const useObjectSelector = () => {
    const [options, setOptions] = useRecoilState(OptionsState);
    const selected = {
        feature: undefined,
        originalColor: new Cesium.Color(),
    };
    const selectedEntity = new Cesium.Entity();

    let mouseMoveHandler: any = undefined;
    let leftClickHandler: any = undefined;
    let silhouetteStage: any = undefined;


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

        leftClickHandler = async function (movement: any) {
            silhouetteGreen.selected = [];
            let pickedFeature = viewer.scene.pick(movement.position);
            if(!pickedFeature) return;

            currentFeature = pickedFeature;

            if (pickedFeature?.id instanceof Cesium.Entity) {
                pickedFeature = pickedFeature.id;
            }

            if (!Cesium.defined(pickedFeature)) {
                if (clickHandler) {
                    clickHandler(movement);
                }
                return;
            }

            if (silhouetteGreen.selected[0] === pickedFeature) {
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
                    pickedObject: { id: pickedFeature._id, name: pickedFeature._name, position: clampedPosition },
                }));
                addDivElement();
            }

            silhouetteBlue.selected = [];
            silhouetteGreen.selected = [pickedFeature];
            viewer.selectedEntity = selectedEntity;
        };

        viewer.screenSpaceEventHandler.setInputAction(leftClickHandler, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    };

    const offObjectSelector = (viewer: Cesium.Viewer) => {
        if (mouseMoveHandler) {
            viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
            mouseMoveHandler = undefined;
        }
        if (leftClickHandler) {
            viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
            leftClickHandler = undefined;
        }
        if (silhouetteStage) {
            viewer.scene.postProcessStages.remove(silhouetteStage);
            silhouetteStage = undefined;
        }
        setOptions((prevOptions) => ({
            ...prevOptions,
            isOpenObjectTool: false,
            pickedObject: {
                ...prevOptions.pickedObject,
                position: undefined
            }
        }));
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
        setOptions((prevOptions) => ({
            ...prevOptions,
            isOpenObjectTool: false,
            pickedObject: {
                id: '',
                name: '',
                position: undefined,
            },
        }));
    }

    const addBuildingFloor = (viewer : Cesium.Viewer) => {

        const scene = viewer.scene;
        if (currentFeature?.primitive instanceof Cesium.Primitive) {
            tempColor = currentFeature.id.polygon.material;
        } else {
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

        // relocate the building
        const modelMatrix = currentFeature.primitive.modelMatrix;
        currentFeature.id.entityCollection.show = false;

        setTimeout(() => {
            if (currentFeature) {
                const owner = currentFeature.id.entityCollection.owner;
                const primitives = owner._primitives._primitives;
                for (let i = 1; i < primitives.length; i++) {
                    const primitive = primitives[i];
                    if (primitive instanceof Cesium.Primitive) {
                        primitive.modelMatrix = modelMatrix;
                    }
                }
                currentFeature.id.entityCollection.show = true;
            }
        }, 100);
    }

    const removeBuildingFloor = (viewer: Cesium.Viewer) => {
        const entityCollection = currentFeature.id.entityCollection;
        const entities = entityCollection.values;
        const length = entities.length;
        const lastEntity = entities[length - 1];

        entityCollection.remove(lastEntity);

        // relocate the building
        const modelMatrix = currentFeature.primitive.modelMatrix;
        currentFeature.id.entityCollection.show = false;
        setTimeout(() => {
            if (currentFeature) {
                const owner = currentFeature.id.entityCollection.owner;
                const primitives = owner._primitives._primitives;
                for (let i = 1; i < primitives.length; i++) {
                    const primitive = primitives[i];
                    if (primitive instanceof Cesium.Primitive) {
                        primitive.modelMatrix = modelMatrix;
                    }
                }
                currentFeature.id.entityCollection.show = true;
            }
        }, 100);
    }

    return {
        onObjectSelector,
        offObjectSelector,
        onRemoveObject,
        addBuildingFloor,
        removeBuildingFloor,
    };
}
