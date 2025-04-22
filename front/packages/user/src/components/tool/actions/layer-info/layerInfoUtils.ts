import * as Cesium from "cesium";
import {ApolloClient, NormalizedCacheObject} from "@apollo/client";
import {
  AttributeByNativeNameDocument, LayerAttribute,
} from "@mnd/shared/src/types/layerset/gql/graphql";
import { ProcessedFeature } from "@/components/tool/actions/layer-info/layerInfoType";

export const processFeatures = async (
  selectedFeatures: Cesium.ImageryLayerFeatureInfo[],
  client: ApolloClient<NormalizedCacheObject>
): Promise<ProcessedFeature[]> => {
  const results = await Promise.all(
    selectedFeatures.map(async (feature) => {
      const nativeName = feature?.data?.id?.split(".")[0];
      const { data } = await client.query({
        query: AttributeByNativeNameDocument,
        variables: { name: nativeName },
      });

      return {
        id: feature.data?.id ?? '',
        name: feature.name ?? '',
        properties: (data.attributeByNativeName ?? []).filter(
          (item): item is LayerAttribute => item !== null
        ),
      };
    })
  );

  return results;
};
