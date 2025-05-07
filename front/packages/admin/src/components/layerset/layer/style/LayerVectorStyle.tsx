import React, {useEffect, useState} from "react";
import { LayerAsset, LayerStyle } from "@mnd/shared/src/types/layerset/gql/graphql";
import * as Cesium from "cesium";
import InnerLoader from "@src/components/InnerLoader";
import StylePanel from "@src/components/layerset/layer/style/StylePanel";
import PreviewPanel from "@src/components/layerset/layer/style/PreviewPanel";

interface LayerVectorStyleProps {
  asset: LayerAsset;
}

const LayerVectorStyle = ({ asset }: LayerVectorStyleProps) => {
  const [layerStyles, setLayerStyles] = useState<LayerStyle[]>(asset.styles);
  const [dataSource, setDataSource] = useState<Cesium.GeoJsonDataSource | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const resourceName = asset?.properties?.layer?.resource?.name;
    if (!resourceName) return;
    setLoading(true);
    const fetchData = async () => {
      try {
        const url = `${import.meta.env.VITE_GEOSERVER_WFS_SERVICE_URL}service=WFS&version=2.0.0&request=GetFeature&typeName=${resourceName}&outputFormat=application/json`;
        const loadedDataSource = await Cesium.GeoJsonDataSource.load(url);
        setDataSource(loadedDataSource);
      } catch (e) {
        console.error("GeoJSON load error:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [asset]);

  return (
    <div className="style-container">
      <div className="left-section">
        <div className="section-header">
          <div>스타일 목록</div>
          <div><button>추가</button></div>
        </div>
        <div className="section-body">
          <StylePanel layerStyles={layerStyles} setLayerStyles={setLayerStyles} />
        </div>
      </div>

      <div className="right-section">
        <div className="section-header">
          <div>레이어 미리보기</div>
          <div>성능상의 이유로 하나의 객체만 미리보기 됩니다.</div>
        </div>
        {
          loading ? <InnerLoader /> :
          <PreviewPanel layerStyles={layerStyles} dataSource={dataSource} />
        }
        <div className="section-footer">
          <button>저장</button>
          <button>삭제</button>
          <button>초기화</button>
        </div>
      </div>
    </div>
  );
};

export default LayerVectorStyle;
