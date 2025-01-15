import {GlobeController} from "@/api/GlobeController.ts";

export const zoomOut = (globeController: GlobeController) => {
    const { viewer } = globeController;
    if (!viewer) return;

    // 카메라의 현재 고도를 가져옴
    const currentAltitude = viewer.camera.positionCartographic.height;

    // 고도에 따라 줌인 수치 조정
    const zoomDistance = currentAltitude * 0.3; // 고도의 10%만큼 줌인
    viewer.camera.zoomOut(zoomDistance);
};
