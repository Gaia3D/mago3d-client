import { Options, OptionsState } from "@/recoils/Tool.ts";
import { useRecoilState } from "recoil";
import { useGlobeController } from "@/components/providers/GlobeControllerProvider.tsx";
import { useSettingTool } from "@/hooks/useMapTool/useSettingTool.ts";

export const useWebStorage = () => {
    const { globeController } = useGlobeController();
    const [options, setOptions] = useRecoilState(OptionsState);
    const { toggleShadow, toggleSSAO, toggleEdge, toggleLighting, toggleFxaa, setShadowQuality, setResolution } = useSettingTool();

    const initWebStorage = () => {
        const renderOptionsString = localStorage.getItem('renderOptions');
        if (renderOptionsString === null) {
            localStorage.setItem('renderOptions', JSON.stringify(options.renderOptions));
        } else {
            try {
                const storedOptions = JSON.parse(renderOptionsString);
                setOptions((prevOptions) => ({
                    ...prevOptions,
                    renderOptions: storedOptions,
                }));

                const interval = setInterval(() => {
                    const { viewer } = globeController;
                    if (viewer !== undefined) {
                        clearInterval(interval);
                        applyStoredOptions(storedOptions);
                    }
                }, 1000);
            } catch (error) {
                console.error('Error parsing renderOptions from localStorage:', error);
                localStorage.removeItem('renderOptions');
            }
        }
    };

    const applyStoredOptions = (storedOptions: any) => {
        toggleShadow(storedOptions.isShadow);
        toggleSSAO(storedOptions.isSSAO);
        toggleEdge(storedOptions.isEdge);
        toggleLighting(storedOptions.isLighting);
        toggleFxaa(storedOptions.isFxaa);
        setShadowQuality(storedOptions.shadowQuality);
        setResolution(storedOptions.renderQuality);
    };

    const saveWebStorage = (updatedOptions: Options) => {
        localStorage.setItem('renderOptions', JSON.stringify(updatedOptions.renderOptions));
    };

    const resetWebStorage = () => {
        localStorage.setItem('renderOptions', JSON.stringify(options.defaultRenderOptions));
        initWebStorage();
    };

    return { initWebStorage, saveWebStorage, resetWebStorage };
};
