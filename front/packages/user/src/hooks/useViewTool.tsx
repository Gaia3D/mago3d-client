import { useState } from "react";
import { useGlobeController } from "@/components/providers/GlobeControllerProvider.tsx";
import { offFirstPersonView, onFirstPersonView } from "@/api/camera/magoFirstPersonView.ts";

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

    return {
        toggleFirstPersonView,
    };
};
