import {useMemo, useState} from "react";
import { useRecoilValueLoadable } from "recoil";
import SideCloseButton from "@/components/SideCloseButton";
import FeatureList from "./FeatureList";
import { currentUserProfileSelector } from "@/recoils/Auth";
import InputPagination from "@/components/InputPagination.tsx";
import {Pagination, SearchCondition} from "@/types/PrintArea.ts";
import {usePrintAreaEffect} from "@/hooks/printArea/usePrintAreaEffect.ts";
import AssetSelector from "@/components/aside/print-area/AssetSelector.tsx";
import FieldSelector from "@/components/aside/print-area/FieldSelector.tsx";
import SearchInputCondition from "@/components/aside/print-area/SearchInputCondition.tsx";
import {buildFilter} from "@/utils/printAreaUtils.ts";
import {useQuery} from "@apollo/client";
import {FindAssetsByFilterDocument, PreviewColumnsDocument} from "@mnd/shared/src/types/layerset/gql/graphql.ts";

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
  const selectedLayerName = selectedAsset?.properties.layer.name ?? "";

  const { features, loading } = usePrintAreaEffect(
    display,
    selectedLayerName,
    searchCondition,
    pagination,
    setPagination
  );

  return (
    <div className={`side-bar-wrapper ${display ? "on" : "off"}`}>
      <div className="side-bar">
        <div className="side-bar-header">
          <SideCloseButton />
        </div>
        <div className="content--wrapper layer-wrapper">
          <div className="search-container">
            {/* 1. 인쇄 구역*/}
            <AssetSelector
              assetData={assetData}
              selectedAssetId={selectedAssetId}
              onChange={setSelectedAssetId}
            />
            {/*2. 검색 필드*/}
            {previewData?.previewColumns && (
              <FieldSelector
                previewData={previewData}
                searchKey={searchCondition.key}
                setSearchCondition={setSearchCondition}
              />
            )}
            {/*3. 검색어*/}
            {previewData?.previewColumns && (
              <SearchInputCondition
                searchCondition={searchCondition}
                setSearchCondition={setSearchCondition}
              />
            )}
          </div>
          {/*4. feature 목록*/}
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
          {/*5. 페이지네이션*/}
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
