import { useCallback, useEffect, useRef } from 'react';
import * as Cesium from 'cesium';

export const useModelCreator = (viewer: Cesium.Viewer | undefined) => {
    const screenSpaceEventHandler = useRef<Cesium.ScreenSpaceEventHandler | undefined>(undefined);
    const pickedObject = useRef<any | undefined>(undefined);

    const handleMouseLeftClick = useCallback(
        (event: Cesium.ScreenSpaceEventHandler.PositionedEvent, glbUrl: string) => {
            if (!viewer) return;
            const scene = viewer.scene;
            pickedObject.current = scene.pick(event.position);

            let cartographic;
            let height;
            let pickedPosition;
            if (scene.pickPositionSupported) {
                if (pickedObject.current?.primitive instanceof Cesium.PointPrimitive) {
                    pickedPosition = pickedObject.current.primitive.position;
                } else {
                    pickedPosition = viewer.scene.pickPosition(event.position);
                }
                if (pickedPosition) {
                    cartographic = Cesium.Cartographic.fromCartesian(pickedPosition);
                    height = cartographic.height;
                }
            }
            if (!pickedPosition) {
                pickedPosition = viewer.camera.pickEllipsoid(
                    event.position,
                    scene.globe.ellipsoid
                );
                if (!pickedPosition) return;
                cartographic = Cesium.Cartographic.fromCartesian(pickedPosition);
                height = viewer.scene.globe.getHeight(Cesium.Cartographic.fromRadians(cartographic.longitude, cartographic.latitude, 0));
                pickedPosition = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, height);
            }

            if (!pickedPosition || !cartographic) {
                return;
            }
            createModel(glbUrl, pickedPosition);
        },
        [viewer] // 종속성 배열에 viewer 추가
    );

    const onCreateProp = useCallback(
        (glbUrl: string) => {
            if (!viewer) return;
            const scene = viewer.scene;

            if (!screenSpaceEventHandler.current) {
                screenSpaceEventHandler.current = new Cesium.ScreenSpaceEventHandler(scene.canvas);
            }

            screenSpaceEventHandler.current.setInputAction(
                (event: Cesium.ScreenSpaceEventHandler.PositionedEvent) => handleMouseLeftClick(event, glbUrl),
                Cesium.ScreenSpaceEventType.LEFT_CLICK
            );

            screenSpaceEventHandler.current.setInputAction(
                () => offCreateProp(),
                Cesium.ScreenSpaceEventType.RIGHT_CLICK
            );
        },
        [handleMouseLeftClick, viewer] // 종속성 배열에 handleMouseLeftClick과 viewer 추가
    );

    const createModel = async (glbUrl: string, position: Cesium.Cartesian3, scale = 10) => {
        if (!viewer || !Cesium.defined(position)) return;
        const name = glbUrl.split("/").pop();
        const hpr = new Cesium.HeadingPitchRoll(0.0, 0.0, 0.0);

        const model = await Cesium.Model.fromGltfAsync({
            url: glbUrl,
            modelMatrix: Cesium.Matrix4.IDENTITY,
            scale: scale,
            id: name,
            colorBlendMode: Cesium.ColorBlendMode.REPLACE,
        });

        // 모델이 준비되었을 때 이벤트를 처리하는 리스너 추가
        model.readyEvent.addEventListener(() => {
            // 모델의 바운딩 박스 계산
            const boundingSphere = model.boundingSphere;
            const modelHeight = boundingSphere.center.y - boundingSphere.radius;

            // 바닥 좌표를 맞추기 위한 모델 매트릭스 변환
            const translation = new Cesium.Cartesian3(0.0, 0.0, -modelHeight / 2);
            const modelMatrix = Cesium.Transforms.headingPitchRollToFixedFrame(
                position,
                hpr
            );
            Cesium.Matrix4.multiplyByTranslation(modelMatrix, translation, modelMatrix);

            model.modelMatrix = modelMatrix;
        });

        viewer.scene.primitives.add(model);
    };

    const offCreateProp = useCallback(() => {
        if (screenSpaceEventHandler.current) {
            screenSpaceEventHandler.current.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
            screenSpaceEventHandler.current.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK);
            screenSpaceEventHandler.current.destroy();
            screenSpaceEventHandler.current = undefined;
        }
    }, []);

    // Clean up when the component unmounts
    useEffect(() => {
        return () => {
            offCreateProp();
        };
    }, [offCreateProp]);

    return { onCreateProp, offCreateProp };
};
