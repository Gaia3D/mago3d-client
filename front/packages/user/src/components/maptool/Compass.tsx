import React, { useEffect, useState } from 'react';
import { useGlobeController } from "@/components/providers/GlobeControllerProvider.tsx";

interface Props {
    handleClick: () => void;
}

export const Compass: React.FC<Props> = ({ handleClick }) => {
    const { globeController, initialized } = useGlobeController();
    const [heading, setHeading] = useState(0);

    useEffect(() => {
        const { viewer } = globeController;
        if (!viewer) return;

        const updateHeading = () => setHeading(viewer.camera.heading);

        viewer.camera.changed.addEventListener(updateHeading);

        return () => {
            viewer.camera.changed.removeEventListener(updateHeading);
        };
    }, [globeController, initialized]);

    return (
        <div className="compass">
            <div
                className="compass-direction"
                style={{ transform: `rotate(${-heading}rad)` }}
                onClick={handleClick}
            />
        </div>
    );
};
