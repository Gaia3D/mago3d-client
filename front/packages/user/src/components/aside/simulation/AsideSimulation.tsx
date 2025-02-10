import {AsideDisplayProps} from "@/components/aside/AsidePanel.tsx";
import {useTranslation} from "react-i18next";
import React from "react";
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

	let simulationLayers: Cesium.ImageryLayer[] = [];

	const selectCase = (e: React.ChangeEvent<HTMLSelectElement>) => {
		// Reset simulation layers and reload new case
		resetSimulationLayers();

		const selectedCase = e.target.value;
		if (!selectedCase) return;

		zoomToExtent(selectedCase);
		preloadLayers(selectedCase);
		revealLayers();
	};

	const resetSimulationLayers = () => {
		simulationLayers = [];
	};

	const zoomToExtent = (caseName: string) => {
		const caseData = layers.caseName === caseName ? layers : undefined;
		if (!caseData || !initialized) return;

		const rectangle = Cesium.Rectangle.fromDegrees(...caseData.bbox);
		viewer?.camera.flyTo({
			destination: rectangle,
			duration: 2
		});
	};

	const preloadLayers = (caseName: string) => {
		const caseLayers = layers.caseName === caseName ? layers.layers : [];
		if (!caseLayers || !initialized) return;

		const imageryLayers = viewer?.scene.imageryLayers;
		if (!imageryLayers) return;

		simulationLayers = caseLayers.map(layer => {
			const imageryLayer = createImageryLayer(layer);
			imageryLayers.add(imageryLayer);
			return imageryLayer;
		});
		console.log("All layers loaded.");
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

	const revealLayers = () => {
		if (!initialized || simulationLayers.length === 0) return;
		let index = 0;
		const interval = setInterval(() => {
			if (index > 0) {
				simulationLayers[index - 1].show = false; // 이전 레이어 숨김
			}
			if (index < simulationLayers.length) {
				simulationLayers[index].show = true; // 현재 레이어 표시
				index++;
			} else {
				clearInterval(interval); // 모든 레이어 표시 후 종료
				console.log("All layers displayed.");
			}
		}, 1000); // 1초 간격으로 변경
	}

	return (
		<div className={`side-bar-wrapper ${display ? "on" : "off"}`}>
			<input type="checkbox" id="toggleButton"/>
			<div className="side-bar">
				<div className="side-bar-header">
					<SideCloseButton/>
				</div>
				<div className="content--wrapper">
					<select className="select-bx" onChange={selectCase}>
						<option value="">시뮬레이션 케이스 선택</option>
						<option value="case1">경상북도 영주시 풍기읍 삼가리 산 22-1임 일대</option>
						<option value="case2">두번째</option>
						<option value="case3">세번째</option>
					</select>
				</div>
			</div>
		</div>
	);
};