import * as Cesium from "cesium";
import {useGlobeController} from "@/components/providers/GlobeControllerProvider.tsx";
import {useCallback, useState} from "react";
import {useObjectSelector} from "@/api/object/useObjectSelector.ts";
import {useObjectTranslation} from "@/api/object/useObjectTranslation.ts";
import {offObjectRotation, onObjectRotation} from "@/api/object/useObjectRotation.ts";
import {offFirstPersonView, onFirstPersonView} from "@/api/camera/magoFirstPersonView.ts";
import {offObjectScaling, onObjectScaling} from "@/api/object/useObjectScaling.ts";

export const useObjectTool = () => {
    const { globeController } = useGlobeController();
    const {onObjectSelector, offObjectSelector} = useObjectSelector();
    const {onObjectTranslation, offObjectTranslation} = useObjectTranslation();

    const [ localOptions, setLocalOptions ] = useState({
        onSelector: false,
        isTranslation: false,
        isRotation: false,
        isScaling: false,
        isCopyObject: false,
        isRemoveObject: false,
        isAddFloor: false,
        isRemoveFloor: false,
        isColoring: false,
        isBoundingVolume: false,
    });

    type ToolName = keyof typeof localOptions;

    const toggleObjectTool = useCallback((toolName: ToolName, onAction: () => void, offAction: () => void) => {
        const { viewer } = globeController;
        if (!viewer) return;

        setLocalOptions((prevState) => {
            const newState = { ...prevState, [toolName]: !prevState[toolName] };
            if (newState[toolName]) {
                onAction();
            } else {
                offAction();
            }
            return newState;
        });
    }, [globeController]);

    const toggleSelector = () => toggleObjectTool('onSelector', () => {
        if (globeController.viewer) onObjectSelector(globeController.viewer);
    }, () => {
        if (globeController.viewer) offObjectSelector(globeController.viewer);
    });

    const toggleTranslation = () => toggleObjectTool('isTranslation', () => {
        if (globeController.viewer) onObjectTranslation(globeController.viewer);
    }, () => {offObjectTranslation();});

    const toggleRotation = () => toggleObjectTool('isRotation', () => {
        if (globeController.viewer) onObjectRotation(globeController.viewer);
    }, () => {
        if (globeController.viewer) offObjectRotation(globeController.viewer);
    });

    const toggleScaling = () => toggleObjectTool('isScaling', () => {
        if (globeController.viewer) onObjectScaling(globeController.viewer);
    }, () => {offObjectScaling();});

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