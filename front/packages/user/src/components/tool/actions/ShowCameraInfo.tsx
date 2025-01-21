import { GlobeController } from "@/api/GlobeController.ts";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import * as Cesium from "cesium";
import {getLengthUnitFactor} from "@/components/utils/unit.ts";

interface ShowCameraInfoProps {
    globeController: GlobeController;
    unit: string;
}

const DIRECTIONS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

const getCardinalDirection = (angle: number) => {
    return DIRECTIONS[Math.round(angle / 45) % 8];
};

const ShowCameraInfo = ({ globeController, unit }: ShowCameraInfoProps) => {
    const { t } = useTranslation();
    const { viewer } = globeController;

    const [latitude, setLatitude] = useState(0);
    const [longitude, setLongitude] = useState(0);
    const [altitude, setAltitude] = useState(0);
    const [heading, setHeading] = useState(0);
    const [direction, setDirection] = useState('');

    useEffect(() => {
        if (!viewer) return;

        const updateCameraInfo = () => {
            const { camera } = viewer;
            const cartographic = Cesium.Cartographic.fromCartesian(camera.positionWC);
            const lon = Cesium.Math.toDegrees(cartographic.longitude);
            const lat = Cesium.Math.toDegrees(cartographic.latitude);
            const alt = cartographic.height;
            const head = Cesium.Math.toDegrees(camera.heading);

            setLongitude(lon);
            setLatitude(lat);
            setAltitude(alt / getLengthUnitFactor(unit));
            setHeading(head);
            setDirection(getCardinalDirection(head));
        };

        updateCameraInfo();

        const handler = viewer.scene.postRender.addEventListener(updateCameraInfo);
        return () => handler();
    }, [viewer, unit]);

    return (
        <div>
            <div>
                <span>{t("latitude")}</span>
                <span>{latitude.toFixed(6)}</span>
            </div>
            <div>
                <span>{t("longitude")}</span>
                <span>{longitude.toFixed(6)}</span>
            </div>
            <div>
                <span>{t("altitude")}</span>
                <span>{altitude.toFixed(2)} {unit}</span>
            </div>
            <div>
                <span>{t("heading")}</span>
                <span>{direction} ({heading.toFixed(2)}°)</span>
            </div>
        </div>
    );
};

export default ShowCameraInfo;
