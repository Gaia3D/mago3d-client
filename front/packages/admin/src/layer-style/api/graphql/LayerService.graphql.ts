import client from "@src/layer-style/libs/apollo";
import {
  ApplyLayerStyleDocument, BackgroundsDocument,
  CreateLayerStyleDocument,
  DeleteLayerStyleDocument, PreviewColumnsDocument,
  UpdateLayerStyleDocument, ClassifyAttributeDocument
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
  },

  async getAttribute(assetId) {
    const {data} = await client.query({
      query: PreviewColumnsDocument,
      variables: {
        assetID: assetId
      }
    })
    return data.previewColumns;
  },

  async getClassifyAttribute(attribute, nativeName) {
    const {data} = await client.query({
      query: ClassifyAttributeDocument,
      variables: { nativeName, attribute}
    })
    return data.classifyAttribute;
  },

  async getBackgrounds() {
    const {data} = await client.query({
      query: BackgroundsDocument,
    })
    console.log("data", data);
    return data.backgrounds;
  }
};
