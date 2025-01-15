import {setPersonView} from "@/components/tool/actions/setPersonView.ts";
import {setIndoorView} from "@/components/tool/actions/setIndoorView.ts";
import {setLocationView} from "@/components/tool/actions/setLocationView.ts";
import {setAxisView} from "@/components/tool/actions/setAxisView.ts";
import {showCameraInfo} from "@/components/tool/actions/showCameraInfo.ts";
import {measureLocation} from "@/components/tool/actions/measureLocation.ts";
import {measureLength} from "@/components/tool/actions/measureLength.ts";
import {measureArea} from "@/components/tool/actions/measureArea.ts";
import {measureAngle} from "@/components/tool/actions/measureAngle.ts";
import {measureComplexDistance} from "@/components/tool/actions/measureComplexDistance.ts";
import {measureRadius} from "@/components/tool/actions/measureRadius.ts";
import {selectObject} from "@/components/tool/actions/selectObject.ts";
import {showTemperature} from "@/components/tool/actions/showTemperature.ts";
import {showWind} from "@/components/tool/actions/showWind.ts";
import {configureTerrain} from "@/components/tool/actions/configureTerrain.ts";
import {setTerrainTransparency} from "@/components/tool/actions/setTerrainTransparency.ts";
import {toggleFullScreen} from "@/components/tool/actions/toggleFullScreen.ts";
import {configureTime} from "@/components/tool/actions/configureTime.ts";
import {zoomIn} from "@/components/tool/actions/zoomIn.ts";
import {zoomOut} from "@/components/tool/actions/zoomOut.ts";
import {GlobeController} from "@/api/GlobeController.ts";

export const createToolActions = (globeController: GlobeController): Record<string, () => void> => ({
    "set-person-view": () => setPersonView(globeController),
    "set-indoor-view": () => setIndoorView(globeController),
    "set-location-view": () => setLocationView(globeController),
    "set-axis-view": () => setAxisView(globeController),
    "show-camera-info": () => showCameraInfo(globeController),
    "measure-location": () => measureLocation(globeController),
    "measure-length": () => measureLength(globeController),
    "measure-area": () => measureArea(globeController),
    "measure-angle": () => measureAngle(globeController),
    "measure-complex-distance": () => measureComplexDistance(globeController),
    "measure-radius": () => measureRadius(globeController),
    "select-object": () => selectObject(globeController),
    "show-temperature": () => showTemperature(globeController),
    "show-wind": () => showWind(globeController),
    "configure-terrain": () => configureTerrain(globeController),
    "set-terrain-transparency": () => setTerrainTransparency(globeController),
    "toggle-full-screen": () => toggleFullScreen(globeController),
    "configure-time": () => configureTime(globeController),
    "zoom-in": () => zoomIn(globeController),
    "zoom-out": () => zoomOut(globeController),
});

export const TOOL_IDS = [
    "set-person-view",
    "set-indoor-view",
    "set-location-view",
    "set-axis-view",
    "show-camera-info",
    "measure-location",
    "measure-length",
    "measure-area",
    "measure-angle",
    "measure-complex-distance",
    "measure-radius",
    "select-object",
    "show-temperature",
    "show-wind",
    "configure-terrain",
    "set-terrain-transparency",
    "toggle-full-screen",
    "configure-time",
    "zoom-in",
    "zoom-out",
];