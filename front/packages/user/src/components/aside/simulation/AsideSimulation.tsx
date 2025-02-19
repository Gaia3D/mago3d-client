import { AsideDisplayProps } from "@/components/aside/AsidePanel.tsx";
import { useEffect, useRef, useState } from "react";
import SideCloseButton from "@/components/SideCloseButton.tsx";
import * as Cesium from "cesium";
import { useGlobeController } from "@/components/providers/GlobeControllerProvider.tsx";

interface LayersData {
	caseName: string;
	bbox: number[];
	layerName: string;
	interval: number;
	min: number;
	max: number;
}

const layers: LayersData[] = [
	{
		caseName: "case1",
		bbox: [128.50346152791604, 36.920895731886915, 128.50866714496195, 36.92837484674791],
		layerName: "mago3d:landslide_15s",
		interval: 15,
		min: 0,
		max: 165,
	},
	{
		caseName: "case2",
		bbox: [128.50346152790988, 36.92089576802598, 128.50866714495575, 36.92837488289546],
		layerName: "mago3d:landslide_1s",
		interval: 1,
		min: 0,
		max: 165,
	},
];

export const AsideSimulation: React.FC<AsideDisplayProps> = ({ display }) => {
	const { globeController } = useGlobeController();
	const viewer = globeController?.viewer;

	const [simulationActive, setSimulationActive] = useState(false);
	const [selectedLayer, setSelectedLayer] = useState<LayersData | null>(null);
	const [selectedInterval, setSelectedInterval] = useState<number>(500);

	const simulationRef = useRef<number | null>(null);
	const cqlIndexRef = useRef<number>(0);
	const imageryLayersRef = useRef<Cesium.ImageryLayer[]>([]);
	const layerCache = useRef(new Map<string, Cesium.ImageryLayer>());

	useEffect(() => {
		stopSimulation();
		if (selectedLayer?.bbox) {
			zoomToExtent(selectedLayer.bbox);
		}
	}, [selectedLayer]);

	const selectLayer = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedLayer(layers.find((layer) => layer.caseName === e.target.value) || null);
	};

	const getOrCreateImageryLayer = (layerName: string, cqlFilter: string) => {
		if (!selectedLayer) return;
		const layerKey = `${layerName}-${cqlFilter}`;
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
		if (!viewer || !selectedLayer) {
			alert("대상지역을 선택해주세요.");
			return;
		}
		stopSimulation();
		setSimulationActive(true);
		const imageryLayers = viewer.imageryLayers;
		const cqlFilters: string[] = [];
		for (let i = 0; i < selectedLayer.max; i+=selectedLayer.interval) {
			cqlFilters.push(`location='${i}.tif'`);
		}

		simulationRef.current = window.setInterval(() => {
			const cqlFilter = cqlFilters[cqlIndexRef.current];
			const layer = getOrCreateImageryLayer(selectedLayer.layerName, cqlFilter);
			if (!layer) return;

			if (!imageryLayers.contains(layer)) {
				imageryLayers.add(layer);
				imageryLayersRef.current.push(layer);
			}

			layer.show = true;
			fadeLayer(layer);
			cqlIndexRef.current = (cqlIndexRef.current + 1) % cqlFilters.length;
		}, selectedInterval);
	};

	const fadeLayer = (layer: Cesium.ImageryLayer) => {
		let alpha = 0;

		const fadeIn = () => {
			if (alpha >= 1) {
				setTimeout(fadeOut, selectedInterval);
				return;
			}
			layer.alpha = alpha += 0.005;
			requestAnimationFrame(fadeIn);
		};

		const fadeOut = () => {
			if (alpha <= 0) {
				layer.show = false;
				return;
			}
			layer.alpha = alpha -= 0.005;
			requestAnimationFrame(fadeOut);
		};

		fadeIn();
	};

	const stopSimulation = () => {
		setSimulationActive(false);
		if (simulationRef.current) {
			clearInterval(simulationRef.current);
			if (viewer) {
				const imageryLayers = viewer.imageryLayers;
				imageryLayersRef.current.forEach(layer => imageryLayers.remove(layer));
				imageryLayersRef.current = [];
			}
		}
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
								value={selectedLayer?.caseName || ""}
								onChange={selectLayer}>
							<option value="" hidden>시뮬레이션 지역 선택</option>
							<option value="case1">산사태 15초(경북 영주 풍기읍 삼가리 산 22-1임 일대)</option>
							<option value="case2">산사태 1초(경북 영주 풍기읍 삼가리 산 22-1임 일대)</option>
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
								<button type="button" className="button-simulation play" onClick={startSimulation}>시뮬레이션
									시작
								</button>
								:
								<button type="button" className="button-simulation end" onClick={stopSimulation}>시뮬레이션
									종료
								</button>
						}

					</div>
				</div>
			</div>
		</div>
	);
};
