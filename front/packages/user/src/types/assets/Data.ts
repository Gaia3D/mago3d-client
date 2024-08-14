import {
  Access,
  AssetFilterInput,
  AssetPageableInput,
  AssetType,
  ProcessTaskStatus
} from "@/generated/gql/dataset/graphql.ts";

export type Asset = {
      __typename?: "Asset" | undefined;
      id: string; name: string;
      assetType: AssetType;
      enabled: boolean;
      access: Access;
      status?: ProcessTaskStatus | null | undefined;
      createdAt?: string | null | undefined;
      updatedAt?: string | null | undefined; }
    | null;

export type DataSearchTarget = "group" | "data";
export type DataSearchQueryOption = "eq" | "contains" | "containsIgnoreCase";
export type DataItemSize = 10 | 20 | 50 | 100;

export type AssetSearchProps = {
  filter: AssetFilterInput;
  pageable: AssetPageableInput;
}

