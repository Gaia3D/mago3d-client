import React, { useEffect, useRef } from 'react';
import * as Cesium from 'cesium';
import { useRecoilState } from "recoil";
import { OptionsState } from "@/recoils/Tool.ts";
import { useGlobeController } from "@/components/providers/GlobeControllerProvider.tsx";
import { useObjectTool } from "@/hooks/useObjectTool.tsx";

export const ObjectToolbox = () => {
    const [options] = useRecoilState(OptionsState);
    const SIDE_MENU_WIDTH = 350;

    const divRef = useRef<HTMLDivElement>(null);
    const { globeController } = useGlobeController();
    const { viewer } = globeController;

    const { toggleTranslation, toggleRotation, toggleScaling, toggleCopyObject, removeObject, objectAddFloor, objectRemoveFloor, toggleColoring, objectColoring } = useObjectTool();

    useEffect(() => {
        const labelDiv = divRef.current;
        if (!labelDiv || !viewer) return;

        // 위치 업데이트 함수
        function updateDivPosition() {
            if (!options.pickedObject || !options.pickedObject.position) return;

            const canvasPosition = viewer?.scene.cartesianToCanvasCoordinates(options.pickedObject.position);
            if (Cesium.defined(canvasPosition) && labelDiv) {
                labelDiv.style.left = `${canvasPosition.x + SIDE_MENU_WIDTH}px`;
                labelDiv.style.top = `${canvasPosition.y}px`;
            }
        }

        // 위치 업데이트 및 화면 리사이즈 시에도 위치 갱신
        viewer.scene.postRender.addEventListener(updateDivPosition);
        window.addEventListener('resize', updateDivPosition);

        // Cleanup function
        return () => {
            viewer.scene.postRender.removeEventListener(updateDivPosition);
            window.removeEventListener('resize', updateDivPosition);
        };
    }, [viewer, options.pickedObject?.position]);

    return options.isOpenObjectTool && (
        <div ref={divRef} id="object-toolbox">
            <button onClick={toggleTranslation}>이동</button>
            <button onClick={toggleRotation}>회전</button>
            <button onClick={toggleScaling}>크기</button>
            <button onClick={toggleCopyObject}>복사</button>
            <button onClick={removeObject}>삭제</button>
            <button onClick={objectAddFloor}>층+</button>
            <button onClick={objectRemoveFloor}>층-</button>
            <button onClick={toggleColoring}>색상</button>
            {options.isColoring && (
                <input type="color" onChange={objectColoring}/>
            )}
        </div>
    );
};
