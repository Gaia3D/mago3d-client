import React from "react";
import {FindAssetsByFilterQuery} from "@mnd/shared/src/types/layerset/gql/graphql.ts";

interface Props {
  assetData: FindAssetsByFilterQuery | undefined;
  selectedAssetId: string;
  onChange: (id: string) => void;
}

const AssetSelector = ({ assetData, selectedAssetId, onChange }: Props) => {
  return (
    <select
      className="content-value"
      name="asset-selector"
      value={selectedAssetId}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="" hidden>1. 인쇄 구역 선택</option>
      {assetData?.assets.map((asset) => {
        if (!asset) return;
        return (
          <option key={asset.id} value={asset.id}>
            {`${asset.name} (id: ${asset.id})`}
          </option>
        )
      })}
    </select>
  );
};

export default AssetSelector;
