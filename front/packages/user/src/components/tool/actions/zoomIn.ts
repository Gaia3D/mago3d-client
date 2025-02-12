import { GlobeController } from "@/api/GlobeController";

export const zoomIn = (globeController: GlobeController) => {
    const { viewer } = globeController;
    if (!viewer) return;

    // 카메라의 현재 고도를 가져옴
    const currentAltitude = viewer.camera.positionCartographic.height;

    // 고도가 50m 이하라면 알림을 띄우고 동작 중지
    if (currentAltitude < 50) {
        alert("현재 고도가 너무 낮아 더 이상 줌인할 수 없습니다.");
        return;
    }

    // 고도에 따라 줌인 수치 조정
    const zoomDistance = currentAltitude * 0.3; // 고도의 10%만큼 줌인
    viewer.camera.zoomIn(zoomDistance);
};
