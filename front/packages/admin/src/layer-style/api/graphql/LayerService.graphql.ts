import client from "@src/layer-style/libs/apollo";
import {
  ApplyLayerStyleDocument,
  CreateLayerStyleDocument,
  DeleteLayerStyleDocument,
  UpdateLayerStyleDocument
} from "@mnd/shared/src/types/layerset/gql/graphql";
import {LayerService} from "@src/layer-style/api/services/LayerService";

export const GraphQLLayerService: LayerService = {
  async createStyle(input) {
    const { data } = await client.mutate({
      mutation: CreateLayerStyleDocument,
      variables: { input },
      context: { clientName: "layerset" }
    });
    return data.createStyle;
  },

  async applyStyle(assetId, styleId) {
    await client.mutate({
      mutation: ApplyLayerStyleDocument,
      variables: { id: assetId, styleId },
      context: { clientName: "layerset" }
    });
  },

  async deleteStyle(styleId) {
    await client.mutate({
      mutation: DeleteLayerStyleDocument,
      variables: { id: styleId },
      context: { clientName: "layerset" }
    });
  },

  async updateStyle(styleId, updateStyleInput) {
    const {data} = await client.mutate({
      mutation: UpdateLayerStyleDocument,
      variables: { id: styleId, input: updateStyleInput}
    })
    return data.updateStyle;
  }
};
