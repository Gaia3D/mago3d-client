import React, { useEffect, useMemo, useState } from "react";
import SideCloseButton from "@/components/SideCloseButton.tsx";
import DebouncedInput from "@/components/common/DebouncedInput.tsx";
import { useQuery } from "@apollo/client";
import { useRecoilValueLoadable } from "recoil";

import {
  AssetFilterInput,
  FindAssetsByFilterDocument,
  PreviewColumnsDocument,
} from "@mnd/shared/src/types/layerset/gql/graphql.ts";
import { currentUserProfileSelector } from "@/recoils/Auth.ts";

interface Props {
  display: boolean;
}

const buildFilter = (userId: string): AssetFilterInput => ({
  and: [
    { printable: { eq: true } },
    {
      or: [
        { access: { eq: "Public" } },
        {
          and: [
            { access: { eq: "Private" } },
            { createdBy: { eq: userId } },
          ],
        },
      ],
    },
  ],
});

const buildWfsUrl = (
  layerName: string,
  searchKey?: string,
  searchValue?: string
): string => {
  const baseUrl = import.meta.env.VITE_GEOSERVER_WFS_SERVICE_URL;
  const params = new URLSearchParams({
    service: "WFS",
    version: "2.0.0",
    request: "GetFeature",
    typeName: layerName,
    outputFormat: "application/json",
  });

  if (searchKey && searchValue) {
    params.append("CQL_FILTER", `${searchKey} LIKE '%${searchValue}%'`);
  }

  return `${baseUrl}?${params.toString()}`;
};

const AsidePrintArea = ({ display }: Props) => {
  const { contents } = useRecoilValueLoadable(currentUserProfileSelector);
  const userId = contents.id;

  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedAssetId, setSelectedAssetId] = useState("");
  const [searchKey, setSearchKey] = useState<string | undefined>(undefined);
  const [features, setFeatures] = useState<GeoJSON.Feature[]>([]);

  const searchFilter = useMemo(() => buildFilter(userId), [userId]);

  const { data: assetData } = useQuery(FindAssetsByFilterDocument, {
    variables: { filter: searchFilter },
    fetchPolicy: "network-only",
  });

  const selectedAsset = useMemo(
    () => assetData?.assets.find((a) => a?.id === selectedAssetId),
    [selectedAssetId, assetData]
  );

  const { data: previewData } = useQuery(PreviewColumnsDocument, {
    skip: !selectedAssetId,
    variables: { assetID: selectedAssetId },
  });

  const layerUrl = useMemo(() => {
    if (!selectedAsset) return "";
    return buildWfsUrl(
      selectedAsset.properties.layer.name,
      searchKey,
      searchKeyword || undefined
    );
  }, [selectedAsset, searchKey, searchKeyword]);

  useEffect(() => {
    if (!layerUrl) return;

    const controller = new AbortController();
    const signal = controller.signal;

    const loadGeoJson = async () => {
      try {
        console.log("layerUrl", layerUrl, searchKeyword);
        const response = await fetch(layerUrl, { signal });
        if (!response.ok) throw new Error("Network response was not ok");

        const geojson = await response.json();
        if (!signal.aborted) {
          console.log("geojson", geojson);
          setFeatures(geojson.features ?? []);
        }
      } catch (error) {
        if (signal.aborted) {
          console.log("Previous fetch aborted.");
        } else {
          console.error("GeoJSON fetch error", error);
        }
      }
    };

    loadGeoJson();

    return () => {
      controller.abort();
    };
  }, [layerUrl]);

  return (
    <div className={`side-bar-wrapper ${display ? "on" : "off"}`}>
      <div className="side-bar">
        <div className="side-bar-header">
          <SideCloseButton />
        </div>

        <div className="content--wrapper layer-wrapper">
          {/* 1. 인쇄 구역 선택 */}
          <select
            value={selectedAssetId}
            onChange={(e) => setSelectedAssetId(e.target.value)}
          >
            <option value="" hidden>1. 인쇄 구역 선택</option>
            {assetData?.assets.map((a) => (
              <option key={a?.id} value={a?.id}>
                {`${a?.name} (id: ${a?.id})`}
              </option>
            ))}
          </select>

          {/* 2. 검색 필드 선택 */}
          {previewData?.previewColumns && previewData.previewColumns.length > 0 && (
            <select
              value={searchKey ?? ""}
              onChange={(e) => setSearchKey(e.target.value || undefined)}
            >
              <option value="" hidden>2. 검색 필드 선택</option>
              {previewData?.previewColumns?.map((preview) => {
                const f = preview?.field ?? "";
                return (
                  <option key={f} value={f}>
                    {f}
                  </option>
                )
              })}
            </select>
          )}

          {/* 3. 검색어 입력 */}
          {searchKey && (
            <DebouncedInput
              value={searchKeyword}
              onDebounce={setSearchKeyword}
              placeholder="3. 검색어 입력"
            />
          )}

          {/* 4. 결과 Feature 목록 */}
          {features.length > 0 && (
            <div style={{ marginTop: "1rem" }}>
              {features.map((f) => (
                <div
                  key={f.id}
                  onClick={() => console.log("feature", f)}
                >
                  {f.properties?.[searchKey ?? ""] ?? f.id}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AsidePrintArea;
