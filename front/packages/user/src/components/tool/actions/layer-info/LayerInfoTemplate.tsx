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
                <div key={feature.id} className="layer-info-table">
                    <h3>{feature.name}</h3>
                    {feature.featureGroups.map((group) => (
                        <div key={group.featureName} className="feature-group">
                            <h4>{group.featureName}</h4>
                            <table>
                                <tbody>
                                {group.properties.map((item, idx) => (
                                    <tr key={idx}>
                                        <th>{item.label}</th>
                                        <td>{item.value}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default LayerInfoTemplate;
