import React, { useEffect, useMemo } from "react";
import * as Cesium from "cesium";
import {processFeatures} from "@/components/tool/actions/layer-info/layerInfoUtils.ts";

interface LayerInfoTemplateProps {
    selectedFeatures: Cesium.ImageryLayerFeatureInfo[];
}

const LayerInfoTemplate = ({ selectedFeatures }: LayerInfoTemplateProps) => {
    const processedFeatures = useMemo(
        () => processFeatures(selectedFeatures),
        [selectedFeatures]
    );

    useEffect(() => {
        console.log("processedFeatures", processedFeatures);
    }, [processedFeatures]);

    return (
        <div className="layer-info-container">
            {processedFeatures.map((feature) => (
                <div key={feature.id} className="feature-container">
                    <h3>{feature.name}</h3>
                    {feature.featureGroups.map((group) => (
                        <div className="feature-group">
                            <div className="feature-name">{group.featureName}</div>
                            <div className="properties-container">
                                {group.properties.map((item, idx) => (
                                    <div className="properties-item" data-weight={item.weight}>
                                        <div className="properties-label">{item.label}</div>
                                        <div className="properties-value">{item.value}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default LayerInfoTemplate;
