import * as Cesium from 'cesium';

class ObjectRotationHandler {
    private screenSpaceEventHandler: Cesium.ScreenSpaceEventHandler | undefined;
    private pickedObject: any | undefined;

    constructor(private viewer: Cesium.Viewer) {
        this.screenSpaceEventHandler = undefined;
        this.pickedObject = undefined;
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
            this.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOWN);
            this.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_UP);
            this.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
            this.screenSpaceEventHandler = undefined;
        }
        this.toggleCameraControl(true);
    }

    private mouseDownHandler = (event: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
        const scene = this.viewer.scene;
        this.pickedObject = scene.pick(event.position);
        if (this.pickedObject) {
            this.toggleCameraControl( false);
        }
    }

    private mouseUpHandler = () => {
        this.pickedObject = undefined;
        this.toggleCameraControl( true);
    }

    private mouseMoveHandler = (moveEvent: Cesium.ScreenSpaceEventHandler.MotionEvent) => {
        if (!this.pickedObject || !Cesium.defined(this.pickedObject)) return;
        const pickedModel = this.getPickedModel(this.pickedObject);
        if (!pickedModel) return;

        const scene = this.viewer.scene;
        const xOffset = moveEvent.endPosition.x - moveEvent.startPosition.x;

        const boundingSphere = pickedModel?.boundingSphere?.center ? pickedModel.boundingSphere.center : pickedModel._boundingSphereWC[0].center;

        const ellipsoid = scene.globe.ellipsoid;
        const computedTransformMatrix = Cesium.Transforms.northUpEastToFixedFrame(boundingSphere, ellipsoid, new Cesium.Matrix4());

        const modelMatrix = pickedModel.modelMatrix;

        const translate = new Cesium.Cartesian3(computedTransformMatrix[12], computedTransformMatrix[13], computedTransformMatrix[14])
        const translateNegate = Cesium.Cartesian3.negate(translate, new Cesium.Cartesian3());

        const translationMatrix = Cesium.Matrix4.fromTranslation(translate);
        const translationMatrixNegate = Cesium.Matrix4.fromTranslation(translateNegate);

        const axis = new Cesium.Cartesian3(computedTransformMatrix[4], computedTransformMatrix[5], computedTransformMatrix[6])

        const angle = Cesium.Math.toRadians(xOffset * 0.5);

        const quaternion = Cesium.Quaternion.fromAxisAngle(axis, angle, new Cesium.Quaternion());

        const rotationMatrix3 = Cesium.Matrix3.fromQuaternion(quaternion, new Cesium.Matrix3());
        const rotationMatrix4 = Cesium.Matrix4.fromRotation(rotationMatrix3, new Cesium.Matrix4());

        let transformedMatrix = modelMatrix.clone();
        transformedMatrix = Cesium.Matrix4.multiply(translationMatrixNegate, transformedMatrix, new Cesium.Matrix4());
        transformedMatrix = Cesium.Matrix4.multiply(rotationMatrix4, transformedMatrix, new Cesium.Matrix4());
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
export default ObjectRotationHandler;

