import {useMapTool} from "@/hooks/useMapTool.tsx";

export const SettingTool = () => {
    const { toggleSetting, toggleShadow, setShadowQuality, setResolution, toggleLighting, toggleSSAO, toggleFxaa, toggleEdge, options, setOptions } = useMapTool();

    return options.isSetting && (
        <div className="default-layer option-tool">
            <header>
                <h2>Graphic Setting</h2>
                <button className="close" onClick={toggleSetting}>
                    <span className="minimize"></span>
                </button>
            </header>
            <div className="group">
                {/* Rendering Resolution */}
                <div>
                    <h3>Rendering Resolution</h3>
                    <p>Set the rendering resolution, Higher values have a greater impact on performance.</p>
                    {['very-high', 'high', 'mid', 'low', 'very-low'].map((level) => (
                        <label key={level}>
                            {level.charAt(0).toUpperCase() + level.slice(1)}
                            <input
                                type="radio"
                                checked={options.renderOptions.renderQuality === level}
                                onChange={() => setResolution(level)}
                                value={level}
                            />
                        </label>
                    ))}
                </div>
                {/* Shadow */}
                <div>
                    <h3>Shadow</h3>
                    <p>Enable/disable shadows</p>
                    <label>
                        On
                        <input
                            type="radio"
                            checked={options.renderOptions.isShadow === true}
                            onChange={() => toggleShadow(true)}
                            value="true"
                        />
                    </label>
                    <label>
                        Off
                        <input
                            type="radio"
                            checked={options.renderOptions.isShadow === false}
                            onChange={() => toggleShadow(false)}
                            value="false"
                        />
                    </label>
                </div>
                {/* Shadow Quality */}
                <div>
                    <h3>Shadow Quality</h3>
                    <p>Set the shadow quality.</p>
                    {['very-high', 'high', 'mid', 'low', 'very-low'].map((level) => (
                        <label key={level}>
                            {level.charAt(0).toUpperCase() + level.slice(1)}
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
                <div>
                    <h3>Global Lighting</h3>
                    <p>Visualise global illumination. Affected by time of day.</p>
                    <label>
                        On
                        <input
                            type="radio"
                            checked={options.renderOptions.isLighting}
                            onChange={() => toggleLighting(true)}
                            value="true"
                        />
                    </label>
                    <label>
                        Off
                        <input
                            type="radio"
                            checked={!options.renderOptions.isLighting}
                            onChange={() => toggleLighting(false)}
                            value="false"
                        />
                    </label>
                </div>
                {/* Anti-Aliasing (FXAA) */}
                <div>
                    <h3>Anti-Aliasing (FXAA)</h3>
                    <p>Visualise anti-aliasing.</p>
                    <label>
                        On
                        <input
                            type="radio"
                            checked={options.renderOptions.isFxaa}
                            onChange={() => toggleFxaa(true)}
                            value="true"
                        />
                    </label>
                    <label>
                        Off
                        <input
                            type="radio"
                            checked={!options.renderOptions.isFxaa}
                            onChange={() => toggleFxaa(false)}
                            value="false"
                        />
                    </label>
                </div>
                {/* Edge */}
                <div>
                    <h3>Edge</h3>
                    <p>Visualise edge of objects.</p>
                    <label>
                        On
                        <input
                            type="radio"
                            checked={options.renderOptions.isEdge}
                            onChange={() => toggleEdge(true)}
                            value="true"
                        />
                    </label>
                    <label>
                        Off
                        <input
                            type="radio"
                            checked={!options.renderOptions.isEdge}
                            onChange={() => toggleEdge(false)}
                            value="false"
                        />
                    </label>
                </div>
                {/* Screen Space Ambient Occlusion */}
                <div>
                    <h3>Screen Space Ambient Occlusion</h3>
                    <p>Visualise detailed shading between objects.</p>
                    <label>
                        On
                        <input
                            type="radio"
                            checked={options.renderOptions.isSSAO}
                            onChange={() => toggleSSAO(true)}
                            value="true"
                        />
                    </label>
                    <label>
                        Off
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
    )
};