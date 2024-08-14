import {AssetFilterInput, AssetPageableInput} from "@/generated/gql/dataset/graphql.ts";

export type DataSearchTarget = "group" | "data";
export type DataSearchQueryOption = "eq" | "contains";
export type DataItemSize = 10 | 20 | 50 | 100;

export type AssetSearchProps = {
  filter: AssetFilterInput;
  pageable: AssetPageableInput;
}