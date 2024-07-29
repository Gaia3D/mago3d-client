import * as Cesium from 'cesium';

let screenSpaceEventHandler : Cesium.ScreenSpaceEventHandler | undefined = undefined;
// let pickedObject: Cesium.Entity | Cesium.Primitive | Cesium.Cesium3DTileFeature | undefined = undefined;
let pickedObject: any = undefined;

export const onObjectRotation = (viewer : Cesium.Viewer) => {
    const scene = viewer.scene;
    if (!screenSpaceEventHandler) {
        screenSpaceEventHandler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
    }

    const mouseDownHandler = (event : any) => {
        pickedObject = scene.pick(event.position);

        if (pickedObject) {
            toggleCameraControl(scene, false);
        }
    }

    const mouseUpHandler = (event : any) => {
        pickedObject = undefined;

        toggleCameraControl(scene, true);
    }

    const mouseMoveHandler = (moveEvent : any) => {
        if (pickedObject && Cesium.defined(pickedObject)) {
            let pickedModel;
            if (pickedObject instanceof Cesium.Cesium3DTileFeature) {
                pickedModel = pickedObject.tileset;
            } else if (pickedObject?.primitive instanceof Cesium.Primitive) {
                pickedModel = pickedObject.primitive;
            } else if (pickedObject?.primitive instanceof Cesium.Model) {
                pickedModel = pickedObject.primitive;
            }

            if (!pickedModel) {
                return;
            }

            const xOffset = moveEvent.endPosition.x - moveEvent.startPosition.x;
            //const yOffset = moveEvent.endPosition.y - moveEvent.startPosition.y;

            const boundingSphere = pickedModel?.boundingSphere?.center ? pickedModel.boundingSphere.center : pickedModel._boundingSphereWC[0].center;
            const ellipsoid = viewer.scene.globe.ellipsoid;
            const computedTransformMatrix = Cesium.Transforms.northUpEastToFixedFrame(boundingSphere, ellipsoid, new Cesium.Matrix4());

            const modelMatrix = pickedModel.modelMatrix;

            const translate = new Cesium.Cartesian3(computedTransformMatrix[12], computedTransformMatrix[13], computedTransformMatrix[14])
            const translateNegate = Cesium.Cartesian3.negate(translate, new Cesium.Cartesian3());

            const translationMatrix = Cesium.Matrix4.fromTranslation(translate);
            const translationMatrixNegate = Cesium.Matrix4.fromTranslation(translateNegate);

            const axis = new Cesium.Cartesian3(computedTransformMatrix[4], computedTransformMatrix[5], computedTransformMatrix[6])

            //let angle = Cesium.Math.toRadians(Math.abs(xOffset) > Math.abs(yOffset) ? xOffset : -yOffset);
            //angle *= 0.5;

            const angle = Cesium.Math.toRadians(xOffset * 0.5);

            const quaternion = Cesium.Quaternion.fromAxisAngle(axis, angle, new Cesium.Quaternion());

            const rotationMatrix3 = Cesium.Matrix3.fromQuaternion(quaternion, new Cesium.Matrix3());
            const rotationMatrix4 = Cesium.Matrix4.fromRotation(rotationMatrix3, new Cesium.Matrix4());

            let transformedMatrix = modelMatrix.clone();
            transformedMatrix = Cesium.Matrix4.multiply(translationMatrixNegate, transformedMatrix, new Cesium.Matrix4());
            transformedMatrix = Cesium.Matrix4.multiply(rotationMatrix4, transformedMatrix, new Cesium.Matrix4());
            transformedMatrix = Cesium.Matrix4.multiply(translationMatrix, transformedMatrix, new Cesium.Matrix4());

            pickedModel.modelMatrix = transformedMatrix;

            if (pickedObject?.primitive instanceof Cesium.Primitive) {
                const primitive = pickedObject.primitive;
                const owner = pickedObject.id.entityCollection.owner;
                const primitives = owner._primitives._primitives;
                for (let i = 1; i < primitives.length; i++) {
                    const primitive = primitives[i];
                    if (primitive instanceof Cesium.Primitive) {
                        primitive.modelMatrix = transformedMatrix;
                    }
                }
            }
        }
    }

    screenSpaceEventHandler.setInputAction(mouseDownHandler, Cesium.ScreenSpaceEventType.LEFT_DOWN);
    screenSpaceEventHandler.setInputAction(mouseUpHandler, Cesium.ScreenSpaceEventType.LEFT_UP);
    screenSpaceEventHandler.setInputAction(mouseMoveHandler, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
}

export const offObjectRotation = (viewer : Cesium.Viewer) => {
    const scene = viewer.scene;
    if (screenSpaceEventHandler) {
        pickedObject = undefined;

        screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOWN);
        screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_UP);
        screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    }
    toggleCameraControl(scene, true);
    screenSpaceEventHandler = undefined;
}

const toggleCameraControl = ( scene: Cesium.Scene, on: boolean ) => {
    scene.screenSpaceCameraController.enableRotate = on;
    scene.screenSpaceCameraController.enableTranslate = on;
    scene.screenSpaceCameraController.enableZoom = on;
    scene.screenSpaceCameraController.enableTilt = on;
    scene.screenSpaceCameraController.enableLook = on;
}