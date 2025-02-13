import React, {useEffect, useState} from 'react';
import {useGlobeController} from "@/components/providers/GlobeControllerProvider.tsx";

const ResetDirection = () => {
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
        <div className="reset-direction">
            <div
                className="reset-direction-tick"
                style={{transform: `rotate(${-heading}rad)`}}
                // onClick={handleClick}
            />
        </div>
    );
};

export default ResetDirection;