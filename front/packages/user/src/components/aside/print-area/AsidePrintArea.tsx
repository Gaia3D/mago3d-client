import React, { useEffect, useMemo, useState } from "react";
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
import { Feature } from "geojson";
import InputPagination from "@/components/InputPagination.tsx";

interface Props {
  display: boolean;
}

const AsidePrintArea = ({ display }: Props) => {
  const { contents } = useRecoilValueLoadable(currentUserProfileSelector);
  const userId = contents.id;
  const searchFilter = useMemo(() => buildFilter(userId), [userId]);

  const [selectedAssetId, setSelectedAssetId] = useState("");
  const [searchKey, setSearchKey] = useState<string | undefined>(undefined);
  const [searchKeyIsString, setSearchKeyIsString] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [keywordCriteria, setKeywordCriteria] = useState<"eq" | "contains">("eq");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalFeatures, setTotalFeatures] = useState<number>(0);

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

  const fetchTotalCount = async () => {
    if (!selectedAsset) return;
    const url = buildWfsUrl({
      layerName: selectedAsset.properties.layer.name,
      searchKey,
      searchValue: keyword,
      criteria: keywordCriteria,
      hitsOnly: true,
    });

    const res = await fetch(url);
    const text = await res.text();
    const matched = text.match(/numberOfFeatures="(\d+)"/);
    setTotalFeatures(matched ? Number(matched[1]) : 0);
  };

  const fetchFeatures = async (currentPage: number) => {
    if (!selectedAsset) return;

    const url = buildWfsUrl({
      layerName: selectedAsset.properties.layer.name,
      page: currentPage,
      size: pageSize,
      searchKey,
      searchValue: keyword,
      criteria: keywordCriteria,
    });

    try {
      setLoading(true);
      const res = await fetch(url);
      if (!res.ok) throw new Error("bad response");
      const json = await res.json();
      setFeatures(json.features ?? []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(0);
    setFeatures([]);
    setTotalFeatures(0);
    if (selectedAsset) {
      fetchTotalCount();
    }
  }, [selectedAsset, searchKey, keyword]);

  useEffect(() => {
    if (selectedAsset) fetchFeatures(page);
  }, [page, pageSize, selectedAsset, searchKey, keyword]);

  const totalPages = Math.ceil(totalFeatures / pageSize);

  return (
    <div className={`side-bar-wrapper ${display ? "on" : "off"}`}>
      <div className="side-bar">
        <div className="side-bar-header">
          <SideCloseButton />
        </div>
        <div className="content--wrapper layer-wrapper">
          <div className="search-container">
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
                  onChange={(key, isStr) => {
                    setSearchKey(key);
                    setSearchKeyIsString(isStr ?? false);
                  }}
                />
              </div>
            )}

            {/* 3. 검색어 입력 */}
            {previewData?.previewColumns && (
              <div className="content-row">
                <div className="content-title">검색어</div>
                <select className="criteria-select"
                        onChange={(e) => setKeywordCriteria(e.target.value as "eq" | "contains")}>
                  <option value="eq">일치</option>
                  {searchKeyIsString && <option value="contains">포함</option>}
                </select>
                <DebouncedInput
                  value={keyword}
                  onDebounce={setKeyword}
                  placeholder="검색어 입력"
                  className="keyword-input"
                />
              </div>
            )}
          </div>

          {/* 4. 결과 Feature 목록 */}
          <div className="feature-container flex-center">
            {loading ? (
              <span className="spin-loader"></span>
            ) : (
              <FeatureList
                display={display}
                assetName={selectedAsset?.name ?? ""}
                features={features}
                searchKey={searchKey}
              />
              )
            }
          </div>

          {/* 5. 페이지네이션 */}
          <InputPagination
            page={page}
            totalPages={totalPages}
            pageSize={pageSize}
            onChange={setPage}
            onPageSizeChange={(newSize) => {
              setPageSize(newSize);
              setPage(0);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AsidePrintArea;
