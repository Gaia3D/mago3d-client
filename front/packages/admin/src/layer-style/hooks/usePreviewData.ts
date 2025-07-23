import {LayerAsset} from "@mnd/shared/src/types/layerset/gql/graphql";
import {useEffect, useState} from "react";
import * as Cesium from "cesium";
import {MAX_PREVIEW_FEATURE_COUNT} from "@src/constants/common";

export const usePreviewData = (asset: LayerAsset | null) => {
  const [dataSource, setDataSource] = useState<Cesium.GeoJsonDataSource | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!asset?.properties?.layer?.resource?.name) return;
    const fetch = async () => {
      try {
        const url = `${import.meta.env.VITE_GEOSERVER_WFS_SERVICE_URL}
        service=WFS
        &version=2.0.0
        &request=GetFeature&typeName=${asset.properties.layer.resource.name}
        &outputFormat=application/json&
        count=${MAX_PREVIEW_FEATURE_COUNT}`;

        const ds = await Cesium.GeoJsonDataSource.load(url);
        setDataSource(ds);
      } catch (e) {
        console.error("GeoJSON load error:", e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [asset]);

  return { dataSource, loading };
};
