import {AsideDisplayProps} from "@/components/aside/AsidePanel.tsx";
import {useTranslation} from "react-i18next";
import React, {useEffect, useRef, useState} from "react";
import SideCloseButton from "@/components/SideCloseButton.tsx";
import * as Cesium from "cesium";
import {useGlobeController} from "@/components/providers/GlobeControllerProvider.tsx";

interface Layer {
	name: string;
}

interface LayersData {
	caseName: String,
	bbox: number[];
	layers: Layer[];
}

const layers: LayersData = {
	caseName: "case1",
	bbox: [128.50346152791604, 36.920895731886915, 128.50866714496195, 36.92837484674791],
	layers: [
		{ name: "mago3d:0" },
		{ name: "mago3d:15" },
		{ name: "mago3d:30" },
		{ name: "mago3d:45" },
		{ name: "mago3d:60" },
		{ name: "mago3d:75" },
		{ name: "mago3d:90" },
		{ name: "mago3d:105" },
		{ name: "mago3d:120" },
		{ name: "mago3d:135" },
		{ name: "mago3d:150" },
		{ name: "mago3d:165" }
	]
};

export const AsideSimulation: React.FC<AsideDisplayProps> = ({ display }) => {
	const {t} = useTranslation();
	const {initialized, globeController} = useGlobeController();
	const viewer = globeController?.viewer;

	const [selectedCase, setSelectedCase] = useState<string>("");
	const [selectedInterval, setSelectedInterval] = useState<number>(500);
	const [simulationLayers, setSimulationLayers] = useState<Cesium.ImageryLayer[]>([]);

	const intervalRef = useRef<number | null>(null);

	const selectCase = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedCase(e.target.value);
	};

	useEffect(() => {
		console.log(`Selected value changed: ${selectedCase}`);

		// Reset simulation layers and reload new case
		removeLayers();

		if (!selectedCase) return;
		zoomToExtent(selectedCase);
		//addLayers(selectedCase);

	}, [selectedCase]); // selectedValue가 변경될 때 실행됨

	const selectInterval = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedInterval(parseInt(e.target.value));
	};

	useEffect(() => {
		console.log(`Selected interval changed: ${selectedInterval}`);
		stopSimulation();
	},	[selectedInterval]);

	useEffect(() => {
		console.log("Simulation layers changed.");
		revealLayers();
	}, [simulationLayers]);

	const addLayers = (caseName: string) => {
		const caseLayers = layers.caseName === caseName ? layers.layers : [];
		if (!caseLayers || !initialized) return;

		const imageryLayers = viewer?.scene.imageryLayers;
		if (!imageryLayers) return;

		const newLayers = caseLayers.map(layer => {
			const imageryLayer = createImageryLayer(layer);
			imageryLayers.add(imageryLayer);
			return imageryLayer;
		});
		setSimulationLayers(newLayers);
		console.log("All layers loaded.");
	};

	const removeLayers = () => {
		if (!viewer) return;
		const imageryLayers = viewer?.scene.imageryLayers;
		if (!imageryLayers) return;

		simulationLayers.forEach(layer => {
			imageryLayers.remove(layer);
		});
		setSimulationLayers([]);
		console.log("All layers removed.");
	};

	const revealLayers = () => {
		if (!initialized || simulationLayers.length === 0) return;
		let index = 0;

		// 기존 인터벌이 실행 중이라면 정리
		if (intervalRef.current !== null) {
			clearInterval(intervalRef.current);
		}

		intervalRef.current = setInterval(() => {
			if (index > 0) {
				simulationLayers[index - 1].show = false; // 이전 레이어 숨김
			}
			if (index < simulationLayers.length) {
				simulationLayers[index].show = true; // 현재 레이어 표시
				index++;
			} else {
				clearInterval(intervalRef.current!); // 모든 레이어 표시 후 종료
				intervalRef.current = null;
				console.log("All layers displayed.");
			}
			//}, 1000); // 1초 간격으로 변경
		}, selectedInterval); // 0.5초 간격으로 변경
	}

	const zoomToExtent = (caseName: string) => {
		const caseData = layers.caseName === caseName ? layers : undefined;
		if (!caseData || !initialized) return;

		const rectangle = Cesium.Rectangle.fromDegrees(...caseData.bbox);
		viewer?.camera.flyTo({
			destination: rectangle,
			duration: 2
		});
	};

	const createImageryLayer = (layer: Layer) => {
		return new Cesium.ImageryLayer(
			new Cesium.WebMapServiceImageryProvider({
				url: import.meta.env.VITE_GEOSERVER_WMS_SERVICE_URL,
				layers: layer.name,
				minimumLevel: 0,
				parameters: {
					service: "WMS",
					version: "1.1.1",
					request: "GetMap",
					transparent: "true",
					format: "image/png",
					tiled: true,
				}
			}),
			{ show: false }
		);
	};

	const startSimulation = () => {
		removeLayers();
		addLayers(selectedCase);
	}

	const stopSimulation = () => {
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}
		removeLayers();
	};

	return (
		<div className={`side-bar-wrapper ${display ? "on" : "off"}`}>
			<input type="checkbox" id="toggleButton"/>
			<div className="side-bar simulation">
				<div className="side-bar-header">
					<SideCloseButton/>
				</div>
				<div className="content--wrapper">
					<div className="simulation-list">
						<label>대상지역</label>
						<select className="custom-select" id="simulationAreaSelectBox" value={selectedCase} onChange={selectCase}>
							<option value="">시뮬레이션 지역 선택</option>
							<option value="case1">경상북도 영주시 풍기읍 삼가리 산 22-1임 일대</option>
							<option value="case2">두번째</option>
							<option value="case3">세번째</option>
						</select>
					</div>
					<div className="simulation-list">
						<label>간격</label>
						<select className="custom-select" id="simulationIntervalSelectBox" value={selectedInterval} onChange={selectInterval}>
							<option value="500">0.5초</option>
							<option value="1000">1초</option>
							<option value="3000">3초</option>
							<option value="5000">5초</option>
						</select>	
					</div>				
					<div>
						<button type="button" className="button-simulation play" onClick={startSimulation}>시뮬레이션 시작</button>		
						<button type="button" className="button-simulation end" onClick={stopSimulation}>시뮬레이션 종료</button>				
					</div>
				</div>
			</div>
		</div>
	);
};