export const featureGroups = [
    {
        featureName: "유역정보",
        properties: [
            { field: "유역코드", value: "", label: "유역코드", weight: 4 },
            { field: "유역면적", value: "", label: "유역면적", weight: 1 },
            { field: "유역둘레", value: "", label: "유역둘레", weight: 1 },
            { field: "유역천길이", value: "", label: "유역천길이", weight: 2 },
        ],
    },
    {
        featureName: "유역형상정보",
        properties: [
            { field: "유역평균폭", value: "", label: "유역평균폭", weight: 1 },
            { field: "형상계수", value: "", label: "형상계수", weight: 1 },
            { field: "수계밀도", value: "", label: "수계밀도", weight: 1 },
            { field: "기복비", value: "", label: "기복비", weight: 1 },
        ],
    },
    {
        featureName: "지형정보",
        properties: [
            { field: "표고평균", value: "", label: "표고평균", weight: 1 },
            { field: "경사평균", value: "", label: "경사평균", weight: 1 },
            { field: "방위", value: "", label: "방위", weight: 1 },
            { field: "지형구분", value: "", label: "지형구분", weight: 1 },
        ],
    },
    {
        featureName: "임상정보",
        properties: [
            { field: "임상", value: "", label: "임상", weight: 1 },
            { field: "영급", value: "", label: "영급", weight: 1 },
            { field: "경급", value: "", label: "경급", weight: 1 },
            { field: "밀도", value: "", label: "밀도", weight: 1 },
        ],
    },
    {
        featureName: "토양정보",
        properties: [
            { field: "토양형", value: "", label: "토양형", weight: 1 },
            { field: "모암", value: "", label: "모암", weight: 1 },
            { field: "유효토심", value: "", label: "유효토심", weight: 1 },
            { field: "twi", value: "", label: "지형습윤지수", weight: 1 },
        ],
    },{
        featureName: "토지이용",
        properties: [
            { field: "건조지비율", value: "", label: "건조지비율", weight: 1 },
            { field: "농지비율", value: "", label: "농지비율", weight: 1 },
            { field: "산림비율", value: "", label: "산림비율", weight: 1 },
            { field: "나지비율", value: "", label: "", weight: 1 },
        ],
    },
    {
        featureName: "산사태정보",
        properties: [
            { field: "산사태빈도", value: "", label: "산사태빈도", weight: 1 },
            { field: "사방댐개수", value: "", label: "사방댐개수", weight: 1 },
            { field: "산사태1등급비", value: "", label: "산사태1등급비", weight: 1 },
            { field: "취약지역 비율", value: "", label: "취약지역 비율", weight: 1 },
        ],
    },
];
