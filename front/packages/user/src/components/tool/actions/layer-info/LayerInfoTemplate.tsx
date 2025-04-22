import React, { useState, useEffect } from "react";
import * as Cesium from "cesium";
import { processFeatures } from "@/components/tool/actions/layer-info/layerInfoUtils";
import {ApolloClient, NormalizedCacheObject, useApolloClient} from "@apollo/client";
import { ProcessedFeature } from "@/components/tool/actions/layer-info/layerInfoType";

interface LayerInfoTemplateProps {
    selectedFeatures: Cesium.ImageryLayerFeatureInfo[];
}

const LayerInfoTemplate = ({ selectedFeatures }: LayerInfoTemplateProps) => {

    const [processedFeatures, setProcessedFeatures] = useState<ProcessedFeature[]>([]);
    const [expandedFeatures, setExpandedFeatures] = useState<Set<string>>(new Set());
    const rawClient = useApolloClient();
    const client = rawClient as ApolloClient<NormalizedCacheObject>;

    useEffect(() => {
        const fetchFeatures = async () => {
            const result = await processFeatures(selectedFeatures, client);
            setProcessedFeatures(result);
        };

        fetchFeatures();
    }, [selectedFeatures, client]);

    const generateFeatureKey = (feature: { id: string; name: string }, idx: number) => {
        const baseId = feature.id.split(".")[0];
        return `${baseId}-${feature.name}-${idx}`;
    };

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

    if (processedFeatures.length === 0) {
        return <div className="layer-info-container color-white">선택된 레이어가 없습니다.</div>;
    }

    return (
      <div className="layer-info-container">
          {processedFeatures.map((feature, idx) => {
              const featureKey = generateFeatureKey(feature, idx);
              const isExpanded = expandedFeatures.has(featureKey);

              return (
                <div key={featureKey} className="feature-container">
                    <h3 className="feature-name-toggle" onClick={() => toggleFeature(featureKey)}>
                        {feature.name}
                        <span className={`dropdown-icon ${isExpanded ? "expanded" : ""}`}>▼</span>
                    </h3>

                    {isExpanded && (
                      feature.properties.length > 0 ? (
                        feature.properties.map((group, gIdx) => (
                          <div key={`${featureKey}-group-${gIdx}`} className="feature-group ol-gray-container">
                              <div className="feature-name bg-gray fw-bold">{group.categoryName}</div>
                              <div className="properties-container">
                                  {group.properties.map((item, pIdx) => (
                                    <div key={`${featureKey}-prop-${pIdx}`} className="properties-item" data-weight={item.weight}>
                                        <div className="properties-label bg-gray fw-bold">{item.label}</div>
                                        <div className="properties-value ellipsis" title={item.value || "-"}>{item.value || "-"}</div>
                                    </div>
                                  ))}
                              </div>
                          </div>
                        ))
                      ) : (
                        <div className="color-white">
                            관리자 페이지에서 레이어 속성을 설정해주세요
                        </div>
                      )
                    )}
                </div>
              );
          })}
      </div>
    );
};

export default LayerInfoTemplate;
