import {useRecoilState} from "recoil";
import {OptionsState} from "@/recoils/Tool.ts";
import {useSettingTool} from "@/hooks/useMapTool/useSettingTool.ts";
import {useTranslation} from "react-i18next";

export const SettingTool = () => {
    const {t} = useTranslation();
    const [options, setOptions ] = useRecoilState(OptionsState);
    const { toggleShadow, toggleSSAO, toggleEdge, toggleLighting, toggleFxaa, setShadowQuality, setResolution } = useSettingTool()

    const closeSettingTool= () => {
        setOptions((prevOptions) => ({
            ...prevOptions,
            isSetting: false,
        }))
    }

    return options.isSetting && (
        <>
            <div className="pop-layer-graphic-setting">
                <div className="pop-layer-header">
                    <h3 className="title">{t("graphic-setting")}</h3>
                    <button onClick={closeSettingTool} type="button" className="close-button"></button>
                </div>
                <div className="pop-layer-content">
                    <div className="setting-container">
                        <h4>{t("setting.resolution")}</h4>
                        <span className="stxt">{t("setting.description.resolution")}</span>
                        {['very-high', 'high', 'mid', 'low', 'very-low'].map((level) => (
                            <label key={level}>
                                <input
                                    type="radio"
                                    checked={options.renderOptions.renderQuality === level}
                                    onChange={() => setResolution(level)}
                                    value={level}
                                />
                                {t(level)}
                            </label>
                        ))}
                    </div>
                    {/* Shadow */}
                    <div className="setting-container">
                        <h4>{t("setting.shadow")}</h4>
                        <span className="stxt">{t("setting.description.shadow")}</span>
                        <label>
                            {t("on")}
                            <input
                                type="radio"
                                checked={options.renderOptions.isShadow === true}
                                onChange={() => toggleShadow(true)}
                                value="true"
                            />
                        </label>
                        <label>
                            {t("off")}
                            <input
                                type="radio"
                                checked={options.renderOptions.isShadow === false}
                                onChange={() => toggleShadow(false)}
                                value="false"
                            />
                        </label>
                    </div>
                    {/* Shadow Quality */}
                    <div className="setting-container">
                        <h4>{t("setting.shadow-quality")}</h4>
                        <span className="stxt">{t("setting.description.shadow-quality")}</span>
                        {['very-high', 'high', 'mid', 'low', 'very-low'].map((level) => (
                            <label key={level}>
                                {t(level)}
                                <input
                                    type="radio"
                                    checked={options.renderOptions.shadowQuality === level}
                                    onChange={() => setShadowQuality(level)}
                                    value={level}
                                />
                            </label>
                        ))}
                    </div>
                    {/* Global Lighting */}
                    <div className="setting-container">
                        <h4>{t("setting.global-lighting")}</h4>
                        <span className="stxt">{t("setting.description.global-lighting")}</span>
                        <label>
                            {t("on")}
                            <input
                                type="radio"
                                checked={options.renderOptions.isLighting}
                                onChange={() => toggleLighting(true)}
                                value="true"
                            />
                        </label>
                        <label>
                            {t("off")}
                            <input
                                type="radio"
                                checked={!options.renderOptions.isLighting}
                                onChange={() => toggleLighting(false)}
                                value="false"
                            />
                        </label>
                    </div>
                    {/* Anti-Aliasing (FXAA) */}
                    <div className="setting-container">
                        <h4>{t("setting.fxaa")}</h4>
                        <span className="stxt">{t("setting.description.fxaa")}</span>
                        <label>
                            {t("on")}
                            <input
                                type="radio"
                                checked={options.renderOptions.isFxaa}
                                onChange={() => toggleFxaa(true)}
                                value="true"
                            />
                        </label>
                        <label>
                            {t("off")}
                            <input
                                type="radio"
                                checked={!options.renderOptions.isFxaa}
                                onChange={() => toggleFxaa(false)}
                                value="false"
                            />
                        </label>
                    </div>
                    {/* Edge */}
                    <div className="setting-container">
                        <h4>{t("setting.edge")}</h4>
                        <span className="stxt">{t("setting.description.edge")}</span>
                        <label>
                            {t("on")}
                            <input
                                type="radio"
                                checked={options.renderOptions.isEdge}
                                onChange={() => toggleEdge(true)}
                                value="true"
                            />
                        </label>
                        <label>
                            {t("off")}
                            <input
                                type="radio"
                                checked={!options.renderOptions.isEdge}
                                onChange={() => toggleEdge(false)}
                                value="false"
                            />
                        </label>
                    </div>
                    {/* Screen Space Ambient Occlusion */}
                    <div className="setting-container">
                        <h4>{t("setting.ambient")}</h4>
                        <span className="stxt">{t("setting.description.ambient")}</span>
                        <label>
                            {t("on")}
                            <input
                                type="radio"
                                checked={options.renderOptions.isSSAO}
                                onChange={() => toggleSSAO(true)}
                                value="true"
                            />
                        </label>
                        <label>
                            {t("off")}
                            <input
                                type="radio"
                                checked={!options.renderOptions.isSSAO}
                                onChange={() => toggleSSAO(false)}
                                value="false"
                            />
                        </label>
                    </div>
                </div>
            </div>
        </>
    )
};