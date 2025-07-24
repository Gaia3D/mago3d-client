import React, {useEffect, useMemo, useRef, useState} from "react";
import { useQuery } from "@apollo/client";
import { useRecoilValueLoadable } from "recoil";

import SideCloseButton from "@/components/SideCloseButton";
import AssetSelector from "./AssetSelector";
import FieldSelector from "./FieldSelector.tsx";
import FeatureList from "./FeatureList";

import {
  FindAssetsByFilterDocument,
  PreviewColumnsDocument,
} from "@mnd/shared/src/types/layerset/gql/graphql";
import { currentUserProfileSelector } from "@/recoils/Auth";
import { buildFilter, buildWfsUrl } from "../../../utils/printAreaUtils.ts";
import DebouncedInput from "@/components/common/DebouncedInput.tsx";
import {useInfiniteScrollObserver} from "@/hooks/printArea/useInfiniteScrollObserver.ts";
import {Feature} from "geojson";

interface Props {
  display: boolean;
}

const AsidePrintArea = ({ display }: Props) => {
  const { contents } = useRecoilValueLoadable(currentUserProfileSelector);
  const userId = contents.id;
  const searchFilter = useMemo(() => buildFilter(userId), [userId]);

  const [selectedAssetId, setSelectedAssetId] = useState("");
  const [searchKey, setSearchKey] = useState<string | undefined>(undefined);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [page, setPage] = useState(0);
  const [features, setFeatures] = useState<Feature[]>([]);

  const [loading, setLoading] = useState(false);

  const hasNextRef = useRef(true);
  const isFetchingRef = useRef(false);

  const { lastItemRef } = useInfiniteScrollObserver({
    hasNextRef,
    isFetchingRef,
    onLoadMore: () => setPage((prev) => prev + 1),
  });

  const { data: assetData } = useQuery(FindAssetsByFilterDocument, {
    variables: { filter: searchFilter },
  });

  const { data: previewData } = useQuery(PreviewColumnsDocument, {
    skip: !selectedAssetId,
    variables: { assetID: selectedAssetId },
  });

  const selectedAsset = useMemo(
    () => assetData?.assets.find((a) => a?.id === selectedAssetId),
    [selectedAssetId, assetData]
  );

  const fetchFeatures = async (currentPage: number, reset = false) => {
    if (!selectedAsset) return;
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    const PAGE_SIZE = 20;
    const layerUrl = buildWfsUrl(
      selectedAsset.properties.layer.name,
      currentPage,
      PAGE_SIZE,
      searchKey,
      searchKeyword
    )
    const controller = new AbortController();
    console.log("layerUrl", layerUrl);
    try {
      setLoading(true);
      const res = await fetch(layerUrl, { signal: controller.signal });
      if (!res.ok) throw new Error("bad response");
      const json = await res.json();
      const newFeatures = json.features ?? [];

      setFeatures((prev) => (reset ? newFeatures : [...prev, ...newFeatures]));

      // 👇 다음 페이지 유무 판단
      hasNextRef.current = newFeatures.length === PAGE_SIZE;

      // 만약 fetchFeatures(page) 호출 이후에 features.length === 0 이면 종료
      if (newFeatures.length === 0) {
        hasNextRef.current = false;
      }
    } catch (err) {
      if (!controller.signal.aborted) console.error(err);
    } finally {
      setLoading(false);
      isFetchingRef.current = false; // 추가해야 함!
    }
  }

  useEffect(() => {
    setPage(0);
    setFeatures([]);
    hasNextRef.current = true;
    fetchFeatures(0, true);
  }, [selectedAsset, searchKeyword, searchKey]);

  useEffect(() => {
    if (page === 0) return;
    fetchFeatures(page);
  }, [page]);


  return (
    <div className={`side-bar-wrapper ${display ? "on" : "off"}`}>
      <div className="side-bar">
        <div className="side-bar-header">
          <SideCloseButton />
        </div>
        <div className="content--wrapper layer-wrapper">
          {/* 1. 인쇄 구역 선택 */}
          <div className="content-row">
            <div className="content-title">인쇄 구역</div>
            <AssetSelector
              assetData={assetData}
              selectedAssetId={selectedAssetId}
              onChange={setSelectedAssetId}
            />
          </div>

          {/* 2. 검색 필드 선택 */}
          {previewData?.previewColumns && (
            <div className="content-row">
              <div className="content-title">검색 필드</div>
                <FieldSelector
                  previewData={previewData}
                  searchKey={searchKey}
                  onChange={setSearchKey}
                />
            </div>
          )}
          {/* 3. 검색어 입력 */}
          {previewData?.previewColumns && (
            <div className="content-row">
              <div className="content-title">검색어</div>
                <DebouncedInput
                  value={searchKeyword}
                  onDebounce={setSearchKeyword}
                  placeholder="3. 검색어 입력"
                  className="content-value"
                />
            </div>
          )}

          {/* 4. 결과 Feature 목록 */}
          <FeatureList
            features={features}
            searchKey={searchKey}
            refCallback={(node) => lastItemRef.current = node}
          />
          {loading && (
            <div className="flex-center">
              <span className="spin-loader"></span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AsidePrintArea;
