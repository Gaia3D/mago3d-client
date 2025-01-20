import * as Cesium from "cesium";
import { eventManager } from "@/components/tool/actions/eventManager.ts";
import {GlobeController} from "@/api/GlobeController.ts";

const MAN_HEIGHT = 2;
const UP_HEIGHT = 50.0;
const color = Cesium.Color.RED;

let status = false;

let startCartesian: Cesium.Cartesian3 | undefined = undefined;
let endCartesian: Cesium.Cartesian3 | undefined = undefined;

export const createSetAxisView = (globeController: GlobeController) => {
    const { viewer, toolDataSource } = globeController;
    if (!viewer) return;

    eventManager.init(viewer);

    const adjustHeight = (cartesian: Cesium.Cartesian3, height: number): Cesium.Cartesian3 => {
        const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
        return Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, cartographic.height + height);
    };

    const setCameraView = (start: Cesium.Cartesian3, end: Cesium.Cartesian3) => {
        const startDestination = adjustHeight(start, MAN_HEIGHT);

        const direction = Cesium.Cartesian3.subtract(end, start, new Cesium.Cartesian3());
        const directionNormal = Cesium.Cartesian3.normalize(direction, new Cesium.Cartesian3());

        const upCartesian = adjustHeight(start, UP_HEIGHT);
        const upNormal = Cesium.Cartesian3.subtract(upCartesian, start, new Cesium.Cartesian3());

        viewer.camera.setView({
            destination: startDestination,
            orientation: {
                direction: directionNormal,
                up: upNormal,
            },
        });
    };

    const mouseLeftClickHandler = (event: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
        if (!status) {
            status = true;
            toolDataSource.entities.removeById("start-point");
            toolDataSource.entities.removeById("axis-polyline");
        } else {
            status = false;
            if (startCartesian && endCartesian) {
                setCameraView(startCartesian, endCartesian);
            }
            return;
        }

        let pickedEllipsoidPosition = getEllipsoidPosition(event.position);

        if (pickedEllipsoidPosition) {
            pickedEllipsoidPosition = adjustHeight(pickedEllipsoidPosition, MAN_HEIGHT);
            startCartesian = pickedEllipsoidPosition;
            endCartesian = startCartesian;

            toolDataSource.entities.add({
                id: "start-point",
                position: startCartesian,
                point: {
                    color: Cesium.Color.RED,
                    pixelSize: 4,
                    disableDepthTestDistance: Number.POSITIVE_INFINITY,
                },
            });

            toolDataSource.entities.add({
                id: "axis-polyline",
                polyline: {
                    positions: new Cesium.CallbackProperty(() => [startCartesian, endCartesian], false),
                    width: 5,
                    depthFailMaterial: color,
                    material: new Cesium.PolylineArrowMaterialProperty(color),
                },
            });
        }
    };

    const mouseMoveHandler = (moveEvent: Cesium.ScreenSpaceEventHandler.MotionEvent) => {
        if (!status) return;

        const position = getEllipsoidPosition(moveEvent.endPosition);
        if (position) {
            endCartesian = adjustHeight(position, MAN_HEIGHT);
        }
    };

    const getEllipsoidPosition = (position: Cesium.Cartesian2): Cesium.Cartesian3 | undefined => {
        const scene = viewer.scene;
        let pickedEllipsoidPosition;

        if (scene.pickPositionSupported) {
            pickedEllipsoidPosition = viewer.scene.pickPosition(position);
        }

        if (!pickedEllipsoidPosition) {
            pickedEllipsoidPosition = viewer.camera.pickEllipsoid(position, scene.globe.ellipsoid);
            if (pickedEllipsoidPosition) {
                const cartographic = Cesium.Cartographic.fromCartesian(pickedEllipsoidPosition);
                const height = scene.globe.getHeight(cartographic);
                pickedEllipsoidPosition = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, height || 0);
            }
        }

        return pickedEllipsoidPosition;
    };

    eventManager.addHandler(Cesium.ScreenSpaceEventType.LEFT_CLICK, mouseLeftClickHandler);
    eventManager.addHandler(Cesium.ScreenSpaceEventType.MOUSE_MOVE, mouseMoveHandler);
};

export const removeSetAxisView = (globeController: GlobeController) => {
    const { viewer, toolDataSource } = globeController;
    if (!viewer) return;

    toolDataSource.entities.removeById("start-point");
    toolDataSource.entities.removeById("axis-polyline");
    eventManager.destroy();
};
