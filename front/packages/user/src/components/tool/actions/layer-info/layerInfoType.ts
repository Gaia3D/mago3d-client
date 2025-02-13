// 유틸 함수에서 사용하는 타입 정의 (가공된 피처 구조)
export interface ProcessedFeature {
    id: string;
    name: string;
    featureGroups: {
        featureName: string;
        properties: Array<{ label: string; field: string; value: string; weight: number }>;
    }[];
}
