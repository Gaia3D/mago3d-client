import { useRecoilState } from "recoil";
import { OptionsState } from "@/recoils/Tool.ts";
import { useEffect } from "react";
import { useGlobeController } from "@/components/providers/GlobeControllerProvider.tsx";
import { offCameraInformation, onCameraInformation } from "@/api/camera/magoCameraInformation.ts";
import {useTranslation} from "react-i18next";

export const CameraInfoDisplay = () => {
    const {t} = useTranslation();
    const { globeController, initialized } = useGlobeController();
    const [options, setOptions] = useRecoilState(OptionsState);

    const DIRECTIONS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

    const getCardinalDirection = (angle: number) => {
        return DIRECTIONS[Math.round(angle / 45) % 8];
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

            if (
                newInfo.longitude !== currentInfo.longitude ||
                newInfo.latitude !== currentInfo.latitude ||
                newInfo.height !== currentInfo.height ||
                newInfo.heading !== currentInfo.heading
            ) {
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

    return options.viewOptions.isOpenCameraInfo && (
        <div className="pop-layer-pointer-location">
            <div className="pop-layer-content">
                <div className="value-container">
                    <span className="title">{t("latitude")}</span>
                    <span className="value">{options.viewOptions.latitude}m</span>
                </div>
                <div className="value-container">
                    <span className="title">{t("longitude")}</span>
                    <span className="value">{options.viewOptions.longitude}m</span>
                </div>
                <div className="value-container">
                    <span className="title">{t("altitude")}</span>
                    <span className="value"> {options.viewOptions.height}m</span>
                </div>
                <div className="value-container">
                    <span className="title">{t("heading")}</span>
                    <span className="value">{options.viewOptions.compass} ({options.viewOptions.heading}°)</span>
                </div>
            </div>
        </div>
)
    ;
};
