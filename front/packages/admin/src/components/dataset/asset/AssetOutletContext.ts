import {DatasetAssetForUpdateQuery, DatasetGroupListQuery} from "@src/generated/gql/dataset/graphql";

export type AssetOutletContext = {
  id: string
  data: DatasetAssetForUpdateQuery
}

export type CreateAssetOutletContext = {
  data: DatasetGroupListQuery
}

