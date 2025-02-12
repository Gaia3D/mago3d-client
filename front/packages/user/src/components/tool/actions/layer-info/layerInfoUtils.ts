import * as Cesium from "cesium";
import {ProcessedFeature} from "@/components/tool/actions/layer-info/layerInfoType.ts";
import {featureGroups} from "@/components/tool/actions/layer-info/layerInfoData.ts";


export const processFeatures = (
    selectedFeatures: Cesium.ImageryLayerFeatureInfo[]
): ProcessedFeature[] => {
    return selectedFeatures.map((feature) => {
        const featureProps = feature?.data?.properties ?? {};

        // 기존 그룹에서 사용된 property title 목록
        const usedTitles = new Set(
            featureGroups.flatMap((group) => group.properties.map((p) => p.title))
        );

        // 기존 그룹에 속하는 속성 필터링
        const updatedFeatureGroups = featureGroups
            .map((group) => {
                const validProperties = group.properties
                    .map((property) => ({
                        ...property,
                        value: featureProps[property.title] ?? "",
                    }))
                    .filter((property) =>
                        typeof property.value === "string"
                            ? property.value.trim() !== ""
                            : property.value !== undefined && property.value !== null
                    );

                return validProperties.length > 0
                    ? { ...group, properties: validProperties }
                    : null;
            })
            .filter(Boolean) as Array<{
            featureName: string;
            properties: Array<{ label: string; title: string; value: string }>;
        }>;

        // 기타 그룹에 속할 속성들 필터링
        const otherProperties = Object.keys(featureProps)
            .filter((key) => !usedTitles.has(key))
            .map((key) => ({
                label: key,
                title: key,
                value: featureProps[key] ?? "",
            }));

        // "기타" 그룹 추가 (필요한 경우)
        if (otherProperties.length > 0) {
            updatedFeatureGroups.push({
                featureName: "기타",
                properties: otherProperties,
            });
        }

        return {
            id: feature.data.id,
            name: feature.name ?? '',
            featureGroups: updatedFeatureGroups,
        };
    });
};
