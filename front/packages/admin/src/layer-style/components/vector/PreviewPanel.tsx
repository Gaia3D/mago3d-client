import React, {useEffect, useState} from 'react';
import {useRecoilValue} from "recoil";
import {selectedAssetState} from "@src/layer-style/recoils/layerStyle";
import * as Cesium from "cesium";
import {BackgroundMaps, BackgroundMapType} from "@src/constants/backgroundMap";
import PreviewModeSelector from "@src/layer-style/components/vector/preview-panel/PreviewModeSelector";
import BackgroundMapSelector from "@src/layer-style/components/vector/preview-panel/BackgroundMapSelector";
import LegendPreview from "@src/layer-style/components/vector/preview-panel/LegendPreview";
import CesiumPreview from "@src/layer-style/components/vector/preview-panel/CesiumPreview";
import {usePreviewData} from "@src/layer-style/hooks/usePreviewData";

export enum PreviewMode {
  Single = "single",
  All = "all",
  Legend = "legend",
}

const PreviewPanel = () => {
  const asset = useRecoilValue(selectedAssetState);
  const [backgroundMap, setBackgroundMap] = useState<BackgroundMapType>(BackgroundMaps[0]);
  const [previewMode, setPreviewMode] = useState<PreviewMode>(PreviewMode.Single);

  const { dataSource, loading } = usePreviewData(asset);

  if (loading) return <>loading...</>;

  return (
    <>
      <div className="section-header">
        <div>레이어 미리보기</div>
        <div>성능상의 이유로 최대 50개의 객체만 미리보기 됩니다.</div>
      </div>
      <div className="preview-container">
        <PreviewModeSelector
          previewMode={previewMode}
          onClick={setPreviewMode}
        />
        <div className={`preview-cesium-wrapper ${previewMode === PreviewMode.Legend ? 'none' : ''}`}>
          <CesiumPreview
            dataSource={dataSource}
            backgroundMap={backgroundMap}
            previewMode={previewMode}
          />
          <BackgroundMapSelector
            currentMap={backgroundMap}
            onClick={setBackgroundMap}
          />
        </div>
        <div className={`preview-legend-wrapper ${previewMode === PreviewMode.Legend ? '' : 'none'}`}>
          <LegendPreview/>
        </div>
      </div>
    </>
  );
};

export default PreviewPanel;