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
import {Pagination, SearchCondition} from "@/types/PrintArea.ts";
import SearchInputCondition from "@/components/aside/print-area/SearchInputCondition.tsx";

interface Props {
  display: boolean;
}

const INIT_SEARCH_CONDITION: SearchCondition = {
  key: "",
  isString: false,
  keyword: "",
  criteria: "eq"
}

const INIT_PAGINATION: Pagination = {
  page: 0,
  pageSize: 10,
  totalCount: 0
}

const AsidePrintArea = ({ display }: Props) => {
  const { contents } = useRecoilValueLoadable(currentUserProfileSelector);
  const userId = contents.id;
  const searchFilter = buildFilter(userId);

  const [selectedAssetId, setSelectedAssetId] = useState("");
  const [searchCondition, setSearchCondition] = useState<SearchCondition>(INIT_SEARCH_CONDITION);
  const [pagination, setPagination] = useState<Pagination>(INIT_PAGINATION);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(false);

  const updateSearchCondition = (patch: Partial<SearchCondition>) => {
    setSearchCondition(prev => ({ ...prev, ...patch }));
  };

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
      searchKey: searchCondition.key,
      searchValue: searchCondition.keyword,
      criteria: searchCondition.criteria,
      hitsOnly: true,
    });

    const res = await fetch(url);
    const text = await res.text();
    const matched = text.match(/numberOfFeatures="(\d+)"/);
    setPagination(prev => ({
      ...prev,
      totalCount: matched ? Number(matched[1]) : 0
    }))
  };

  const fetchFeatures = async (currentPage: number) => {
    if (!selectedAsset) return;

    const url = buildWfsUrl({
      layerName: selectedAsset.properties.layer.name,
      page: currentPage,
      size: pagination.pageSize,
      searchKey: searchCondition.key,
      searchValue: searchCondition.keyword,
      criteria: searchCondition.criteria,
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
    setPagination(INIT_PAGINATION);
    setFeatures([]);
    if (selectedAsset) {
      fetchTotalCount();
    }
  }, [selectedAsset, searchCondition.key, searchCondition.keyword, searchCondition.criteria]);

  useEffect(() => {
    if (selectedAsset) fetchFeatures(pagination.page);
  }, [pagination, selectedAsset, searchCondition.key, searchCondition.keyword, searchCondition.criteria]);

  return (
    <div className={`side-bar-wrapper ${display ? "on" : "off"}`}>
      <div className="side-bar">
        <div className="side-bar-header">
          <SideCloseButton />
        </div>
        <div className="content--wrapper layer-wrapper">
          <div className="search-container">
            {/* 1. 인쇄 구역 선택 */}
            <AssetSelector
              assetData={assetData}
              selectedAssetId={selectedAssetId}
              onChange={setSelectedAssetId}
            />
            {/* 2. 검색 필드 선택 */}
            {previewData?.previewColumns && (
              <FieldSelector
                previewData={previewData}
                searchKey={searchCondition.key}
                onChange={(key, isStr) => {
                  updateSearchCondition({
                    key: key,
                    isString: isStr ?? false
                  })
                }}
              />
            )}

            {/* 3. 검색어 입력 */}
            {previewData?.previewColumns && (
              <SearchInputCondition
                isString={searchCondition.isString}
                criteria={searchCondition.criteria}
                keyword={searchCondition.keyword}
                onChange={(patch) => updateSearchCondition(patch)}
              />
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
                searchKey={searchCondition.key}
              />
              )
            }
          </div>

          {/* 5. 페이지네이션 */}
          <InputPagination
            pagination={pagination}
            setPagination={setPagination}
          />
        </div>
      </div>
    </div>
  );
};

export default AsidePrintArea;
