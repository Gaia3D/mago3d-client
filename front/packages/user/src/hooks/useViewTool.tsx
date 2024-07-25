import { useState } from "react";
import { useGlobeController } from "@/components/providers/GlobeControllerProvider.tsx";
import { offFirstPersonView, onFirstPersonView } from "@/api/camera/magoFirstPersonView.ts";
import {offViewCenter, onViewCenter} from "@/api/camera/magoViewCenter.ts";
import {offFloorEvents} from "@/api/object/magoBuildingFloor.ts";
import {offViewPoint, onViewPoint} from "@/api/camera/magoViewPoint.ts";

export const useViewTool = () => {
    const { globeController, initialized } = useGlobeController();
    const [options, setOptions] = useState({
        isFirstPersonView: false,
        isSelectHighlight: false,
        isViewCenter: false,
        isViewPoint: false,
        isViewAxis: false,
        isCameraTool: false,
    });

    const toggleFirstPersonView = () => {
        const { viewer } = globeController;
        if (!viewer) return;
        if (!options.isFirstPersonView) {
            // emit('clearAllEvents', ControlMode.ViewFirstPerson);
            onFirstPersonView(viewer);
        } else {
            offFirstPersonView(viewer);
        }
        options.isFirstPersonView = !options.isFirstPersonView;
    };

    const toggleViewCenter = () => {
        const { viewer } = globeController;
        if (!viewer) return;
        if (!options.isViewCenter) {
            // emit('clearAllEvents', ControlMode.ViewCenter);
            onViewCenter(viewer);
        } else {
            offViewCenter(viewer);
        }
        options.isViewCenter = !options.isViewCenter;
    }

    const toggleViewPoint = () => {
        const { viewer } = globeController;
        if (!viewer) return;
        if (!options.isViewPoint) {
            // emit('clearAllEvents', ControlMode.ViewPoint);
            onViewPoint(viewer);
        } else {
            offViewPoint();
        }
        options.isViewPoint = !options.isViewPoint;
    }

    return {
        toggleFirstPersonView,
        toggleViewCenter,
        toggleViewPoint,
    };
};
