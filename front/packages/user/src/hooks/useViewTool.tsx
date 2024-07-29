import {useCallback, useEffect, useState} from "react";
import { useGlobeController } from "@/components/providers/GlobeControllerProvider.tsx";
import { offFirstPersonView, onFirstPersonView } from "@/api/camera/magoFirstPersonView.ts";
import {offViewCenter, onViewCenter} from "@/api/camera/magoViewCenter.ts";
import {offFloorEvents} from "@/api/object/magoBuildingFloor.ts";
import {offViewPoint, onViewPoint} from "@/api/camera/magoViewPoint.ts";
import {offViewAxis, onViewAxis} from "@/api/camera/magoViewAxis.ts";
import {offCameraInformation, onCameraInformation} from "@/api/camera/magoCameraInformation.ts";
import { OptionsState } from "@/recoils/Tool";
import {useRecoilState} from "recoil";

export const useViewTool = () => {
    const { globeController } = useGlobeController();
    const [options, setOptions] = useRecoilState(OptionsState);
    const [localOptions, setLocalOptions] = useState({
        isFirstPersonView: false,
        isSelectHighlight: false,
        isViewCenter: false,
        isViewPoint: false,
        isViewAxis: false,
        isCameraTool: false,
    });

    type ToolName = keyof typeof localOptions;

    const toggleViewTool = useCallback((toolName: ToolName, onAction: () => void, offAction: () => void) => {
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

    const toggleFirstPersonView = () => toggleViewTool('isFirstPersonView', () => {
        if (globeController.viewer) onFirstPersonView(globeController.viewer);
    }, () => {
        if (globeController.viewer) offFirstPersonView(globeController.viewer);
    });

    const toggleViewCenter = () => toggleViewTool('isViewCenter', () => {
        if (globeController.viewer) onViewCenter(globeController.viewer);
    }, () => {
        if (globeController.viewer) offViewCenter(globeController.viewer);
    });

    const toggleViewPoint = () => toggleViewTool('isViewPoint', () => {
        if (globeController.viewer) onViewPoint(globeController.viewer);
    }, () => { offViewPoint();});

    const toggleViewAxis = () => toggleViewTool('isViewAxis', () => {
        if (globeController.viewer) onViewAxis(globeController.viewer);
    }, () => {
        if (globeController.viewer) offViewAxis(globeController.viewer);
    });
    const toggleCameraTool = () => {
        setOptions((prevOptions) => ({
            ...prevOptions,
            viewOptions: {
                ...prevOptions.viewOptions,
                isOpenCameraInfo: !prevOptions.viewOptions.isOpenCameraInfo,
            }
        }));
    }

    return {
        toggleFirstPersonView,
        toggleViewCenter,
        toggleViewPoint,
        toggleViewAxis,
        toggleCameraTool
    };
};
