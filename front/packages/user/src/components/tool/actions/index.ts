import {GlobeController} from "@/api/GlobeController.ts";
import {createSetPersonView, removeSetPersonView} from "@/components/tool/actions/setPersonView.ts";
import {zoomIn} from "@/components/tool/actions/zoomIn.ts";
import {zoomOut} from "@/components/tool/actions/zoomOut.ts";
import {toggleFullScreen} from "@/components/tool/actions/toggleFullScreen.ts";
import {createSetIndoorView, removeSetIndoorView} from "@/components/tool/actions/setIndoorView.ts";
import {createSetLocationView, removeSetLocationView} from "@/components/tool/actions/setLocationView.ts";

export const createToolActions = (globeController: GlobeController): Record<string, () => void> => ({
    "set-person-view": () => createSetPersonView(globeController),
    "set-indoor-view": () => createSetIndoorView(globeController),
    "set-location-view": () => createSetLocationView(globeController),
    "set-axis-view": () => createSetAxisView(globeController),
    "show-camera-info": () => createShowCameraInfo(globeController),
    "measure-location": () => createMeasureLocation(globeController),
    "measure-length": () => createMeasureLength(globeController),
    "measure-area": () => createMeasureArea(globeController),
    "measure-angle": () => createMeasureAngle(globeController),
    "measure-complex-distance": () => createMeasureComplexDistance(globeController),
    "measure-radius": () => createMeasureRadius(globeController),
    "select-object": () => createSelectObject(globeController),
    "show-temperature": () => createShowTemperature(globeController),
    "show-wind": () => createShowWind(globeController),
    "configure-terrain": () => createConfigureTerrain(globeController),
    "set-terrain-transparency": () => createSetTerrainTransparency(globeController),
    "toggle-full-screen": () => toggleFullScreen(),
    "configure-time": () => createConfigureTime(globeController),
    "zoom-in": () => zoomIn(globeController),
    "zoom-out": () => zoomOut(globeController),
});

export const removeToolActions = (globeController: GlobeController): Record<string, () => void> => ({
    "set-person-view": () => removeSetPersonView(globeController),
    "set-indoor-view": () => removeSetIndoorView(globeController),
    "set-location-view": () => removeSetLocationView(),
    "set-axis-view": () => removeSetAxisView(globeController),
    "show-camera-info": () => removeShowCameraInfo(globeController),
    "measure-location": () => removeMeasureLocation(globeController),
    "measure-length": () => removeMeasureLength(globeController),
    "measure-area": () => removeMeasureArea(globeController),
    "measure-angle": () => removeMeasureAngle(globeController),
    "measure-complex-distance": () => removeMeasureComplexDistance(globeController),
    "measure-radius": () => removeMeasureRadius(globeController),
    "select-object": () => removeSelectObject(globeController),
    "show-temperature": () => removeShowTemperature(globeController),
    "show-wind": () => removeShowWind(globeController),
    "configure-terrain": () => removeConfigureTerrain(globeController),
    "set-terrain-transparency": () => removeSetTerrainTransparency(globeController),
    "configure-time": () => removeConfigureTime(globeController),
})

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