import {AssetFilterInput, AssetPageableInput,} from "@src/generated/gql/dataset/graphql";

export type DataSearchTarget = "group" | "data";
export type DataSearchQueryOption = "eq" | "contains";
export type DataItemSize = 10 | 50 | 100;

export type AssetSearchProps = {
  filter: AssetFilterInput;
  pageable: AssetPageableInput;
}