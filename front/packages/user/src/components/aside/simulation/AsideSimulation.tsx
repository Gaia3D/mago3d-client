import { AsideDisplayProps } from "@/components/aside/AsidePanel.tsx";
import { useEffect, useRef, useState } from "react";
import SideCloseButton from "@/components/SideCloseButton.tsx";
import * as Cesium from "cesium";
import { useGlobeController } from "@/components/providers/GlobeControllerProvider.tsx";

interface LayersData {
	area: string;
	caseName: string;
	bbox: number[];
	layerName: string;
	interval: number;
	min: number;
	max: number;
}

const layers: LayersData[] = [
	{
		area: "yeongju_old",
		caseName: "case1",
		bbox: [128.50346152791604, 36.920895731886915, 128.50866714496195, 36.92837484674791],
		layerName: "mago3d:landslide_15s",
		interval: 15,
		min: 0,
		max: 165,
	},
	{
		area: "yeongju_old",
		caseName: "case2",
		bbox: [128.50346152790988, 36.92089576802598, 128.50866714495575, 36.92837488289546],
		layerName: "mago3d:landslide_1s",
		interval: 1,
		min: 0,
		max: 165,
	},
	{
		area: "yeongju_old",
		caseName: "case3",
		bbox: [128.50204047214558, 36.921778086241304, 128.50677110705257, 36.92821933386286],
		layerName: "mago3d:install_before",
		interval: 1,
		min: 0,
		max: 90,
	},
	{
		area: "yeongju_old",
		caseName: "case4",
		bbox: [128.50204047214558, 36.921778086241304, 128.50677110705257, 36.92821933386286],
		layerName: "mago3d:install_after",
		interval: 1,
		min: 0,
		max: 45,
	},
	{
		area: "mungyeong",
		caseName: "문경 산사태 15초",
		bbox: [128.287785646051, 36.7357969964742, 128.300576100319, 36.7489066237452],
		layerName: "mago3d:mungyeong_dem_debris_flow_15s",
		interval: 15,
		min: 0,
		max: 345,
	},
	{
		area: "mungyeong",
		caseName: "문경 산사태 1초",
		bbox: [128.287785646051, 36.7357969964742, 128.300576100319, 36.7489066237452],
		layerName: "mago3d:mungyeong_dem_debris_flow_1s",
		interval: 1,
		min: 0,
		max: 343,
	},
	{
		area: "yecheon",
		caseName: "예천 산사태 15초",
		bbox: [128.333941790794, 36.7206297051795, 128.348563756861, 36.7267268190991],
		layerName: "mago3d:yecheon_dem_debris_flow_15s",
		interval: 15,
		min: 0,
		max: 265,
	},
	{
		area: "yecheon",
		caseName: "예천 산사태 1초",
		bbox: [128.333941790794, 36.7206297051795, 128.348563756861, 36.7267268190991],
		layerName: "mago3d:yecheon_dem_debris_flow_1s",
		interval: 1,
		min: 0,
		max: 265,
	},
	{
		area: "yeongju",
		caseName: "영주 산사태 15초",
		bbox: [128.501730336362, 36.9203508745104, 128.51042373824, 36.9284453224585],
		layerName: "mago3d:yeongju_dem_debris_flow_15s",
		interval: 15,
		min: 0,
		max: 220,
	},
	{
		area: "yeongju",
		caseName: "영주 산사태 1초",
		bbox: [128.501730336362, 36.9203508745104, 128.51042373824, 36.9284453224585],
		layerName: "mago3d:yeongju_dem_debris_flow_1s",
		interval: 1,
		min: 0,
		max: 220,
	},
	{
		area: "mungyeong1",
		caseName: "사방댐 설치 전 15초",
		bbox: [128.297277926336, 36.7337326335169, 128.314279915863, 36.7478183589143],
		layerName: "mago3d:mungyeong1_install_before_15s",
		interval: 15,
		min: 0,
		max: 462,
	},
	{
		area: "mungyeong1",
		caseName: "사방댐 설치 전 1초",
		bbox: [128.297277926336, 36.7337326335169, 128.314279915863, 36.7478183589143],
		layerName: "mago3d:mungyeong1_install_before_1s",
		interval: 1,
		min: 0,
		max: 462,
	},
	{
		area: "mungyeong1",
		caseName: "문경1 사방댐 설치 후 15초",
		bbox: [128.297277926336, 36.7337326335169, 128.314279915863, 36.7478183589143],
		layerName: "mago3d:mungyeong1_install_after_15s",
		interval: 15,
		min: 0,
		max: 146,
	},
	{
		area: "mungyeong1",
		caseName: "문경1 사방댐 설치 후 1초",
		bbox: [128.297277926336, 36.7337326335169, 128.314279915863, 36.7478183589143],
		layerName: "mago3d:mungyeong1_install_after_1s",
		interval: 1,
		min: 0,
		max: 146,
	},
	{
		area: "mungyeong2",
		caseName: "문경2 사방댐 설치 전 15초",
		bbox: [128.297277926336, 36.7337326335169, 128.314279915863, 36.7478183589143],
		layerName: "mago3d:mungyeong2_install_before_15s",
		interval: 15,
		min: 0,
		max: 405,
	},
	{
		area: "mungyeong2",
		caseName: "문경2 사방댐 설치 전 1초",
		bbox: [128.297277926336, 36.7337326335169, 128.314279915863, 36.7478183589143],
		layerName: "mago3d:mungyeong2_install_before_1s",
		interval: 1,
		min: 0,
		max: 405,
	},
	{
		area: "mungyeong2",
		caseName: "문경2 사방댐 설치 후 15초",
		bbox: [128.297277926336, 36.7337326335169, 128.314279915863, 36.7478183589143],
		layerName: "mago3d:mungyeong2_install_after_15s",
		interval: 15,
		min: 0,
		max: 118,
	},
	{
		area: "mungyeong2",
		caseName: "문경2 사방댐 설치 후 1초",
		bbox: [128.297277926336, 36.7337326335169, 128.314279915863, 36.7478183589143],
		layerName: "mago3d:mungyeong2_install_after_1s",
		interval: 1,
		min: 0,
		max: 118,
	},
	{
		area: "yeongju1",
		caseName: "영주 사방댐 설치 전 15초",
		bbox: [128.501730336362, 36.9203508745104, 128.51042373824, 36.9284453224585],
		layerName: "mago3d:yeongju_install_before_15s",
		interval: 15,
		min: 0,
		max: 114,
	},
	{
		area: "yeongju1",
		caseName: "영주 사방댐 설치 전 1초",
		bbox: [128.501730336362, 36.9203508745104, 128.51042373824, 36.9284453224585],
		layerName: "mago3d:yeongju_install_before_1s",
		interval: 1,
		min: 0,
		max: 114,
	},
	{
		area: "yeongju1",
		caseName: "영주 사방댐 설치 후 15초",
		bbox: [128.501730336362, 36.9203508745104, 128.51042373824, 36.9284453224585],
		layerName: "mago3d:yeongju_install_after_15s",
		interval: 15,
		min: 0,
		max: 80,
	},
	{
		area: "yeongju1",
		caseName: "영주 사방댐 설치 후 1초",
		bbox: [128.501730336362, 36.9203508745104, 128.51042373824, 36.9284453224585],
		layerName: "mago3d:yeongju_install_after_1s",
		interval: 1,
		min: 0,
		max: 80,
	},
	{
		area: "yecheon1",
		caseName: "예천1 사방댐 설치 전 15초",
		bbox: [128.332934965207, 36.7217518043171, 128.348327542525, 36.7266375066683],
		layerName: "mago3d:yecheon1_install_before_15s",
		interval: 15,
		min: 0,
		max: 294,
	},
	{
		area: "yecheon1",
		caseName: "예천1 사방댐 설치 전 1초",
		bbox: [128.332934965207, 36.7217518043171, 128.348327542525, 36.7266375066683],
		layerName: "mago3d:yecheon1_install_before_1s",
		interval: 1,
		min: 0,
		max: 294,
	},
	{
		area: "yecheon1",
		caseName: "예천1 사방댐 설치 후 15초",
		bbox: [128.332934965207, 36.7217518043171, 128.348327542525, 36.7266375066683],
		layerName: "mago3d:yecheon1_install_after_15s",
		interval: 15,
		min: 0,
		max: 441,
	},
	{
		area: "yecheon1",
		caseName: "예천1 사방댐 설치 후 1초",
		bbox: [128.332934965207, 36.7217518043171, 128.348327542525, 36.7266375066683],
		layerName: "mago3d:yecheon1_install_after_1s",
		interval: 1,
		min: 0,
		max: 441,
	},
	{
		area: "yecheon2",
		caseName: "예천2 사방댐 설치 전 15초",
		bbox: [128.332934965207, 36.7217518043171, 128.348327542525, 36.7266375066683],
		layerName: "mago3d:yecheon1_install_before_15s",
		interval: 15,
		min: 0,
		max: 270,
	},
	{
		area: "yecheon2",
		caseName: "예천2 사방댐 설치 전 1초",
		bbox: [128.332934965207, 36.7217518043171, 128.348327542525, 36.7266375066683],
		layerName: "mago3d:yecheon1_install_before_1s",
		interval: 1,
		min: 0,
		max: 270,
	},
	{
		area: "yecheon2",
		caseName: "예천2 사방댐 설치 후 15초",
		bbox: [128.332934965207, 36.7217518043171, 128.348327542525, 36.7266375066683],
		layerName: "mago3d:yecheon1_install_after_15s",
		interval: 15,
		min: 0,
		max: 147,
	},
	{
		area: "yecheon2",
		caseName: "예천2 사방댐 설치 후 1초",
		bbox: [128.332934965207, 36.7217518043171, 128.348327542525, 36.7266375066683],
		layerName: "mago3d:yecheon1_install_after_1s",
		interval: 1,
		min: 0,
		max: 147,
	},
];

export const AsideSimulation: React.FC<AsideDisplayProps> = ({ display }) => {
	const { globeController } = useGlobeController();
	const viewer = globeController?.viewer;

	const [simulationActive, setSimulationActive] = useState(false);
	const [selectedArea, setSelectedArea] = useState<LayersData[] | null>(null);
	const [selectedLayer, setSelectedLayer] = useState<LayersData | null>(null);
	const [selectedInterval, setSelectedInterval] = useState<number>(500);

	const simulationRef = useRef<number | null>(null);
	const cqlIndexRef = useRef<number>(0);
	const imageryLayersRef = useRef<Cesium.ImageryLayer[]>([]);
	const layerCache = useRef(new Map<string, Cesium.ImageryLayer>());

	const selectArea = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedArea(layers.filter((layer) => layer.area === e.target.value));
	};

	useEffect(() => {
		stopSimulation();
		if (selectedArea && selectedArea.length > 0) {
			setSelectedLayer(selectedArea[0]);
		}
	}, [selectedArea]);

	const selectLayer = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedLayer(layers.find((layer) => layer.caseName === e.target.value) || null);
	};

	useEffect(() => {
		stopSimulation();
		if (selectedLayer?.bbox) {
			zoomToExtent(selectedLayer.bbox);
		}
	}, [selectedLayer]);

	const getOrCreateImageryLayer = (layerName: string, cqlFilter: string) => {
		if (!selectedLayer) return;

		const layerKey = `${layerName}-${cqlFilter}`;
		const existingLayer = layerCache.current.get(layerKey);

		if (existingLayer && existingLayer.isDestroyed?.()) {
			layerCache.current.delete(layerKey);
		}

		if (layerCache.current.has(layerKey)) {
			return layerCache.current.get(layerKey);
		}

		const newLayer = new Cesium.ImageryLayer(
			new Cesium.WebMapServiceImageryProvider({
				url: import.meta.env.VITE_GEOSERVER_WMS_SERVICE_URL,
				layers: layerName,
				minimumLevel: 0,
				rectangle: Cesium.Rectangle.fromDegrees(...selectedLayer.bbox),
				parameters: {
					service: "WMS",
					version: "1.1.1",
					request: "GetMap",
					transparent: "true",
					format: "image/png",
					tiled: true,
					CQL_FILTER: cqlFilter,
				},
			}),
			{ show: true, alpha: 0 }
		);

		newLayer.magnificationFilter = Cesium.TextureMagnificationFilter.NEAREST;
		newLayer.minificationFilter = Cesium.TextureMinificationFilter.NEAREST;
		layerCache.current.set(layerKey, newLayer);
		return newLayer;
	};

	const startSimulation = () => {
		if (!selectedInterval || !simulationRef) return;
		if (!viewer || !selectedLayer) {
			alert("대상지역을 선택해주세요.");
			return;
		}
		stopSimulation();
		setSimulationActive(true);
		const imageryLayers = viewer.imageryLayers;
		const cqlFilters: string[] = [];
		for (let i = 0; i < selectedLayer.max; i += selectedLayer.interval) {
			cqlFilters.push(`location='${i}.tif'`);
		}
		cqlFilters.push(`location='${selectedLayer.max}.tif'`);

		simulationRef.current = window.setInterval(() => {
			if (cqlIndexRef.current >= cqlFilters.length) {
				setTimeout(stopSimulation, 10000);
				return;
			}

			const cqlFilter = cqlFilters[cqlIndexRef.current];
			const layer = getOrCreateImageryLayer(selectedLayer.layerName, cqlFilter);
			if (!layer) return;

			if (!imageryLayers.contains(layer)) {
				imageryLayers.add(layer);
				imageryLayersRef.current.push(layer);
			}

			layer.show = true;
			fadeLayer(layer);
			cqlIndexRef.current = (cqlIndexRef.current + 1);
		}, selectedInterval);

	};

	const fadeLayer = (layer: Cesium.ImageryLayer) => {
		let alpha = 0;

		const fadeIn = () => {
			if (alpha >= 1) {
				setTimeout(fadeOut, selectedInterval);
				return;
			}
			//layer.alpha = alpha += 0.005;
			if (!selectedLayer?.max || selectedLayer?.interval) {
				layer.alpha = alpha += 0.005;
			} else {
				layer.alpha = alpha += 1 / ((selectedLayer?.max + 1) / selectedLayer?.interval);
			}
			requestAnimationFrame(fadeIn);
		};

		const fadeOut = () => {
			if (alpha <= 0) {
				layer.show = false;
				return;
			}
			//layer.alpha = alpha -= 0.005;
			if (!selectedLayer?.max || selectedLayer?.interval) {
				layer.alpha = alpha -= 0.005;
			} else {
				layer.alpha = alpha -= 1 / ((selectedLayer?.max + 1) / selectedLayer?.interval);
			}
			requestAnimationFrame(fadeOut);
		};

		fadeIn();
	};

	const stopSimulation = () => {
		setSimulationActive(false);

		if (simulationRef.current) {
			clearInterval(simulationRef.current);
			simulationRef.current = null;
		}

		if (viewer) {
			const imageryLayers = viewer.imageryLayers;

			imageryLayersRef.current.forEach((layer) => {
				if (imageryLayers.contains(layer)) {
					imageryLayers.remove(layer, true);
				}
			});

			imageryLayersRef.current = [];
		}

		cqlIndexRef.current = 0;
	};

	const zoomToExtent = (bbox: number[]) => {
		viewer?.camera.flyTo({ destination: Cesium.Rectangle.fromDegrees(...bbox), duration: 2 });
	};

	useEffect(() => {
		console.log("simulationActive", simulationActive);
	}, [simulationActive]);

	return (
		<div className={`side-bar-wrapper ${display ? "on" : "off"}`}>
			<div className="side-bar simulation">
				<div className="side-bar-header">
					<SideCloseButton />
				</div>
				<div className="content--wrapper">
					<div className="simulation-list">
						<label>대상지역</label>
						<select style={{width: "240px"}} className="custom-select" id="simulationAreaSelectBox"
										onChange={selectArea}>
							<option value="" hidden>대상지역 선택</option>
							<option value="mungyeong1">1 경상북도 문경시 동로면 수평리 산68임 일대</option>
							<option value="mungyeong2">2 경상북도 문경시 동로면 수평리 산68임 일대</option>
							<option value="yeongju1">1 경상북도 영주시 풍기읍 삼가리 산22-1임 일대</option>
							<option value="yecheon1">1 경상북도 예천군 용문면 사부리 산100임 일대</option>
							<option value="yecheon2">2 경상북도 예천군 용문면 사부리 산100임 일대</option>
						</select>
					</div>
					<div className="simulation-list">
						<label>모의실험</label>
						<select style={{width: "240px"}} className="custom-select" id="simulationSelectBox"
										value={selectedLayer?.caseName || ""}
										onChange={selectLayer}>
							{selectedArea && selectedArea.map((layer) => (
								<option key={layer.caseName} value={layer.caseName}>
									{layer.caseName}
								</option>
							))}
						</select>
					</div>
					<div className="simulation-list">
						<label>간격</label>
						<select className="custom-select" id="simulationIntervalSelectBox" value={selectedInterval}
										onChange={(e) => setSelectedInterval(Number(e.target.value))}>
							<option value={500}>0.5초</option>
							<option value={1000}>1초</option>
							<option value={3000}>3초</option>
							<option value={5000}>5초</option>
						</select>
					</div>
					<div>
						{
							!simulationActive ?
								<button type="button" className="button-simulation play" onClick={startSimulation}>시뮬레이션 시작</button>
								:
								<button type="button" className="button-simulation end" onClick={stopSimulation}>시뮬레이션 종료</button>
						}
					</div>
				</div>
			</div>
		</div>
	);
};
