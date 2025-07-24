import React, { useMemo, useState } from "react";
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
import {useGeoJsonLoader} from "@/hooks/printArea/useGeoJsonLoader.ts";

interface Props {
  display: boolean;
}

const AsidePrintArea = ({ display }: Props) => {
  const { contents } = useRecoilValueLoadable(currentUserProfileSelector);
  const userId = contents.id;

  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedAssetId, setSelectedAssetId] = useState("");
  const [searchKey, setSearchKey] = useState<string | undefined>(undefined);
  const searchFilter = useMemo(() => buildFilter(userId), [userId]);

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

  const layerUrl = useMemo(() => {
    if (!selectedAsset) return "";
    return buildWfsUrl(
      selectedAsset.properties.layer.name,
      searchKey,
      searchKeyword || undefined
    );
  }, [selectedAsset, searchKey, searchKeyword]);

  const features = useGeoJsonLoader(layerUrl);

  return (
    <div className={`side-bar-wrapper ${display ? "on" : "off"}`}>
      <div className="side-bar">
        <div className="side-bar-header">
          <SideCloseButton />
        </div>
        <div className="content--wrapper layer-wrapper">
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
              searchKey={searchKey}
              onChange={setSearchKey}
            />
          )}

          {/* 3. 검색어 입력 */}
          {searchKey && (
            <DebouncedInput
              value={searchKeyword}
              onDebounce={setSearchKeyword}
              placeholder="3. 검색어 입력"
              className="basic-input"
            />
          )}

          {/* 4. 결과 Feature 목록 */}
          <FeatureList features={features} searchKey={searchKey} />
        </div>
      </div>
    </div>
  );
};

export default AsidePrintArea;
