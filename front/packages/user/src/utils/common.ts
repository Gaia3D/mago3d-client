import * as Cesium from "cesium";

// 헥스 색상 문자열을 Cesium.Color로 변환해주는 유틸리티 함수
export const hexToCesiumColor = (hex: string, alpha = 1.0): Cesium.Color => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    return new Cesium.Color(r, g, b, alpha);
}

// 정규식 방식 URL 검증
export const isURL = (text: string): boolean => {
    if (!text) return false;
    return /^https?:\/\//i.test(text.trim());
};