import * as Cesium from 'cesium';

const START_UP_HEIGHT = 50;
class ObjectScalingHandler {
    private screenSpaceEventHandler: Cesium.ScreenSpaceEventHandler | undefined;
    private pickedObject: any | undefined;
    private plane: Cesium.Plane | undefined;

    constructor(private viewer: Cesium.Viewer) {
        this.screenSpaceEventHandler = undefined;
        this.pickedObject = undefined;
        this.plane = undefined;
    }

    public enable() {
        const scene = this.viewer.scene;
        if (!this.screenSpaceEventHandler) {
            this.screenSpaceEventHandler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
            this.screenSpaceEventHandler.setInputAction(this.mouseDownHandler, Cesium.ScreenSpaceEventType.LEFT_DOWN);
            this.screenSpaceEventHandler.setInputAction(this.mouseUpHandler, Cesium.ScreenSpaceEventType.LEFT_UP);
            this.screenSpaceEventHandler.setInputAction(this.mouseMoveHandler, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        }
    }

    public disable() {
        if (this.screenSpaceEventHandler) {
            this.pickedObject = undefined;
            this.plane = undefined;
            this.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOWN);
            this.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_UP);
            this.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
            this.screenSpaceEventHandler = undefined;
        }
        this.toggleCameraControl(true);
    }

    private mouseDownHandler = (event: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
        const scene = this.viewer.scene;
        const camera = this.viewer.camera;
        this.pickedObject = scene.pick(event.position);

        let startCartesian;
        if (scene.pickPositionSupported) {
            startCartesian = scene.pickPosition(event.position);
        }
        if (!startCartesian) {
            startCartesian = camera.pickEllipsoid(
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
        this.plane = Cesium.Plane.fromPointNormal(startCartesian, startUpNormal, new Cesium.Plane(Cesium.Cartesian3.UNIT_X, 0.0));

        if (this.pickedObject) {
            this.toggleCameraControl(false);
        }
    }

    private mouseUpHandler = () => {
        this.pickedObject = undefined;
        this.plane = undefined;
        this.toggleCameraControl(true);
    }

    private mouseMoveHandler = (moveEvent: Cesium.ScreenSpaceEventHandler.MotionEvent) => {
        const scene = this.viewer.scene;
        const camera = this.viewer.camera;

        if (!this.pickedObject || !Cesium.defined(this.pickedObject)) return;
        const pickedModel = this.getPickedModel(this.pickedObject);
        if (!pickedModel) return;
        const startRay = camera.getPickRay(moveEvent.startPosition);
        if (!startRay || !this.plane) return;
        const startIntersection = Cesium.IntersectionTests.rayPlane(startRay, this.plane, new Cesium.Cartesian3());

        const endRay = camera.getPickRay(moveEvent.endPosition);
        if (!endRay) return;
        const endIntersection = Cesium.IntersectionTests.rayPlane(endRay, this.plane, new Cesium.Cartesian3());

        const surface = startIntersection;
        const offset = endIntersection;

        const originCartographic = new Cesium.Cartesian3();
        const translation = Cesium.Cartesian3.subtract(
            offset,
            surface,
            new Cesium.Cartesian3()
        );

        const yOffset = moveEvent.startPosition.y - moveEvent.endPosition.y;

        const distance = 1 + yOffset / 100;
        const scaler = new Cesium.Cartesian3(distance, distance, distance);

        const boundingSphere = pickedModel?.boundingSphere?.center || pickedModel._boundingSphereWC[0].center;
        const ellipsoid = scene.globe.ellipsoid;
        const computedTransformMatrix = Cesium.Transforms.northUpEastToFixedFrame(boundingSphere, ellipsoid, new Cesium.Matrix4());

        const translate = new Cesium.Cartesian3(computedTransformMatrix[12], computedTransformMatrix[13], computedTransformMatrix[14])
        const translateNegate = Cesium.Cartesian3.negate(translate, new Cesium.Cartesian3());

        const translationMatrix = Cesium.Matrix4.fromTranslation(translate);
        const translationMatrixNegate = Cesium.Matrix4.fromTranslation(translateNegate);
        const scaleMatrix = Cesium.Matrix4.fromScale(scaler, new Cesium.Matrix4());

        let transformedMatrix = pickedModel.modelMatrix.clone();
        transformedMatrix = Cesium.Matrix4.multiply(translationMatrixNegate, transformedMatrix, new Cesium.Matrix4());
        transformedMatrix = Cesium.Matrix4.multiply(scaleMatrix, transformedMatrix, new Cesium.Matrix4());
        transformedMatrix = Cesium.Matrix4.multiply(translationMatrix, transformedMatrix, new Cesium.Matrix4());

        pickedModel.modelMatrix = transformedMatrix;
        this.updatePrimitivesModelMatrix(transformedMatrix);
    }

    private toggleCameraControl(enable: boolean) {
        const scene = this.viewer.scene;
        scene.screenSpaceCameraController.enableRotate = enable;
        scene.screenSpaceCameraController.enableTranslate = enable;
        scene.screenSpaceCameraController.enableZoom = enable;
        scene.screenSpaceCameraController.enableTilt = enable;
        scene.screenSpaceCameraController.enableLook = enable;
    }

    private getPickedModel(pickedObject: any) {
        if (pickedObject instanceof Cesium.Cesium3DTileFeature) {
            return pickedObject.tileset;
        } else if (pickedObject?.primitive instanceof Cesium.Primitive) {
            return pickedObject.primitive;
        } else if (pickedObject?.primitive instanceof Cesium.Model) {
            return pickedObject.primitive;
        }
        return undefined;
    }

    private updatePrimitivesModelMatrix(transformedMatrix: Cesium.Matrix4) {
        if (!(this.pickedObject?.primitive instanceof Cesium.Primitive)) return;
        const owner = this.pickedObject.id.entityCollection.owner;
        const primitives = owner._primitives._primitives;
        for (let i = 0; i < primitives.length; i++) {
            const primitive = primitives[i];
            if (primitive instanceof Cesium.Primitive) {
                primitive.modelMatrix = transformedMatrix;
            }
        }
    }


}

export default ObjectScalingHandler;