import { useRecoilState } from "recoil";
import { OptionsState } from "@/recoils/Tool.ts";
import { useEffect } from "react";
import { useGlobeController } from "@/components/providers/GlobeControllerProvider.tsx";
import { offCameraInformation, onCameraInformation } from "@/api/camera/magoCameraInformation.ts";

export const CameraInfoDisplay = () => {
    const { globeController, initialized } = useGlobeController();
    const [options, setOptions] = useRecoilState(OptionsState);

    const getCardinalDirection = (angle: number) => {
        const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
        return directions[Math.round(angle / 45) % 8];
    };

    useEffect(() => {
        const { viewer } = globeController;
        if (!viewer) return;

        let currentInfo = {
            longitude: 0,
            latitude: 0,
            height: 0,
            heading: 0,
            compass: '',
        };

        const updateCameraInfo = (longitude: number, latitude: number, height: number, heading: number) => {
            const newInfo = {
                longitude: parseFloat(longitude.toFixed(6)),
                latitude: parseFloat(latitude.toFixed(6)),
                height: parseFloat(height.toFixed(2)),
                heading: parseFloat(heading.toFixed(2)),
                compass: getCardinalDirection(heading),
            };

            if (JSON.stringify(newInfo) !== JSON.stringify(currentInfo)) {
                currentInfo = newInfo;
                setOptions((prevOptions) => ({
                    ...prevOptions,
                    viewOptions: { ...prevOptions.viewOptions, ...newInfo },
                }));
            }
        };

        if (options.viewOptions.isOpenCameraInfo) {
            onCameraInformation(viewer, updateCameraInfo);
        } else {
            offCameraInformation(viewer);
        }

        return () => {
            offCameraInformation(viewer);
        };
    }, [options.viewOptions.isOpenCameraInfo]);

    return options.viewOptions.isOpenCameraInfo ? (
        <div className="default-layer camera-tool">
            <h3>Camera Information</h3>
            <label>Longitude: {options.viewOptions.longitude}m</label>
            <label>Latitude: {options.viewOptions.latitude}m</label>
            <label>Altitude: {options.viewOptions.height}m</label>
            <label>Heading: <span>{options.viewOptions.compass}</span> ({options.viewOptions.heading}°)</label>
        </div>
    ) : null;
};
