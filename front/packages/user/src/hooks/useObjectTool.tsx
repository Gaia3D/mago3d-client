import {useGlobeController} from "@/components/providers/GlobeControllerProvider.tsx";
import {useCallback, useState} from "react";
import {useObjectSelector} from "@/api/object/useObjectSelector.ts";
import {useObjectTranslation} from "@/api/object/useObjectTranslation.ts";
import {offObjectRotation, onObjectRotation} from "@/api/object/useObjectRotation.ts";
import {offObjectScaling, onObjectScaling} from "@/api/object/useObjectScaling.ts";
import {useRecoilState} from "recoil";
import {OptionsState} from "@/recoils/Tool.ts";

export const useObjectTool = () => {
    const { globeController } = useGlobeController();
    const {onObjectSelector, offObjectSelector, onRemoveObject, addBuildingFloor, removeBuildingFloor, onObjectColoring, onObjectCopy} = useObjectSelector();
    const {onObjectTranslation, offObjectTranslation} = useObjectTranslation();

    const [options, setOptions] = useRecoilState(OptionsState);

    const [ localOptions, setLocalOptions ] = useState({
        onSelector: false,
        isTranslation: false,
        isRotation: false,
        isScaling: false,
        isCopyObject: false,
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

    const copyObject = () => {
        const { viewer } = globeController;
        if (!viewer) return;
        onObjectCopy(viewer);
    }

    const removeObject = () => {
        const { viewer } = globeController;
        if (!viewer) return;
        onRemoveObject(viewer);
    }

    const objectAddFloor = () => {
        const { viewer } = globeController;
        if (!viewer) return;
        addBuildingFloor(viewer);
    }

    const objectRemoveFloor = () => {
        const { viewer } = globeController;
        if (!viewer) return;
        removeBuildingFloor(viewer);
    }

    const toggleColoring = () => {
        setOptions((prevOptions) => ({
            ...prevOptions,
            isColoring: !prevOptions.isColoring
        }));
    }

    const objectColoring = (event: any) => {
        const { viewer } = globeController;
        if (!viewer) return;
        onObjectColoring(viewer, event.target.value);
    }

    return {toggleSelector, toggleTranslation, toggleRotation, toggleScaling, copyObject, removeObject, objectAddFloor, objectRemoveFloor, toggleColoring, objectColoring}
}