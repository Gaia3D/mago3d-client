import * as Cesium from "cesium";
import React, {useEffect, useState} from 'react';
import PreviewModeSelector from "@src/components/layerset/layer/style/PreviewModeSelector";
import CesiumPreview from "@src/components/layerset/layer/style/CesiumPreview";
import BackgroundMapSelector from "@src/components/layerset/layer/style/BackgroundMapSelector";
import LegendPreview from "@src/components/layerset/layer/style/LegendPreview";
import {BackgroundMaps, BackgroundMapType} from "@src/constants/backgroundMap";
import {LayerAsset, LayerStyle} from "@mnd/shared/src/types/layerset/gql/graphql";
import {PreviewMode} from "@src/types/Layer";

interface PreviewPanelProps {
  asset: LayerAsset;
  styles: LayerStyle[];
}

const PreviewPanel = ({asset, styles}: PreviewPanelProps) => {
  const [dataSource, setDataSource] = useState<Cesium.GeoJsonDataSource | null>(null);
  const [backgroundMap, setBackgroundMap] = useState<BackgroundMapType>(BackgroundMaps[0]);
  const [previewMode, setPreviewMode] = useState<PreviewMode>(PreviewMode.Single);

  useEffect(() => {
    const resourceName = asset?.properties?.layer?.resource?.name;
    if (!resourceName) return;
    const fetchData = async () => {
      try {
        const url = `${import.meta.env.VITE_GEOSERVER_WFS_SERVICE_URL}service=WFS&version=2.0.0&request=GetFeature&typeName=${resourceName}&outputFormat=application/json`;
        const loadedDataSource = await Cesium.GeoJsonDataSource.load(url);
        setDataSource(loadedDataSource);
      } catch (e) {
        console.error("GeoJSON load error:", e);
      }
    };

    fetchData();
  }, [asset]);

  return (
    <>
      <div className="section-header">
        <div>레이어 미리보기</div>
        <div>성능상의 이유로 하나의 객체만 미리보기 됩니다.</div>
      </div>
      <div className="preview-container">
        <PreviewModeSelector
          previewMode={previewMode}
          onClick={setPreviewMode}
        />
        <div className={`preview-cesium-wrapper ${previewMode === PreviewMode.Legend ? 'none' : ''}`}>
          <CesiumPreview
            dataSource={dataSource}
            styles={styles}
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
    </>
  );
};

export default PreviewPanel;