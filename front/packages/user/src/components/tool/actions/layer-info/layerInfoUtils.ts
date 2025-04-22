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
        .map((category) => {
          if (!category) return;
          const updatedProps = category.properties.map((prop) => ({
            ...prop,
            value: featureProps[prop.field]?.toString() ?? "",
          }));

          // 모든 value가 비어있다면 해당 그룹 제거
          // const allEmpty = updatedProps.every((p) => p.value === "");

          return {
            ...category,
            properties: updatedProps,
          }
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
