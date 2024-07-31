import {useGlobeController} from "@/components/providers/GlobeControllerProvider.tsx";
import {useCallback, useEffect, useRef, useState} from "react";
import {useObjectSelector} from "@/api/object/useObjectSelector.ts";
import {useRecoilState} from "recoil";
import {OptionsState} from "@/recoils/Tool.ts";
import ObjectTranslationHandler from "@/api/object/useObjectTranslation.ts";
import ObjectRotationHandler from "@/api/object/useObjectRotation.ts";
import ObjectScalingHandler from "@/api/object/useObjectScaling.ts";

export const useObjectTool = () => {
    const { globeController } = useGlobeController();
    const {onObjectSelector, offObjectSelector, onRemoveObject, addBuildingFloor, removeBuildingFloor, onObjectColoring, onObjectCopy} = useObjectSelector();

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

    const transitionHandlerRef = useRef<ObjectTranslationHandler | null>(null);
    const rotationHandlerRef = useRef<ObjectRotationHandler | null>(null);
    const scalingHandlerRef = useRef<ObjectScalingHandler | null>(null);

    useEffect(() => {
        if (globeController.viewer && !transitionHandlerRef.current) {
            transitionHandlerRef.current = new ObjectTranslationHandler(globeController.viewer, setOptions);
        }
        if (globeController.viewer && !rotationHandlerRef.current) {
            rotationHandlerRef.current = new ObjectRotationHandler(globeController.viewer);
        }
        if (globeController.viewer && !scalingHandlerRef.current) {
            scalingHandlerRef.current = new ObjectScalingHandler(globeController.viewer);
        }
    }, [globeController.viewer]);

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
        transitionHandlerRef.current?.enable();
    }, () => {
        transitionHandlerRef.current?.disable();
    });

    const toggleRotation = () => toggleObjectTool('isRotation', () => {
        rotationHandlerRef.current?.enable();
    }, () => {
        rotationHandlerRef.current?.disable();
    });

    const toggleScaling = () => toggleObjectTool('isScaling', () => {
        scalingHandlerRef.current?.enable();
    }, () => {
        scalingHandlerRef.current?.disable();
    });

    const copyObject = useCallback(() => {
        const { viewer } = globeController;
        if (!viewer) return;
        onObjectCopy(viewer);
    }, [globeController, onObjectCopy]);

    const removeObject = useCallback(() => {
        const { viewer } = globeController;
        if (!viewer) return;
        onRemoveObject(viewer);
    }, [globeController, onRemoveObject]);

    const objectAddFloor = useCallback(() => {
        const { viewer } = globeController;
        if (!viewer) return;
        addBuildingFloor(viewer);
    }, [globeController, addBuildingFloor]);

    const objectRemoveFloor = useCallback(() => {
        const { viewer } = globeController;
        if (!viewer) return;
        removeBuildingFloor(viewer);
    }, [globeController, removeBuildingFloor]);

    const toggleColoring = useCallback(() => {
        setOptions((prevOptions) => ({
            ...prevOptions,
            isColoring: !prevOptions.isColoring
        }));
    }, [setOptions]);

    const objectColoring = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const { viewer } = globeController;
        if (!viewer) return;
        onObjectColoring(viewer, event.target.value);
    }, [globeController, onObjectColoring]);

    return {toggleSelector, toggleTranslation, toggleRotation, toggleScaling, copyObject, removeObject, objectAddFloor, objectRemoveFloor, toggleColoring, objectColoring}
}