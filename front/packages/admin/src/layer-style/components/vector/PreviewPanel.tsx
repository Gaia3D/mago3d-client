import React, {useEffect, useState} from 'react';
import {useRecoilValue} from "recoil";
import {selectedAssetState} from "@src/layer-style/recoils/layerStyle";
import * as Cesium from "cesium";
import {BackgroundMaps, BackgroundMapType} from "@src/constants/backgroundMap";
import PreviewModeSelector from "@src/layer-style/components/vector/preview-panel/PreviewModeSelector";
import BackgroundMapSelector from "@src/layer-style/components/vector/preview-panel/BackgroundMapSelector";
import LegendPreview from "@src/layer-style/components/vector/preview-panel/LegendPreview";

export enum PreviewMode {
  Single = "single",
  All = "all",
  Legend = "legend",
}

const PreviewPanel = () => {
  const asset = useRecoilValue(selectedAssetState);
  const [dataSource, setDataSource] = useState<Cesium.GeoJsonDataSource | null>(null);
  const [backgroundMap, setBackgroundMap] = useState<BackgroundMapType>(BackgroundMaps[0]);
  const [previewMode, setPreviewMode] = useState<PreviewMode>(PreviewMode.Single);

  const [loading, setLoading] = useState(true);

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
      } finally {
        console.log("datasource 호출 완료")
        setLoading(false);
      }
    };

    fetchData();
  }, [asset]);

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
          {/*<CesiumPreview*/}
          {/*  dataSource={dataSource}*/}
          {/*  backgroundMap={backgroundMap}*/}
          {/*  previewMode={previewMode}*/}
          {/*/>*/}
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