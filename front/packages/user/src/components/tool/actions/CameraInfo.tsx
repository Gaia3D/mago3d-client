import { GlobeController } from "@/api/GlobeController.ts";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import * as Cesium from "cesium";
import {getLengthUnitFactor} from "@/components/utils/unit.ts";
import {useRecoilValue} from "recoil";
import {DistanceUnitState, DistanceUnitType} from "@/recoils/Unit.ts";

interface CameraInfoProps {
    globeController: GlobeController;
}

const DIRECTIONS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

const getCardinalDirection = (angle: number) => {
    return DIRECTIONS[Math.round(angle / 45) % 8];
};

const CameraInfo = ({ globeController }: CameraInfoProps) => {
    const { t } = useTranslation();
    const unit = useRecoilValue<DistanceUnitType>(DistanceUnitState);
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
        <div className="pop-layer-pointer-location">
            <div className="pop-layer-content">
                <div className="value-container">
                    <span className="title">{t("latitude")}</span>
                    <span className="value">{latitude.toFixed(6)}</span>
                </div>
                <div className="value-container">
                    <span className="title">{t("longitude")}</span>
                    <span className="value">{longitude.toFixed(6)}</span>
                </div>
                <div className="value-container">
                    <span className="title">{t("altitude")}</span>
                    <span className="value">{altitude.toFixed(2)} {unit}</span>
                </div>
                <div className="value-container">
                    <span className="title">{t("heading")}</span>
                    <span className="value">{direction} ({heading.toFixed(2)}°)</span>
                </div>
            </div>
        </div>
    );
};

export default CameraInfo;
