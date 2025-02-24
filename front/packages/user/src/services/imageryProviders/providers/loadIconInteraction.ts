import * as Cesium from "cesium";

export function setupMouseHoverHandler(viewer: Cesium.Viewer) {
    const handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
    let previousPicked: Cesium.Billboard | Cesium.PointPrimitive | undefined;

    handler.setInputAction((movement: Cesium.ScreenSpaceEventHandler.MotionEvent) => {
        const picked = viewer.scene.pick(movement.endPosition);

        if (previousPicked) {
            if (previousPicked instanceof Cesium.Billboard) {
                previousPicked.image = previousPicked.id.originalImage;
                previousPicked.id.label.show = false;
            } else if (previousPicked instanceof Cesium.PointPrimitive) {
                previousPicked.outlineColor = Cesium.Color.WHITE;
                previousPicked.id.label.show = false;
            }
            previousPicked = undefined;
            viewer.scene.requestRender();
        }

        if (Cesium.defined(picked)) {
            const primitive = picked.primitive;
            if (primitive instanceof Cesium.Billboard) {
                primitive.image = primitive.id.selectedImage;
                primitive.id.label.show = true;
                previousPicked = primitive;
            } else if (primitive instanceof Cesium.PointPrimitive) {
                primitive.outlineColor = Cesium.Color.RED;
                primitive.id.label.show = true;
                previousPicked = primitive;
            }
            viewer.scene.requestRender();
        }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    return handler;
}
