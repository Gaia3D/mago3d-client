import * as Cesium from 'cesium';

class ObjectTranslationHandler {
    private screenSpaceEventHandler: Cesium.ScreenSpaceEventHandler | undefined;
    private pickedObject: any | undefined;
    private startHeight: number | undefined;
    private startCartesian: Cesium.Cartesian3 | undefined;
    private verticalPlane: Cesium.Plane | undefined;
    private horizontalPlane: Cesium.Plane | undefined;
    private globeOffset: Cesium.Cartesian3 | undefined;
    private setOptions: React.Dispatch<React.SetStateAction<any>>;

    constructor(private viewer: Cesium.Viewer, setOptions: React.Dispatch<React.SetStateAction<any>>) {
        this.setOptions = setOptions;
        this.screenSpaceEventHandler = undefined;
        this.pickedObject = undefined;
        this.startHeight = undefined;
        this.startCartesian = undefined;
        this.verticalPlane = undefined;
        this.horizontalPlane = undefined;
        this.globeOffset = undefined;
    }

    public enable() {
        const scene = this.viewer.scene;
        if (!this.screenSpaceEventHandler) {
            this.screenSpaceEventHandler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
            this.screenSpaceEventHandler.setInputAction(this.mouseDownHandler, Cesium.ScreenSpaceEventType.LEFT_DOWN);
            this.screenSpaceEventHandler.setInputAction(this.mouseUpHandler, Cesium.ScreenSpaceEventType.LEFT_UP);
            this.screenSpaceEventHandler.setInputAction(this.mouseMoveHandler, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
            this.screenSpaceEventHandler.setInputAction(this.mouseDownHandler, Cesium.ScreenSpaceEventType.LEFT_DOWN, Cesium.KeyboardEventModifier.CTRL);
            this.screenSpaceEventHandler.setInputAction(this.mouseUpHandler, Cesium.ScreenSpaceEventType.LEFT_UP, Cesium.KeyboardEventModifier.CTRL);
            this.screenSpaceEventHandler.setInputAction(this.mouseMoveWithCtrlHandler, Cesium.ScreenSpaceEventType.MOUSE_MOVE, Cesium.KeyboardEventModifier.CTRL);
        }
    }

    public disable() {
        if (this.screenSpaceEventHandler) {
            this.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOWN);
            this.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_UP);
            this.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
            this.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOWN, Cesium.KeyboardEventModifier.CTRL);
            this.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_UP, Cesium.KeyboardEventModifier.CTRL);
            this.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE, Cesium.KeyboardEventModifier.CTRL);
            this.screenSpaceEventHandler = undefined;
        }

        this.pickedObject = undefined;
        this.verticalPlane = undefined;
        this.horizontalPlane = undefined;
        this.globeOffset = undefined;

        this.toggleCameraControl(true);
    }

    private mouseDownHandler = (event: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
        const scene = this.viewer.scene;
        this.pickedObject = scene.pick(event.position);
        if (!this.pickedObject) return;

        this.startCartesian = this.getStartCartesian(event.position);
        if (!this.startCartesian) return;

        const startCartographic = Cesium.Cartographic.fromCartesian(this.startCartesian);
        this.startHeight = startCartographic.height;

        const startUpNormal = this.calculateUpNormal(this.startCartesian, startCartographic);
        const startRight = this.calculateRight(startUpNormal);
        const startDir = Cesium.Cartesian3.cross(startUpNormal, startRight, new Cesium.Cartesian3());

        this.verticalPlane = Cesium.Plane.fromPointNormal(this.startCartesian, startUpNormal);
        this.horizontalPlane = Cesium.Plane.fromPointNormal(this.startCartesian, startDir);

        this.globeOffset = this.startCartesian;

        if(!this.pickedObject) return;
        this.toggleCameraControl(false);
        this.setOptions((prev: any) => ({
            ...prev,
            isOpenObjectTool: false,
            pickedObject: {
                ...prev.pickedObject,
                position: this.globeOffset
            }
        }))
    }

    private mouseUpHandler = () => {
        if(!this.pickedObject) return;
        this.toggleCameraControl(true);
        this.setOptions((prev: any) => ({
            ...prev,
            isOpenObjectTool: true,
            pickedObject: {
                ...prev.pickedObject,
                position: this.globeOffset
            }
        }))
        this.pickedObject = undefined;
        this.verticalPlane = undefined;
        this.horizontalPlane = undefined;
        this.globeOffset = undefined;
    }

    private mouseMoveHandler = (moveEvent: Cesium.ScreenSpaceEventHandler.MotionEvent) => {
        if (!this.pickedObject) return;
        const pickedModel = this.getPickedModel(this.pickedObject);
        if (!pickedModel) return;

        const { surface, offset } = this.calculateSurfaceAndOffset(moveEvent, this.verticalPlane);
        if (!surface || !offset) return;

        this.globeOffset = offset;
        const translation = Cesium.Cartesian3.subtract(offset, surface, new Cesium.Cartesian3());

        this.updateModelMatrix(pickedModel, translation);
    }

    private mouseMoveWithCtrlHandler = (moveEvent: Cesium.ScreenSpaceEventHandler.MotionEvent) => {
        if (!this.pickedObject) return;
        const pickedModel = this.getPickedModel(this.pickedObject);
        if (!pickedModel) return;

        const intersection = this.calculateIntersection(moveEvent, this.horizontalPlane);
        if (!intersection) return;

        const translation = this.calculateTranslation(intersection);
        this.updateModelMatrix(pickedModel, translation);
    }

    private getStartCartesian(position: Cesium.Cartesian2): Cesium.Cartesian3 | undefined {
        const scene = this.viewer.scene;
        let cartesian: Cesium.Cartesian3 | undefined = scene.pickPosition(position);
        if (!cartesian) {
            cartesian = this.viewer.camera.pickEllipsoid(position, scene.globe.ellipsoid);
        }
        return cartesian;
    }

    private calculateUpNormal(cartesian: Cesium.Cartesian3, cartographic: Cesium.Cartographic): Cesium.Cartesian3 {
        const startUpCartesian = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, cartographic.height + 50);
        const startUpNormal = Cesium.Cartesian3.subtract(startUpCartesian, cartesian, new Cesium.Cartesian3());
        return Cesium.Cartesian3.normalize(startUpNormal, new Cesium.Cartesian3());
    }

    private calculateRight(upNormal: Cesium.Cartesian3): Cesium.Cartesian3 {
        const cameraDirection = this.viewer.camera.direction;
        const startRight = Cesium.Cartesian3.cross(upNormal, cameraDirection, new Cesium.Cartesian3());
        return Cesium.Cartesian3.normalize(startRight, new Cesium.Cartesian3());
    }

    private calculateSurfaceAndOffset(moveEvent: Cesium.ScreenSpaceEventHandler.MotionEvent, plane: Cesium.Plane | undefined) {
        if (!plane) return { surface: undefined, offset: undefined };
        const scene = this.viewer.scene;
        const startRay = scene.camera.getPickRay(moveEvent.startPosition);
        const endRay = scene.camera.getPickRay(moveEvent.endPosition);
        if (!startRay || !endRay) return { surface: undefined, offset: undefined };
        const surface = Cesium.IntersectionTests.rayPlane(startRay, plane, new Cesium.Cartesian3());
        const offset = Cesium.IntersectionTests.rayPlane(endRay, plane, new Cesium.Cartesian3());
        return { surface, offset };
    }

    private calculateIntersection(moveEvent: Cesium.ScreenSpaceEventHandler.MotionEvent, plane: Cesium.Plane | undefined): Cesium.Cartesian3 | undefined {
        if (!plane) return undefined;
        const ray = this.viewer.camera.getPickRay(moveEvent.endPosition);
        if (!ray) return undefined;
        return Cesium.IntersectionTests.rayPlane(ray, plane, new Cesium.Cartesian3());
    }

    private calculateTranslation(intersection: Cesium.Cartesian3): Cesium.Cartesian3 {
        const inverseMatrix = new Cesium.Matrix4();
        const transform = Cesium.Transforms.eastNorthUpToFixedFrame(this.startCartesian!);
        Cesium.Matrix4.inverse(transform, inverseMatrix);
        const intersectionLocal = Cesium.Matrix4.multiplyByPoint(inverseMatrix, intersection, new Cesium.Cartesian3());
        return Cesium.Cartesian3.fromElements(0, 0, intersectionLocal.z, new Cesium.Cartesian3());
    }

    private updateModelMatrix(pickedModel: any, translation: Cesium.Cartesian3) {
        if (!pickedModel) return;
        const modelMatrix = pickedModel.modelMatrix;
        const translationMatrix = Cesium.Matrix4.fromTranslation(translation);
        const translatedModelMatrix = Cesium.Matrix4.multiply(translationMatrix, modelMatrix, new Cesium.Matrix4());
        pickedModel.modelMatrix = translatedModelMatrix;

        if ( !(this.pickedObject?.primitive instanceof Cesium.Primitive) ) return;
        const owner = this.pickedObject.id.entityCollection.owner;
        const primitives = owner._primitives._primitives;
        for (let i = 1; i < primitives.length; i++) {
            const primitive = primitives[i];
            if (primitive instanceof Cesium.Primitive) {
                primitive.modelMatrix = translatedModelMatrix;
            }
        }
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

    private toggleCameraControl(enable: boolean) {
        const scene = this.viewer.scene;
        scene.screenSpaceCameraController.enableRotate = enable;
        scene.screenSpaceCameraController.enableTranslate = enable;
        scene.screenSpaceCameraController.enableZoom = enable;
        scene.screenSpaceCameraController.enableTilt = enable;
        scene.screenSpaceCameraController.enableLook = enable;
    }
}

export default ObjectTranslationHandler;
