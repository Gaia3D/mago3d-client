import {LayerAsset, RemoteDocument} from "@mnd/shared/src/types/layerset/gql/graphql";
import {useEffect, useState} from "react";
import {MAX_PREVIEW_FEATURE_COUNT} from "@src/constants/common";
import {useSuspenseQuery} from "@apollo/client";

export const usePreviewData = (asset: LayerAsset | null) => {
  const [loading, setLoading] = useState(true);

  const wfsUrl = (() => {
    if (!asset?.properties?.layer?.resource?.name) return null;
    const params = new URLSearchParams({
      service: "WFS",
      version: "2.0.0",
      request: "GetFeature",
      typeName: asset.properties.layer.resource.name,
      outputFormat: "application/json",
      count: MAX_PREVIEW_FEATURE_COUNT.toString(),
    });
    return `${import.meta.env.VITE_GEOSERVER_WFS_SERVICE_URL}?${params.toString()}`;
  })();

  const { data: remoteData } = useSuspenseQuery(RemoteDocument, {
    variables: { href: wfsUrl ?? "" },
    skip: !wfsUrl,
  });

  useEffect(() => {
    setLoading(!remoteData?.remote);
  }, [remoteData]);

  return {
    geoJson: remoteData?.remote,
    loading,
  };
};

