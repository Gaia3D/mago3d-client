import React from 'react';
import Cesium from "cesium";

interface BasicLayerInfoTemplate {
    selectedFeatures: Cesium.ImageryLayerFeatureInfo[];
}

const BasicLayerInfoTemplate = ({selectedFeatures}: BasicLayerInfoTemplate) => {
    return (
        <div style={{
            position: "fixed",
            top: "100px",
            right: "100px",
            color: "black",
            backgroundColor: "white",
            padding: "10px"
        }}>
            {selectedFeatures.map((feature, index) => (
                <div key={index}>
                    <h3>{feature.name}</h3>
                    <div dangerouslySetInnerHTML={{__html: feature.description || ""}}/>
                </div>
            ))}
        </div>
    );
};

export default BasicLayerInfoTemplate;