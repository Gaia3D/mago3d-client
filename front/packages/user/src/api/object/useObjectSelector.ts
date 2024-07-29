import * as Cesium from "cesium";
import { useRecoilState } from "recoil";
import { OptionsState } from "@/recoils/Tool.ts";

export const useObjectSelector = () => {
    const [options, setOptions] = useRecoilState(OptionsState);
    const selected = {
        feature: undefined,
        originalColor: new Cesium.Color(),
    };
    const selectedEntity = new Cesium.Entity();

    let mouseMoveHandler: any;
    let leftClickHandler: any;
    let silhouetteStage: any;

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
            objectPosition: undefined,
        }));
    };

    return {
        onObjectSelector,
        offObjectSelector,
    };
}
