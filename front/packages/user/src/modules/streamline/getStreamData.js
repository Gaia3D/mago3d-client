import {makeAxisLines} from "@/modules/streamline/makeAxisLines.js";

const loadText = async (filePath) => {
    const response = await fetch(filePath);
    if (!response.ok) throw new Error(`Failed to load file: ${response.statusText}`);
    const text = await response.text();
    if (!text) throw new Error('Empty response');
    return JSON.parse(text);
};

const getStreamData = async (streamUrl) => {
    const json = await loadText(streamUrl);
    return {
        dimensions: {
            lon: json.dimensions[0],
            lat: json.dimensions[1],
            lev: json.dimensions[2],
        },
        boundary: {
            lon: json.boundaryLon,
            lat: json.boundaryLat,
            lev: json.boundaryAlt,
        },
        altitudesOfLevel: json.altitudesOfLevel,
        UVW0: [
            new Float32Array(json.U0),
            new Float32Array(json.V0),
            new Float32Array(json.W0),
        ],
        UVW1: [
            new Float32Array(json.U1),
            new Float32Array(json.V1),
            new Float32Array(json.W1),
        ],
        UVW2: [
            new Float32Array(json.U2),
            new Float32Array(json.V2),
            new Float32Array(json.W2),
        ],
        valueRange: {
            U: json.URange,
            V: json.VRange,
            W: json.WRange,
        }
    }
}

export const getWindData = async (verticalScale) => {
    const data = await getStreamData("/txt/stream_bangkok.txt");

    // verticalScale 적용 및 변환 작업 통합
    const scaledLev = data.boundary.lev.map(v => v ? v * verticalScale : 0);
    const scaledAltitudesOfLevel = data.altitudesOfLevel.map(v => v ? v * verticalScale : 0);
    const scaledUVW = [
        data.UVW0[2].map(v => v ? v * verticalScale : 0),
        data.UVW1[2].map(v => v ? v * verticalScale : 0),
        data.UVW2[2].map(v => v ? v * verticalScale : 0)
    ];

    // axis 생성 및 상태 업데이트
    const newAxes = scaledAltitudesOfLevel.slice(0, -1).map((altitude, i) => {
        return makeAxisLines(
            data.boundary.lon[0], data.boundary.lat[0], scaledAltitudesOfLevel[i],
            data.boundary.lon[1], data.boundary.lat[1], scaledAltitudesOfLevel[i + 1],
            1, 1, 1
        );
    });

    // 상태에 데이터와 축을 설정
    const newWindData = { ...data, boundary: { ...data.boundary, lev: scaledLev }, altitudesOfLevel: scaledAltitudesOfLevel, UVW0: [data.UVW0[0], data.UVW0[1], scaledUVW[0]], UVW1: [data.UVW1[0], data.UVW1[1], scaledUVW[1]], UVW2: [data.UVW2[0], data.UVW2[1], scaledUVW[2]] }

    return {
        newWindData,
        newAxes
    }
};