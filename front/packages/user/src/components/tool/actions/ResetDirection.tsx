import React, { useEffect, useRef, useCallback } from 'react';
import { useGlobeController } from "@/components/providers/GlobeControllerProvider.tsx";

const ResetDirection = () => {
    const { globeController, initialized } = useGlobeController();
    const headingRef = useRef(0);
    const tickRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!initialized) return;
        const { viewer } = globeController;
        if (!viewer) return;

        const updateHeading = () => {
            headingRef.current = viewer.camera.heading;
            requestAnimationFrame(() => {
                if (tickRef.current) {
                    tickRef.current.style.transform = `rotate(${-headingRef.current}rad)`;
                }
            });
        };

        viewer.camera.changed.addEventListener(updateHeading);

        return () => {
            viewer.camera.changed.removeEventListener(updateHeading);
        };
    }, [globeController, initialized]);

    const resetDirection = useCallback(() => {
        const { viewer } = globeController;
        if (!viewer) return;

        viewer.camera.flyTo({
            destination: viewer.camera.positionWC,
            duration: 1.0,
            orientation: {
                heading: 0,
                pitch: viewer.camera.pitch,
                roll: viewer.camera.roll,
            },
        });
    }, [globeController]);

    return (
        <div className="reset-direction">
            <div
                ref={tickRef}
                className="reset-direction-tick"
                onClick={resetDirection}
            />
        </div>
    );
};

export default ResetDirection;
