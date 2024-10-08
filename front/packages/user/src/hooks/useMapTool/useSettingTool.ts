import { useGlobeController } from "@/components/providers/GlobeControllerProvider";
import { useRecoilState } from "recoil";
import { Options, OptionsState } from "@/recoils/Tool";
import { MagoSSAORender, offSSAO, onSSAO } from "@/api/rendering/magoSsaoRender.ts";
import { MagoEdgeRender, offEdge, onEdge } from "@/api/rendering/magoEdgeRender.ts";

export const useSettingTool = () => {
    const { globeController } = useGlobeController();
    const [options, setOptions] = useRecoilState(OptionsState);

    const toggleShadow = (on: boolean) => {
        if (on !== undefined) {
            setOptions((prevOptions) => ({
                ...prevOptions,
                renderOptions: {
                    ...prevOptions.renderOptions,
                    isShadow: !on,
                },
            }));
        }

        const { viewer } = globeController;
        if (!viewer) return;

        if (on) {
            viewer.scene.shadowMap.enabled = true;
            viewer.scene.shadowMap.darkness = 0.5;
        } else {
            viewer.scene.shadowMap.enabled = false;
        }
        setOptions((prevOptions) => {
            const updatedOptions = {
                ...prevOptions,
                renderOptions: {
                    ...prevOptions.renderOptions,
                    isShadow: !prevOptions.renderOptions.isShadow,
                },
            };
            saveWebStorage(updatedOptions);
            return updatedOptions;
        });
    };

    const setShadowQuality = (quality: string) => {
        const { viewer } = globeController;
        if (!viewer) return;

        const shadowMapSizes: { [key: string]: number } = {
            "very-low": 256,
            "low": 512,
            "mid": 1024,
            "high": 2048,
            "very-high": 4096,
        };
        viewer.shadowMap.size = shadowMapSizes[quality] || 1024;

        setOptions((prevOptions) => {
            const updatedOptions = {
                ...prevOptions,
                renderOptions: {
                    ...prevOptions.renderOptions,
                    shadowQuality: quality,
                },
            };
            saveWebStorage(updatedOptions);
            return updatedOptions;
        });
    };

    const setResolution = (quality: string) => {
        const { viewer } = globeController;
        if (!viewer) return;

        const resolutionScales: { [key: string]: number } = {
            "very-low": 0.25,
            "low": 0.5,
            "mid": 0.75,
            "high": 1.0,
            "very-high": 1.5,
        }
        viewer.resolutionScale = resolutionScales[quality] || 1.0;

        setOptions((prevOptions) => {
            const updatedOptions = ({
                ...prevOptions,
                renderOptions: {
                    ...prevOptions.renderOptions,
                    renderQuality: quality,
                },
            });
            saveWebStorage(updatedOptions);
            return updatedOptions;
        });
    };

    const toggleLighting = (on: boolean) => {
        if (on !== undefined) {
            setOptions((prevOptions) => ({
                ...prevOptions,
                renderOptions: {
                    ...prevOptions.renderOptions,
                    isLighting: !on,
                },
            }));
        }

        const { viewer } = globeController;
        if (!viewer) return;

        viewer.scene.globe.enableLighting = !on;
        setOptions((prevOptions) => {
            const updatedOptions = ({
                ...prevOptions,
                renderOptions: {
                    ...prevOptions.renderOptions,
                    isLighting: !prevOptions.renderOptions.isLighting,
                },
            });
            saveWebStorage(updatedOptions);
            return updatedOptions;
        });
    };

    const toggleSSAO = (on: boolean) => {
        if (on !== undefined) {
            setOptions((prevOptions) => ({
                ...prevOptions,
                renderOptions: {
                    ...prevOptions.renderOptions,
                    isSSAO: !on,
                },
            }));
        }
        const { viewer } = globeController;
        if (!viewer) return;

        if (options.magoSsao === undefined) {
            setOptions((prevOptions) => ({
                ...prevOptions,
                magoSsao: MagoSSAORender(viewer),
            }));
        }

        if (on) {
            onSSAO();
        } else {
            offSSAO();
        }
        setOptions((prevOptions) => {
            const updatedOptions = ({
                ...prevOptions,
                renderOptions: {
                    ...prevOptions.renderOptions,
                    isSSAO: !prevOptions.renderOptions.isSSAO,
                },
            });
            saveWebStorage(updatedOptions);
            return updatedOptions;
        });
    };

    const toggleFxaa = (on: boolean) => {
        if (on !== undefined) {
            setOptions((prevOptions) => ({
                ...prevOptions,
                renderOptions: {
                    ...prevOptions.renderOptions,
                    isFxaa: !on,
                },
            }));
        }

        const { viewer } = globeController;
        if (!viewer) return;

        viewer.scene.postProcessStages.fxaa.enabled = on;
        setOptions((prevOptions) => {
            const updatedOptions = ({
                ...prevOptions,
                renderOptions: {
                    ...prevOptions.renderOptions,
                    isFxaa: !prevOptions.renderOptions.isFxaa,
                },
            });
            saveWebStorage(updatedOptions);
            return updatedOptions;
        });
    };

    const toggleEdge = (on: boolean) => {
        if (on !== undefined) {
            setOptions((prevOptions) => ({
                ...prevOptions,
                renderOptions: {
                    ...prevOptions.renderOptions,
                    isEdge: !on,
                },
            }));
        }
        const { viewer } = globeController;
        if (!viewer) return;

        if (options.magoEdge === undefined) {
            setOptions((prevOptions) => ({
                ...prevOptions,
                magoEdge: MagoEdgeRender(viewer),
            }));
        }

        if (on) {
            onEdge();
        } else {
            offEdge();
        }
        setOptions((prevOptions) => {
            const updatedOptions = ({
                ...prevOptions,
                renderOptions: {
                    ...prevOptions.renderOptions,
                    isEdge: !prevOptions.renderOptions.isEdge,
                },
            });
            saveWebStorage(updatedOptions);
            return updatedOptions;
        });
    };
    return { toggleShadow, toggleSSAO, toggleEdge, toggleLighting, toggleFxaa, setShadowQuality, setResolution };
};

// 의존성 순환 문제를 해결하기 위해 바깥에 재선언
const saveWebStorage = (updatedOptions: Options) => {
    localStorage.setItem('renderOptions', JSON.stringify(updatedOptions.renderOptions));
};
