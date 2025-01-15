import * as Cesium from "cesium";

export const toggleFullScreen = () => {
    if (!Cesium.Fullscreen.enabled) {
        alert('전체화면이 지원되지 않습니다.');
        return;
    }
    if (!Cesium.Fullscreen.fullscreen) {
        Cesium.Fullscreen.requestFullscreen(document.querySelector('#container'));
    } else {
        Cesium.Fullscreen.exitFullscreen();
    }
}
