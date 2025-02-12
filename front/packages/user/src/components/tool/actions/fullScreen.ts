import * as Cesium from "cesium";

// 전체화면 켜기
export const enterFullScreen = () => {
    if (!Cesium.Fullscreen.enabled) {
        alert('전체화면이 지원되지 않습니다.');
        return;
    }
    Cesium.Fullscreen.requestFullscreen(document.querySelector('#container'));
};

// 전체화면 끄기
export const exitFullScreen = () => {
    if (Cesium.Fullscreen.fullscreen) {
        Cesium.Fullscreen.exitFullscreen();
    }
};
