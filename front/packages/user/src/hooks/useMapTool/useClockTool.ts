import {paddedDate, paddedTime} from "@/components/dateUtils.ts";
import * as Cesium from "cesium";
import {useGlobeController} from "@/components/providers/GlobeControllerProvider.tsx";
import {useRecoilState} from "recoil";
import {OptionsState} from "@/recoils/Tool.ts";
import {useRef} from "react";

export const useClockTool = () => {
    const { globeController, initialized } = useGlobeController();
    const [options, setOptions] = useRecoilState(OptionsState);
    const clockInterval = useRef<number | undefined>(undefined);

    const initDate = () => {
        const { viewer } = globeController;
        if (!viewer) return;

        const dateObject = new Date();
        setOptions((prevOptions) => ({
            ...prevOptions,
            date: paddedDate(dateObject),
            time: paddedTime(dateObject),
            dateObject: dateObject,
        }));

        const today = dateObject;
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const start = Cesium.JulianDate.fromIso8601(today.toISOString());
        const stop = Cesium.JulianDate.fromIso8601(tomorrow.toISOString());
        const clock = viewer.clock;
        clock.startTime = start;
        clock.stopTime = stop;
        clock.currentTime = start;
        clock.clockRange = Cesium.ClockRange.UNBOUNDED;
        clock.multiplier = options.speed;
        clock.shouldAnimate = false;
    };

    const onChangeDate = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value, name } = event.target;
        setOptions((prevOptions) => ({
            ...prevOptions,
            [name]: value,
        }));

        const { viewer } = globeController;
        if (!viewer) return;
        const clock = viewer.clock;
        const date = options.date.split('-');
        const time = options.time.split(':');
        const dateObject = new Date(
            parseInt(date[0]),
            parseInt(date[1]) - 1,
            parseInt(date[2]),
            parseInt(time[0]),
            parseInt(time[1]),
            parseInt(time[2])
        );
        clock.currentTime = Cesium.JulianDate.fromDate(dateObject);
    };

    const onChangeSpeed = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setOptions((prevOptions) => ({
            ...prevOptions,
            speed: parseInt(value),
        }));

        const { viewer } = globeController;
        if (!viewer) return;

        const clock = viewer.clock;
        clock.multiplier = options.speed;
    };

    const slowAnimation = () => {
        const { viewer } = globeController;
        if (!viewer) return;
        if (options.speed <= 1) {
            return;
        } else {
            const multiplier = Math.round(viewer.clock.multiplier / 2);
            viewer.clock.multiplier = multiplier;
            setOptions((prevOptions) => ({
                ...prevOptions,
                speed: multiplier,
            }));
        }
    };

    const fastAnimation = () => {
        const { viewer } = globeController;
        if (!viewer) return;
        if (options.speed >= 4096) {
            return;
        } else {
            const multiplier = Math.round(viewer.clock.multiplier * 2);
            viewer.clock.multiplier = multiplier;
            setOptions((prevOptions) => ({
                ...prevOptions,
                speed: multiplier,
            }));
        }
    };

    const toggleAnimation = () => {
        const { viewer } = globeController;
        if (!viewer) return;
        if (options.isAnimation) {
            viewer.clock.shouldAnimate = false;
            clearInterval(clockInterval.current);
            setOptions((prevOptions) => ({
                ...prevOptions,
                isAnimation: false,
                playText: '▶',
            }));
        } else {
            viewer.clock.shouldAnimate = true;
            clockInterval.current = window.setInterval(() => {
                const date = Cesium.JulianDate.toDate(viewer.clock.currentTime);
                setOptions((prevOptions) => ({
                    ...prevOptions,
                    dateObject: date,
                    date: paddedDate(date),
                    time: paddedTime(date),
                }));
            }, 1000);
            setOptions((prevOptions) => ({
                ...prevOptions,
                isAnimation: true,
                playText: '■',
            }));
        }
    };


    return {
        initDate,
        onChangeDate,
        onChangeSpeed,
        slowAnimation,
        fastAnimation,
        toggleAnimation
    };
};