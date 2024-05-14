import { useGlobeController } from "@/components/providers/GlobeControllerProvider";
import * as Cesium from "cesium";
import { useEffect } from "react";

export type AnalysisPointEntityProps = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dependency: boolean;
    guideText: string;
    callback: (cartesian3:Cesium.Cartesian3) => void;
}

export const useAnalPointEntity = (props:AnalysisPointEntityProps) => {
    const {dependency,guideText, callback} = props;
    const {initialized, globeController} = useGlobeController();

    const clear = () => {
        const { handler, eventDataSource} = globeController;
        handler?.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        handler?.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
        eventDataSource.entities.removeAll();
    }
    useEffect(() => {
        if (!initialized || !dependency) return;

        const { viewer, handler, eventDataSource} = globeController;
        if (!viewer) return;      
        
        if (!handler) {
            clear();
            return;
        }

        const labelEntity = eventDataSource.entities.add({
            position: Cesium.Cartesian3.fromDegrees(0, 0),
            label: {
                text: guideText,
                showBackground: true,
                font: '16px sans-serif',
                backgroundColor: Cesium.Color.fromCssColorString('#000000').withAlpha(0.7),
                horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
            }
        });
        
        handler.setInputAction((movement: Cesium.ScreenSpaceEventHandler.MotionEvent) => {
            const cartesian = globeController.pickPosition(movement.endPosition);
            if (!cartesian) return;
            labelEntity.position = new Cesium.ConstantPositionProperty(cartesian);
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        handler.setInputAction((clicked: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
            const cartesian = globeController.pickPosition(clicked.position);
            if (!cartesian) return;
            callback(cartesian);
            
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK); 

        return () => {
            clear();
        }
    }, [dependency]);
}