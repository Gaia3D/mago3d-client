import * as Cesium from "cesium";
import {ProcessedFeature} from "@/components/tool/actions/layer-info/layerInfoType.ts";
import {featureGroups} from "@/components/tool/actions/layer-info/layerInfoData.ts";


export const processFeatures = (
    selectedFeatures: Cesium.ImageryLayerFeatureInfo[]
): ProcessedFeature[] => {
    return selectedFeatures.map((feature) => {
        const featureProps = feature?.data?.properties ?? {};

        // 기존 그룹에서 사용된 property field 목록
        const usedFields = new Set(
            featureGroups.flatMap((group) => group.properties.map((p) => p.field))
        );
        // 기존 그룹에 속하는 속성 필터링
        const updatedFeatureGroups = featureGroups
            .map((group) => {
                const validProperties = group.properties.map((property) => ({
                    ...property,
                    value: featureProps[property.field] ?? "",
                }));

                // 모든 value가 ""이면 null을 반환
                const allValuesEmpty = validProperties.every(prop => prop.value === "");

                return allValuesEmpty ? null : { ...group, properties: validProperties };
            })
            .filter(Boolean) as Array<{
            featureName: string;
            properties: Array<{ label: string; field: string; value: string; weight: number }>;
        }>;

        // 기타 그룹에 속할 속성들 필터링
        const otherProperties = Object.keys(featureProps)
            .filter((key) => !usedFields.has(key))
            .map((key) => ({
                label: key,
                field: key,
                value: featureProps[key] ?? "",
                weight: 1,
            }))
            .filter((property) => property.value !== "");

        // "기타" 그룹 추가 (필요한 경우)
        if (otherProperties.length > 0) {
            updatedFeatureGroups.push({
                featureName: "기타",
                properties: otherProperties,
            });
        }

        return {
            id: feature.data?.id ?? '',
            name: feature.name ?? '',
            featureGroups: updatedFeatureGroups,
        };
    });
};
