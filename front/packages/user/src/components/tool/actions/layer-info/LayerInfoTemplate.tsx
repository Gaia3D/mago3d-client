import React, { useState, useMemo } from "react";
import * as Cesium from "cesium";
import { processFeatures } from "@/components/tool/actions/layer-info/layerInfoUtils.ts";

interface LayerInfoTemplateProps {
    selectedFeatures: Cesium.ImageryLayerFeatureInfo[];
}

const LayerInfoTemplate = ({ selectedFeatures }: LayerInfoTemplateProps) => {
    const processedFeatures = useMemo(
        () => processFeatures(selectedFeatures),
        [selectedFeatures]
    );

    // 확장된 feature를 관리하는 상태
    const [expandedFeatures, setExpandedFeatures] = useState<Set<string>>(new Set());
    console.log("expandedFeatures",expandedFeatures);
    // 중복 방지를 위해 featureId를 특정할 수 있도록 설정
    const generateFeatureKey = (feature: { id: string; name: string }, idx: number) => {
        const baseId = feature.id.split(".")[0];
        return `${baseId}-${feature.name}-${idx}`;
    };

    // 클릭 시 해당 feature의 표시 상태를 토글
    const toggleFeature = (featureKey: string) => {
        setExpandedFeatures((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(featureKey)) {
                newSet.delete(featureKey);
            } else {
                newSet.add(featureKey);
            }
            return newSet;
        });
    };

    return (
        <div className="layer-info-container">
            {processedFeatures.map((feature, idx) => {
                const featureKey = generateFeatureKey(feature, idx);
                const isExpanded = expandedFeatures.has(featureKey);

                return (
                    <div key={featureKey} className="feature-container">
                        <h3
                            className="feature-name-toggle"
                            onClick={() => toggleFeature(featureKey)}
                        >
                            {feature.name}
                            <span className={`dropdown-icon ${isExpanded ? "expanded" : ""}`}>
                                ▼
                            </span>
                        </h3>

                        {isExpanded && feature.featureGroups.map((group, gIdx) => (
                            <div key={`${featureKey}-group-${gIdx}`} className="feature-group ol-gray-container">
                                <div className="feature-name bg-gray fw-bold">{group.featureName}</div>
                                <div className="properties-container">
                                    {group.properties.map((item, pIdx) => (
                                        <div key={`${featureKey}-prop-${pIdx}`} className="properties-item" data-weight={item.weight}>
                                            <div className="properties-label bg-gray fw-bold">{item.label}</div>
                                            <div className="properties-value ellipsis" title={item.value || "-"}>{item.value || "-"}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                );
            })}
        </div>
    );
};

export default LayerInfoTemplate;
