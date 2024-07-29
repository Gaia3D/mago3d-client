import * as Cesium from "cesium";
import {useGlobeController} from "@/components/providers/GlobeControllerProvider.tsx";
import {useState} from "react";
import {useObjectSelector} from "@/api/object/useObjectSelector.ts";

export const useObjectTool = () => {
    const { globeController } = useGlobeController();
    const {onObjectSelector, offObjectSelector} = useObjectSelector();
    let onSelector = false;

    const toggleSelector = () => {
        const { viewer } = globeController;
        if (!viewer) return;
        if (!onSelector) {
            console.log("on")
            onObjectSelector(viewer);
        } else {
            console.log("off")
            offObjectSelector(viewer);
        }
        onSelector = !onSelector;
    }

    const toggleTranslation = () => {
        console.log("이동");
    }

    const toggleRotation = () => {
        console.log("회전");
    }

    const toggleScaling = () => {
        console.log("크기 변경");
    }

    const toggleCopyObject = () => {
        console.log("건물 복사");
    }
    
    const toggleRemoveObject = () => {
        console.log("건물 삭제");
    }

    const toggleAddFloor = () => {
        console.log("층 +");
    }

    const toggleRemoveFloor = () => {
        console.log("층 -");
    }

    const toggleColoring = () => {
        console.log("색상 변경");
    }

    const toggleBoundingVolume = () => {
        console.log("경계 표출");
    }

    return {toggleSelector, toggleTranslation, toggleRotation, toggleScaling, toggleCopyObject, toggleRemoveObject, toggleAddFloor, toggleRemoveFloor, toggleColoring, toggleBoundingVolume}
}