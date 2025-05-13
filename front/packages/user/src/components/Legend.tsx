import LegendContent from "@/components/LegendContent.tsx";

const Legend = () => {

	// le: x <=
	// gt: x >
	// lt: x <
	// ge: x >=
	const attributeData1 = {
		name: "유출량",
		unit: "mm/yr",
		attribute: "Qlat_mm",
		rules: [
			{
				rule: { gt: null, ge: null, lt: "450", le: null, eq: null },
				style: {
					polygon: {
						fillColor: "#FFFF80",
						strokeColor: "#9A9AA3",
						strokeWidth: 1,
					},
				},
				alias: "< 450",
			},
			{
				rule: { gt: null, ge: "450", lt: "550", le: null, eq: null },
				style: {
					polygon: {
						fillColor: "#71EB2F",
						strokeColor: "#9A9AA3",
						strokeWidth: 1,
					},
				},
				alias: "450 - 550",
			},
			{
				rule: { gt: null, ge: "550", lt: "650", le: null, eq: null },
				style: {
					polygon: {
						fillColor: "#3DB868",
						strokeColor: "#9A9AA3",
						strokeWidth: 1,
					},
				},
				alias: "550 - 650",
			},
			{
				rule: { gt: null, ge: "650", lt: "750", le: null, eq: null },
				style: {
					polygon: {
						fillColor: "#216E9E",
						strokeColor: "#9A9AA3",
						strokeWidth: 1,
					},
				},
				alias: "650 - 750",
			},
			{
				rule: { gt: null, ge: "750", lt: "1227", le: null, eq: null },
				style: {
					polygon: {
						fillColor: "#0C1078",
						strokeColor: "#9A9AA3",
						strokeWidth: 1,
					},
				},
				alias: "750 - 1227",
			},
		],
	};
	const attributeData2 = {
		name: "토양수분함량",
		unit: "m3/m3",
		attribute: "smc1",
		rules: [
			{
				rule: { gt: null, ge: null, lt: "0.25", le: null, eq: null },
				style: {
					polygon: {
						fillColor: "#FF0000", // 빨강
						strokeColor: "#9A9AA3",
						strokeWidth: 1,
					},
				},
				alias: "< 0.25",
			},
			{
				rule: { gt: null, ge: "0.25", lt: "0.28", le: null, eq: null },
				style: {
					polygon: {
						fillColor: "#FFD700", // 노랑
						strokeColor: "#9A9AA3",
						strokeWidth: 1,
					},
				},
				alias: "0.25 - 0.28",
			},
			{
				rule: { gt: null, ge: "0.28", lt: "0.30", le: null, eq: null },
				style: {
					polygon: {
						fillColor: "#98FB98", // 연두
						strokeColor: "#9A9AA3",
						strokeWidth: 1,
					},
				},
				alias: "0.28 - 0.30",
			},
			{
				rule: { gt: null, ge: "0.30", lt: "0.33", le: null, eq: null },
				style: {
					polygon: {
						fillColor: "#00BFFF", // 하늘색
						strokeColor: "#9A9AA3",
						strokeWidth: 1,
					},
				},
				alias: "0.30 - 0.33",
			},
			{
				rule: { gt: null, ge: "0.33", lt: null, le: null, eq: null },
				style: {
					polygon: {
						fillColor: "#0000FF", // 파랑
						strokeColor: "#9A9AA3",
						strokeWidth: 1,
					},
				},
				alias: ">= 0.33",
			},
		],
	};
	const attributeData3 = {
		name: "계곡유형구분",
		unit: "",
		attribute: "dry_class",
		rules: [
			{
				rule: {
					eq: "상시계곡",
					le: null,
					lt: null,
					gt: null,
					ge: null,
				},
				style: {
					polygon: {
						fillColor: "#87CEFA", // 연한 파랑 (하늘색)
						strokeColor: "#9A9AA3",
						strokeWidth: 1,
					},
				},
				alias: "상시계곡",
			},
			{
				rule: {
					eq: "간헐계곡",
					le: null,
					lt: null,
					gt: null,
					ge: null,
				},
				style: {
					polygon: {
						fillColor: "#FFFF99", // 연한 노랑
						strokeColor: "#9A9AA3",
						strokeWidth: 1,
					},
				},
				alias: "간헐계곡",
			},
			{
				rule: {
					eq: "일시계곡",
					le: null,
					lt: null,
					gt: null,
					ge: null,
				},
				style: {
					polygon: {
						fillColor: "#FF9999", // 연한 빨강
						strokeColor: "#9A9AA3",
						strokeWidth: 1,
					},
				},
				alias: "일시계곡",
			},
		],
	};
	const attributeData4 = {
		name: "기여율",
		unit: "%",
		attribute: "contributionRate",
		rules: [
			{
				rule: { gt: null, ge: null, lt: "0.5", le: null, eq: null },
				style: {
					polygon: {
						fillColor: "#FFFF80", // 1단계 색상
						strokeColor: "#9A9AA3",
						strokeWidth: 1,
					},
				},
				alias: "< 0.5",
			},
			{
				rule: { gt: null, ge: "0.5", lt: "1.0", le: null, eq: null },
				style: {
					polygon: {
						fillColor: "#71EB2F", // 2단계 색상
						strokeColor: "#9A9AA3",
						strokeWidth: 1,
					},
				},
				alias: "0.5 - 1.0",
			},
			{
				rule: { gt: null, ge: "1.0", lt: "1.5", le: null, eq: null },
				style: {
					polygon: {
						fillColor: "#3DB868", // 3단계 색상
						strokeColor: "#9A9AA3",
						strokeWidth: 1,
					},
				},
				alias: "1.0 - 1.5",
			},
			{
				rule: { gt: null, ge: "1.5", lt: "2.0", le: null, eq: null },
				style: {
					polygon: {
						fillColor: "#216E9E", // 4단계 색상
						strokeColor: "#9A9AA3",
						strokeWidth: 1,
					},
				},
				alias: "1.5 - 2.0",
			},
			{
				rule: { gt: null, ge: "2.0", lt: null, le: null, eq: null },
				style: {
					polygon: {
						fillColor: "#0C1078", // 5단계 색상
						strokeColor: "#9A9AA3",
						strokeWidth: 1,
					},
				},
				alias: ">= 2.0",
			},
		],
	};
	const attributeData5 = {
		name: "유달시간",
		unit: "min",
		attribute: "tc_mean",
		rules: [
			{
				rule: { gt: null, ge: null, lt: "20", le: null, eq: null },
				style: {
					polygon: {
						fillColor: "#FF0000",
						strokeColor: "#9A9AA3",
						strokeWidth: 1,
					},
				},
				alias: "< 20",
			},
			{
				rule: { gt: null, ge: "20", lt: "30", le: null, eq: null },
				style: {
					polygon: {
						fillColor: "#FF6600",
						strokeColor: "#9A9AA3",
						strokeWidth: 1,
					},
				},
				alias: "20 - 30",
			},
			{
				rule: { gt: null, ge: "30", lt: "40", le: null, eq: null },
				style: {
					polygon: {
						fillColor: "#FF9900",
						strokeColor: "#9A9AA3",
						strokeWidth: 1,
					},
				},
				alias: "30 - 40",
			},
			{
				rule: { gt: null, ge: "40", lt: "50", le: null, eq: null },
				style: {
					polygon: {
						fillColor: "#FFCC00",
						strokeColor: "#9A9AA3",
						strokeWidth: 1,
					},
				},
				alias: "40 - 50",
			},
			{
				rule: { gt: null, ge: "50", lt: "60", le: null, eq: null },
				style: {
					polygon: {
						fillColor: "#FFDD00",
						strokeColor: "#9A9AA3",
						strokeWidth: 1,
					},
				},
				alias: "50 - 60",
			},
			{
				rule: { gt: null, ge: "60", lt: "70", le: null, eq: null },
				style: {
					polygon: {
						fillColor: "#FFFF00",
						strokeColor: "#9A9AA3",
						strokeWidth: 1,
					},
				},
				alias: "60 - 70",
			},
			{
				rule: { gt: null, ge: "70", lt: "80", le: null, eq: null },
				style: {
					polygon: {
						fillColor: "#FFFF66",
						strokeColor: "#9A9AA3",
						strokeWidth: 1,
					},
				},
				alias: "70 - 80",
			},
			{
				rule: { gt: null, ge: "80", lt: "90", le: null, eq: null },
				style: {
					polygon: {
						fillColor: "#CCFF33",
						strokeColor: "#9A9AA3",
						strokeWidth: 1,
					},
				},
				alias: "80 - 90",
			},
			{
				rule: { gt: null, ge: "90", lt: "100", le: null, eq: null },
				style: {
					polygon: {
						fillColor: "#99FF33",
						strokeColor: "#9A9AA3",
						strokeWidth: 1,
					},
				},
				alias: "90 - 100",
			},
			{
				rule: { gt: null, ge: "100", lt: "110", le: null, eq: null },
				style: {
					polygon: {
						fillColor: "#66FF33",
						strokeColor: "#9A9AA3",
						strokeWidth: 1,
					},
				},
				alias: "100 - 110",
			},
			{
				rule: { gt: null, ge: "110", lt: "120", le: null, eq: null },
				style: {
					polygon: {
						fillColor: "#33FF33",
						strokeColor: "#9A9AA3",
						strokeWidth: 1,
					},
				},
				alias: "110 - 120",
			}
		]
	};
	const attributeData6 = {
		name: "최대수심",
		unit: "m",
		attribute: "max_depth",
		rules: [
			{
				rule: { gt: null, ge: null, lt: "0.2", le: null, eq: null },
				style: {
					polygon: {
						fillColor: "#267300",  // 진녹색
						strokeColor: "#9A9AA3",
						strokeWidth: 1,
					},
				},
				alias: "< 0.2",
			},
			{
				rule: { gt: null, ge: "0.2", lt: "0.5", le: null, eq: null },
				style: {
					polygon: {
						fillColor: "#66CC00",  // 연녹색
						strokeColor: "#9A9AA3",
						strokeWidth: 1,
					},
				},
				alias: "0.2 - 0.5",
			},
			{
				rule: { gt: null, ge: "0.5", lt: "0.7", le: null, eq: null },
				style: {
					polygon: {
						fillColor: "#FFFF00",  // 노랑
						strokeColor: "#9A9AA3",
						strokeWidth: 1,
					},
				},
				alias: "0.5 - 0.7",
			},
			{
				rule: { gt: null, ge: "0.7", lt: "1.0", le: null, eq: null },
				style: {
					polygon: {
						fillColor: "#FF9900",  // 주황
						strokeColor: "#9A9AA3",
						strokeWidth: 1,
					},
				},
				alias: "0.7 - 1.0",
			},
			{
				rule: { gt: "1.0", ge: null, lt: null, le: null, eq: null },
				style: {
					polygon: {
						fillColor: "#FF0000",  // 빨강
						strokeColor: "#9A9AA3",
						strokeWidth: 1,
					},
				},
				alias: ">= 1.0",
			}
		]
	};

	return (
		<div className="pop-layer-legend">
			<div className="pop-layer-legend-content">
				<p>산사태위험지도</p>
				<div className="pop-layer-legend-wrap">
					{/*<img
						src={`${import.meta.env.VITE_GEOSERVER_WMS_SERVICE_URL}REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&LAYER=mago3d:산사태위험도`}
						alt="산사태위험지도"/>*/}
					<div className="legend-item">
						<div className="color-box red"></div>
						<span>1등급</span>
					</div>
					<div className="legend-item">
						<div className="color-box yellow"></div>
						<span>2등급</span>
					</div>
					<div className="legend-item">
						<div className="color-box light-green"></div>
						<span>3등급</span>
					</div>
					<div className="legend-item">
						<div className="color-box sky-blue"></div>
						<span>4등급</span>
					</div>
					<div className="legend-item">
						<div className="color-box blue"></div>
						<span>5등급</span>
					</div>
				</div>
			</div>
			<div className="pop-layer-legend-content">
				<p>토석류피해예측지도</p>
				<div className="pop-layer-legend-wrap">
					{/*<img
						src={`${import.meta.env.VITE_GEOSERVER_WMS_SERVICE_URL}REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&LAYER=mago3d:debris_flow`}
						alt="토석류피해예측지도"/>*/}
					<div className="legend-item">
						<div className="color-box brown"></div>
						<span>위험지역</span>
					</div>
					<div className="legend-item">
						<div className="color-box bright-yellow"></div>
						<span>예측 지역</span>
					</div>
				</div>
			</div>
			<LegendContent attributeData={attributeData1} />
			<LegendContent attributeData={attributeData2} />
			<LegendContent attributeData={attributeData3} />
			<LegendContent attributeData={attributeData4} />
			<LegendContent attributeData={attributeData5} />
			<LegendContent attributeData={attributeData6} />
		</div>
	);
};
export default Legend;