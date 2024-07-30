import * as Cesium from 'cesium';
import {useRecoilState} from "recoil";
import {OptionsState} from "@/recoils/Tool.ts";

const START_UP_HEIGHT = 50;

let screenSpaceEventHandler: Cesium.ScreenSpaceEventHandler | undefined = undefined;
// let pickedObject: Cesium.Entity | Cesium.Primitive | Cesium.Cesium3DTileFeature | undefined = undefined;
let pickedObject:  any = undefined;

let startHeight: number | undefined = undefined;
let startCartesian: Cesium.Cartesian3 | undefined = undefined;

let verticalPlane: Cesium.Plane | undefined = undefined;
let horizontalPlane: Cesium.Plane | undefined = undefined;

let globeOffset: Cesium.Cartesian3 | undefined = undefined;

export const useObjectTranslation = () => {

    const [options, setOptions] = useRecoilState(OptionsState);

    const onObjectTranslation = (viewer: Cesium.Viewer) => {
        const scene = viewer.scene;
        if (!screenSpaceEventHandler) {
            screenSpaceEventHandler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
        }

        const mouseDownHandler = (event: any) => {
            pickedObject = scene.pick(event.position); // 이벤트 위치에서 객체를 선택

            let localStartCartesian: Cesium.Cartesian3 | undefined;
            if (scene.pickPositionSupported) {
                // 위치 선택이 지원되는 경우
                localStartCartesian = viewer.scene.pickPosition(event.position);
            }
            localStartCartesian = localStartCartesian || viewer.camera.pickEllipsoid(event.position, scene.globe.ellipsoid);
            if (!localStartCartesian) return;

            startCartesian = localStartCartesian;
            const originCartographic = Cesium.Cartographic.fromCartesian(localStartCartesian);
            // 시작 위치에서 위로 50m 이동한 위치 계산 왜 50인지는 모름
            const startUpCartesian = Cesium.Cartesian3.fromRadians(
                originCartographic.longitude,
                originCartographic.latitude,
                originCartographic.height + START_UP_HEIGHT
            );
            let startUpNormal = Cesium.Cartesian3.subtract(startUpCartesian, localStartCartesian, new Cesium.Cartesian3());
            startUpNormal = Cesium.Cartesian3.normalize(startUpNormal, new Cesium.Cartesian3()); // 정규화하여 단위 벡터로 변환
            const cameraDirection = viewer.camera.direction;

            let startRight = Cesium.Cartesian3.cross(startUpNormal, cameraDirection, new Cesium.Cartesian3());
            startRight = Cesium.Cartesian3.normalize(startRight, new Cesium.Cartesian3()); // 정규화하여 단위 벡터로 변환

            let startDir = Cesium.Cartesian3.cross(startUpNormal, startRight, new Cesium.Cartesian3());
            startDir = Cesium.Cartesian3.normalize(startDir, new Cesium.Cartesian3()); // 정규화하여 단위 벡터로 변환
            verticalPlane = Cesium.Plane.fromPointNormal(localStartCartesian, startUpNormal, new Cesium.Plane(Cesium.Cartesian3.UNIT_X, 0.0));
            horizontalPlane = Cesium.Plane.fromPointNormal(localStartCartesian, startDir, new Cesium.Plane(Cesium.Cartesian3.UNIT_X, 0.0));
            startHeight = originCartographic.height; // 시작 위치의 높이 저장

            globeOffset = startCartesian;
            if (pickedObject) {
                setOptions((prev) => ({
                    ...prev,
                    isOpenObjectTool: false,
                    pickedObject: {
                        ...prev.pickedObject,
                        position: globeOffset
                    }
                }))
                toggleCameraControl(false);
            }
        }

        const mouseUpHandler = () => {
            if (!pickedObject) { return; }
            setOptions((prev) => ({
                ...prev,
                isOpenObjectTool: true,
                pickedObject: {
                    ...prev.pickedObject,
                    position: globeOffset
                }
            }))

            pickedObject = undefined;
            verticalPlane = undefined;
            globeOffset = undefined;

            toggleCameraControl(true);
        }

        const mouseMoveWithCtrlHandler = (moveEvent: Cesium.ScreenSpaceEventHandler.MotionEvent) => {
            if (pickedObject && Cesium.defined(pickedObject)) {
                const { pickedModel } = getPickedModel(pickedObject);

                if (!pickedModel) return;

                const ray = viewer.camera.getPickRay(moveEvent.endPosition);
                if (!ray || !horizontalPlane || !startCartesian ) { return;}
                const intersection = Cesium.IntersectionTests.rayPlane(ray, horizontalPlane, new Cesium.Cartesian3());
                const startMatrix = Cesium.Transforms.northEastDownToFixedFrame(startCartesian, Cesium.Ellipsoid.WGS84, new Cesium.Matrix4());

                const inverseMatrix = new Cesium.Matrix4();
                Cesium.Matrix4.inverse(startMatrix, inverseMatrix); // 역행렬 계산

                const startRay = viewer.camera.getPickRay(moveEvent.startPosition);
                if (!startRay ) return;

                const startIntersection = Cesium.IntersectionTests.rayPlane(startRay, horizontalPlane, new Cesium.Cartesian3());
                const startRayHeight = -startIntersection.z;
                const startTempHeight = startHeight? startHeight + startRayHeight : startRayHeight;

                const endRay = viewer.camera.getPickRay(moveEvent.endPosition);
                if (!endRay ) return;

                const endIntersection = Cesium.IntersectionTests.rayPlane(endRay, horizontalPlane, new Cesium.Cartesian3());
                const endRayHeight = -endIntersection.z;
                const endTempHeight = startHeight? startHeight + endRayHeight : endRayHeight;

                const intersectionLocal = Cesium.Matrix4.multiplyByPoint(inverseMatrix, intersection, new Cesium.Cartesian3());
                const offsetY = -intersectionLocal.z;

                const startCartographic = Cesium.Cartographic.fromCartesian(startCartesian);
                const startHeightPosition = Cesium.Cartesian3.fromRadians(startCartographic.longitude, startCartographic.latitude, startTempHeight);
                const endHeightPosition = Cesium.Cartesian3.fromRadians(startCartographic.longitude, startCartographic.latitude, endTempHeight);

                const surface = startHeightPosition;
                const offset = endHeightPosition;
                globeOffset = offset;
                const translation = Cesium.Cartesian3.subtract(surface, offset, new Cesium.Cartesian3());

                updateModelMatrix(pickedModel, translation);
            }
        }

        const mouseMoveHandler = (moveEvent: Cesium.ScreenSpaceEventHandler.MotionEvent) => {
            if (pickedObject && Cesium.defined(pickedObject)) {
                const { pickedModel } = getPickedModel(pickedObject);

                if (!pickedModel) return;

                const startRay = viewer.camera.getPickRay(moveEvent.startPosition);
                if (!startRay || !verticalPlane) return;
                const startIntersection = Cesium.IntersectionTests.rayPlane(startRay, verticalPlane, new Cesium.Cartesian3());

                const endRay = viewer.camera.getPickRay(moveEvent.endPosition);
                if (!endRay) return;
                const endIntersection = Cesium.IntersectionTests.rayPlane(endRay, verticalPlane, new Cesium.Cartesian3());

                const surface = startIntersection;
                const offset = endIntersection;
                globeOffset = offset;
                const translation = Cesium.Cartesian3.subtract(offset, surface, new Cesium.Cartesian3());

                updateModelMatrix(pickedModel, translation);
            }
        }

        const toggleCameraControl = (on: boolean) => {
            scene.screenSpaceCameraController.enableRotate = on;
            scene.screenSpaceCameraController.enableTranslate = on;
            scene.screenSpaceCameraController.enableZoom = on;
            scene.screenSpaceCameraController.enableTilt = on;
            scene.screenSpaceCameraController.enableLook = on;
        }

        screenSpaceEventHandler.setInputAction(mouseDownHandler, Cesium.ScreenSpaceEventType.LEFT_DOWN);
        screenSpaceEventHandler.setInputAction(mouseUpHandler, Cesium.ScreenSpaceEventType.LEFT_UP);
        screenSpaceEventHandler.setInputAction(mouseMoveHandler, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        screenSpaceEventHandler.setInputAction(mouseDownHandler, Cesium.ScreenSpaceEventType.LEFT_DOWN, Cesium.KeyboardEventModifier.CTRL);
        screenSpaceEventHandler.setInputAction(mouseUpHandler, Cesium.ScreenSpaceEventType.LEFT_UP, Cesium.KeyboardEventModifier.CTRL);
        screenSpaceEventHandler.setInputAction(mouseMoveWithCtrlHandler, Cesium.ScreenSpaceEventType.MOUSE_MOVE, Cesium.KeyboardEventModifier.CTRL);
    }

    const getPickedModel = (pickedObject: any) => {
        let pickedModel;
        let boundingSphere;

        if (pickedObject instanceof Cesium.Cesium3DTileFeature) {
            pickedModel = pickedObject.tileset;
            boundingSphere = pickedModel.boundingSphere;
        } else if (pickedObject?.primitive instanceof Cesium.Primitive) {
            pickedModel = pickedObject.primitive;
            boundingSphere = pickedObject.primitive._boundingSphereWC[0];
        } else if (pickedObject?.primitive instanceof Cesium.Model) {
            pickedModel = pickedObject.primitive;
            boundingSphere = pickedObject.primitive.boundingSphere;
        }

        return { pickedModel, boundingSphere };
    }

    const updateModelMatrix = (pickedModel: any, translation: Cesium.Cartesian3) => {
        if (!pickedModel) return;

        const modelMatrix = pickedModel.modelMatrix;
        const translationMatrix = Cesium.Matrix4.fromTranslation(translation);
        const translatedModelMatrix = Cesium.Matrix4.multiply(translationMatrix, modelMatrix, new Cesium.Matrix4());
        pickedModel.modelMatrix = translatedModelMatrix;

        // 선택된 객체가 프리미티브인 경우, 동일한 엔터티 컬렉션의 모든 프리미티브를 이동
        if (pickedObject?.primitive instanceof Cesium.Primitive) {
            const primitive = pickedObject.primitive;
            const owner = pickedObject.id.entityCollection.owner;
            const primitives = owner._primitives._primitives;
            for (let i = 1; i < primitives.length; i++) {
                const primitive = primitives[i];
                if (primitive instanceof Cesium.Primitive) {
                    primitive.modelMatrix = translatedModelMatrix;
                }
            }
        }
    }

    const offObjectTranslation = () => {
        if (screenSpaceEventHandler) {
            screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOWN);
            screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_UP);
            screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);

            screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOWN, Cesium.KeyboardEventModifier.CTRL);
            screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_UP, Cesium.KeyboardEventModifier.CTRL);
            screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE, Cesium.KeyboardEventModifier.CTRL);

            pickedObject = undefined;
            verticalPlane = undefined;
            globeOffset = undefined;
            screenSpaceEventHandler = undefined;
        }
    }

    return {
        onObjectTranslation,
        offObjectTranslation
    }
}

