import * as Cesium from "cesium";
import React, {useState} from 'react';
import PreviewModeSelector from "@src/components/layerset/layer/style/PreviewModeSelector";
import {PreviewMode} from "@src/types/previewMode";
import CesiumPreview from "@src/components/layerset/layer/style/CesiumPreview";
import BackgroundMapSelector from "@src/components/layerset/layer/style/BackgroundMapSelector";
import LegendPreview from "@src/components/layerset/layer/style/LegendPreview";
import {backgroundMaps, BackgroundMapType} from "@src/constants/backgroundMap";
import {LayerStyle} from "@mnd/shared/src/types/layerset/gql/graphql";

interface PreviewPanelProps {
  layerStyles: LayerStyle[];
  dataSource: Cesium.GeoJsonDataSource;
}

const PreviewPanel = ({layerStyles, dataSource}: PreviewPanelProps) => {
  const [backgroundMap, setBackgroundMap] = useState<BackgroundMapType>(backgroundMaps[0]);
  const [previewMode, setPreviewMode] = useState<PreviewMode>(PreviewMode.Single);

  return (
    <div className="preview-container">
      <PreviewModeSelector
        previewMode={previewMode}
        onClick={setPreviewMode}
      />

      <div className={`preview-cesium-wrapper ${previewMode === PreviewMode.Legend ? 'none' : ''}`}>
        <CesiumPreview
          dataSource={dataSource}
          layerStyles={layerStyles}
          backgroundMap={backgroundMap}
          previewMode={previewMode}
        />
        <BackgroundMapSelector
          currentMap={backgroundMap}
          onClick={setBackgroundMap}
        />
      </div>

      <div className={`preview-legend-wrapper ${previewMode === PreviewMode.Legend ? '' : 'none'}`}>
        <LegendPreview />
      </div>
    </div>
  );
};

export default PreviewPanel;