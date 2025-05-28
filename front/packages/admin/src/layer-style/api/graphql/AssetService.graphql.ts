import { RemoteDocument } from "@mnd/shared/src/types/layerset/gql/graphql";
import { AssetService } from '../services/AssetService';
import client from "@src/layer-style/libs/apollo";

export const GraphQLAssetService: AssetService = {
  async getAsset(href) {
    const { data } = await client.query({
      query: RemoteDocument,
      variables: { href },
    });
    return data.remote;
  },

  async updateAsset(id, data) {
    // mutation 예시
    // return client.mutate({ ... });
  },
};
