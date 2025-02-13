export const featureGroups = [
    {
        featureName: "유역정보",
        properties: [
            { label: "유역코드", field: "유역코드", value: "", weight: 4 },
            { label: "유역면적", field: "유역면적", value: "", weight: 1 },
            { label: "유역둘레", field: "유역둘레", value: "", weight: 1 },
            { label: "유역천길이", field: "유역천길이", value: "", weight: 2 },
        ],
    },
    {
        featureName: "유역형상정보",
        properties: [
            { label: "유역평균폭", field: "유역평균폭", value: "", weight: 1 },
            { label: "형상계수", field: "형상계수", value: "", weight: 1 },
            { label: "수계밀도", field: "수계밀도", value: "", weight: 1 },
            { label: "기복비", field: "기복비", value: "", weight: 1 },
        ],
    },
    {
        featureName: "지형정보",
        properties: [
            { label: "표고평균", field: "표고평균", value: "", weight: 1 },
            { label: "경사평균", field: "경사평균", value: "", weight: 1 },
            { label: "방위", field: "방위", value: "", weight: 1 },
            { label: "지형구분", field: "지형구분", value: "", weight: 1 },
        ],
    },
    {
        featureName: "임상정보",
        properties: [
            { label: "임상", field: "임상", value: "", weight: 1 },
            { label: "영급", field: "영급", value: "", weight: 1 },
            { label: "경급", field: "경급", value: "", weight: 1 },
            { label: "밀도", field: "밀도", value: "", weight: 1 },
        ],
    },
    {
        featureName: "토양정보",
        properties: [
            { label: "토양형", field: "토양형", value: "", weight: 1 },
            { label: "모암", field: "모암", value: "", weight: 1 },
            { label: "유효토심", field: "유효토심", value: "", weight: 1 },
            { label: "지형습윤지수", field: "twi", value: "", weight: 1 },
        ],
    },
    {
        featureName: "산사태정보",
        properties: [
            { label: "토지이용", field: "토지이용", value: "", weight: 1 },
            { label: "산사태발생", field: "산사태발생", value: "", weight: 1 },
            { label: "사방댐", field: "사방댐", value: "", weight: 2 },
            { label: "산사태위험지역 1등급지 중첩비", field: "산사태위험", value: "", weight: 2 },
            { label: "산사태취약지역유역 중첩비", field: "산사태취약", value: "", weight: 2 },
        ],
    },
];
