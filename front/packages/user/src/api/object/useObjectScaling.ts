import * as Cesium from 'cesium';

const START_UP_HEIGHT = 50;

let screenSpaceEventHandler : Cesium.ScreenSpaceEventHandler | undefined = undefined;
// let pickedObject: Cesium.Entity | Cesium.Primitive | Cesium.Cesium3DTileFeature | undefined = undefined;
let pickedObject: any = undefined;
let plane : Cesium.Plane | undefined = undefined;

export const onObjectScaling = (viewer : Cesium.Viewer) => {
    const scene = viewer.scene;

    if (!screenSpaceEventHandler) {
        screenSpaceEventHandler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
    }

    const mouseDownHandler = (event : any) => {
        pickedObject = scene.pick(event.position);

        let startCartesian;
        if (scene.pickPositionSupported) {
            startCartesian = viewer.scene.pickPosition(event.position);
        }
        if (!startCartesian) {
            startCartesian = viewer.camera.pickEllipsoid(
                event.position,
                scene.globe.ellipsoid);
        }

        if(!startCartesian) return;
        const originCartographic = Cesium.Cartographic.fromCartesian(
            startCartesian
        );
        const startUpCartesian= Cesium.Cartesian3.fromRadians(originCartographic.longitude, originCartographic.latitude, originCartographic.height + START_UP_HEIGHT);
        let startUpNormal = Cesium.Cartesian3.subtract(startUpCartesian, startCartesian, new Cesium.Cartesian3());
        startUpNormal = Cesium.Cartesian3.normalize(startUpNormal, new Cesium.Cartesian3());
        plane = Cesium.Plane.fromPointNormal(startCartesian, startUpNormal, new Cesium.Plane(Cesium.Cartesian3.UNIT_X, 0.0));

        if (pickedObject) {
            scene.screenSpaceCameraController.enableRotate = false;
            scene.screenSpaceCameraController.enableTranslate = false;
            scene.screenSpaceCameraController.enableZoom = false;
            scene.screenSpaceCameraController.enableTilt = false;
            scene.screenSpaceCameraController.enableLook = false;
        }
    }

    const mouseUpHandler = (event : any) => {
        pickedObject = undefined;
        plane = undefined;

        scene.screenSpaceCameraController.enableRotate = true;
        scene.screenSpaceCameraController.enableTranslate = true;
        scene.screenSpaceCameraController.enableZoom = true;
        scene.screenSpaceCameraController.enableTilt = true;
        scene.screenSpaceCameraController.enableLook = true;
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
            const startRay = viewer.camera.getPickRay(moveEvent.startPosition);
            if (!startRay || !plane) return;
            const startIntersection = Cesium.IntersectionTests.rayPlane(startRay, plane, new Cesium.Cartesian3());

            const endRay = viewer.camera.getPickRay(moveEvent.endPosition);
            if (!endRay) return;
            const endIntersection = Cesium.IntersectionTests.rayPlane(endRay, plane, new Cesium.Cartesian3());

            const surface = startIntersection;
            const offset = endIntersection;

            const originCartographic = new Cesium.Cartesian3();
            const translation = Cesium.Cartesian3.subtract(
                offset,
                surface,
                new Cesium.Cartesian3()
            );

            //const xOffset = moveEvent.endPosition.x - moveEvent.startPosition.x;
            const yOffset = moveEvent.startPosition.y - moveEvent.endPosition.y;
            //const averageOffset = (xOffset + yOffset) / 2;

            //let distance = Cesium.Cartesian3.magnitude(translation);
            //const distance = 1.001;
            //distance = distance < 0 ? 0 : distance;
            //const offsetDistance = Cesium.Cartesian2.distance(moveEvent.startPosition, moveEvent.endPosition);

            //const distanceX = 1 + xOffset / 100;
            //const distanceY = 1 + yOffset / 100;
            //const distance = 1 + offsetDistance / 100;

            const distance = 1 + yOffset / 100;
            const scaler = new Cesium.Cartesian3(distance, distance, distance);

            const boundingSphere = pickedModel?.boundingSphere?.center ? pickedModel.boundingSphere.center : pickedModel._boundingSphereWC[0].center;
            const ellipsoid = viewer.scene.globe.ellipsoid;
            const computedTransformMatrix = Cesium.Transforms.northUpEastToFixedFrame(boundingSphere, ellipsoid, new Cesium.Matrix4());

            const translate = new Cesium.Cartesian3(computedTransformMatrix[12], computedTransformMatrix[13], computedTransformMatrix[14])
            const translateNegate = Cesium.Cartesian3.negate(translate, new Cesium.Cartesian3());

            const translationMatrix = Cesium.Matrix4.fromTranslation(translate);
            const translationMatrixNegate = Cesium.Matrix4.fromTranslation(translateNegate);

            const modelMatrix = pickedModel.modelMatrix;
            const scaleMatrix = Cesium.Matrix4.fromScale(scaler, new Cesium.Matrix4());
            //const translatedModelMatrix= Cesium.Matrix4.multiply(modelMatrix, scaleMatrix, new Cesium.Matrix4());
            //pickedModel.modelMatrix = translatedModelMatrix;

            let transformedMatrix = modelMatrix.clone();
            transformedMatrix = Cesium.Matrix4.multiply(translationMatrixNegate, transformedMatrix, new Cesium.Matrix4());
            transformedMatrix = Cesium.Matrix4.multiply(scaleMatrix, transformedMatrix, new Cesium.Matrix4());
            transformedMatrix = Cesium.Matrix4.multiply(translationMatrix, transformedMatrix, new Cesium.Matrix4());

            pickedModel.modelMatrix = transformedMatrix;

            // If the picked object is a primitive, translate all the primitives in the same entityCollection
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


export const offObjectScaling = () => {
    if (screenSpaceEventHandler) {
        pickedObject = undefined;
        plane = undefined;

        screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOWN);
        screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_UP);
        screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    }
}