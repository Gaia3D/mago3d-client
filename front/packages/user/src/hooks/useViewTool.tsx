import {useEffect, useState} from "react";
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
    const { globeController, initialized } = useGlobeController();
    const [options, setOptions] = useRecoilState(OptionsState);
    const [localOptions, setLocalOptions] = useState({
        isFirstPersonView: false,
        isSelectHighlight: false,
        isViewCenter: false,
        isViewPoint: false,
        isViewAxis: false,
        isCameraTool: false,
    });
    const [cameraToolInfo, setCameraToolInfo] = useState({
        longitude: 0,
        latitude: 0,
        height: 0,
        heading: 360,
        compass: 'N',
    });

    const toggleFirstPersonView = () => {
        const { viewer } = globeController;
        if (!viewer) return;
        if (!localOptions.isFirstPersonView) {
            // emit('clearAllEvents', ControlMode.ViewFirstPerson);
            onFirstPersonView(viewer);
        } else {
            offFirstPersonView(viewer);
        }
        localOptions.isFirstPersonView = !localOptions.isFirstPersonView;
    };

    const toggleViewCenter = () => {
        const { viewer } = globeController;
        if (!viewer) return;
        if (!localOptions.isViewCenter) {
            // emit('clearAllEvents', ControlMode.ViewCenter);
            onViewCenter(viewer);
        } else {
            offViewCenter(viewer);
        }
        localOptions.isViewCenter = !localOptions.isViewCenter;
    }

    const toggleViewPoint = () => {
        const { viewer } = globeController;
        if (!viewer) return;
        if (!localOptions.isViewPoint) {
            // emit('clearAllEvents', ControlMode.ViewPoint);
            onViewPoint(viewer);
        } else {
            offViewPoint();
        }
        localOptions.isViewPoint = !localOptions.isViewPoint;
    }

    const toggleViewAxis = () => {
        const { viewer } = globeController;
        if (!viewer) return;
        if (!localOptions.isViewAxis) {
            // emit('clearAllEvents', ControlMode.ViewAxis);
            onViewAxis(viewer);
        } else {
            offViewAxis(viewer);
        }
        localOptions.isViewAxis = !localOptions.isViewAxis;
    }

    useEffect(() => {
        console.log(cameraToolInfo)
    }, [cameraToolInfo]);

    const toggleCameraTool = () => {
        console.log("toggle")
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
