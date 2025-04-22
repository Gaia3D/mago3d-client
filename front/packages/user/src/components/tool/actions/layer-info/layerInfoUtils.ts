import * as Cesium from "cesium";
import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import {
  AttributeByNativeNameDocument,
  LayerAttribute,
} from "@mnd/shared/src/types/layerset/gql/graphql";
import { ProcessedFeature } from "@/components/tool/actions/layer-info/layerInfoType";

export const processFeatures = async (
  selectedFeatures: Cesium.ImageryLayerFeatureInfo[],
  client: ApolloClient<NormalizedCacheObject>
): Promise<ProcessedFeature[]> => {
  const results = await Promise.all(
    selectedFeatures.map(async (feature) => {
      const nativeName = feature?.data?.id?.split(".")[0];
      const featureProps = feature?.data?.properties ?? {};

      const { data } = await client.query({
        query: AttributeByNativeNameDocument,
        variables: { name: nativeName },
      });

      const updatedFeatureGroups = (data.attributeByNativeName ?? [])
        .map((group) => {
          if (!group) return null;

          let hasValue = false;
          const updatedProps = group.properties.map((prop) => {
            const value = featureProps[prop.field]?.toString() ?? "";
            if (value !== "") hasValue = true;
            return { ...prop, value };
          });

          return hasValue ? { ...group, properties: updatedProps } : null;
        })
        .filter(Boolean) as LayerAttribute[];

      return {
        id: feature.data?.id ?? '',
        name: feature.name ?? '',
        properties: updatedFeatureGroups,
      };
    })
  );

  return results;
};
