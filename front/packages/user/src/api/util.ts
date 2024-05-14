import * as Cesium from 'cesium';

export const arrayBufferToBase64 = (arrayBuffer:ArrayBuffer) => {
    const binary = new Uint8Array(arrayBuffer);
    
    const base64 = btoa(String.fromCharCode(...binary));
    return base64;
}

export const cartographicToWkt = (cartographic:Cesium.Cartographic) => {
    return `POINT(${Cesium.Math.toDegrees(cartographic.longitude)} ${Cesium.Math.toDegrees(cartographic.latitude)} ${cartographic.height})`;
}

export const cartesianToDegrees = (cartesian:Cesium.Cartesian3) => {
    const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
    return {
        longitude: Cesium.Math.toDegrees(cartographic.longitude),
        latitude: Cesium.Math.toDegrees(cartographic.latitude),
        height: cartographic.height
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isFalsy = (value:any) => {
    return value === undefined || value === null;
}

function getClassJenks(data: number[], numClasses: number): number[] {
  // 데이터를 오름차순으로 정렬합니다.
  const sortedData = [...data].sort((a, b) => a - b);

  // 경계값을 저장할 배열을 초기화합니다.
  const jenksBounds: number[] = [];

  // 각 클래스의 경계값을 계산합니다.
  if (numClasses > 1 && sortedData.length > 1) {
      // 클래스 간격을 구합니다.
      const classInterval = sortedData.length / numClasses;

      // 클래스 경계값을 구합니다.
      for (let i = 1; i < numClasses; i++) {
          const index = Math.round(i * classInterval) - 1;
          jenksBounds.push(sortedData[index]);
      }
  }

  return jenksBounds;
}

export const getClassBreaks = (data: number[], refLength:number): number[] => {
  if (data.length === 0 || refLength <= 0) {
      throw new Error('Invalid input data or number of classes.');
  }

  // 배열의 최솟값과 최댓값 계산
  const minValue = Math.min(...data);
  const maxValue = Math.max(...data);

  let breaks;
  if (minValue !== maxValue) {
    breaks = getClassJenks(data, refLength);
  } else {
    breaks = [minValue, maxValue];
  }

  breaks[0] = minValue - 0.1;
  breaks[breaks.length - 1] = maxValue + 0.1;

  return breaks;
}
export const getClassIndex = (value: number, breaks: number[]): number => {
  // 주어진 숫자가 어떤 클래스에 속하는지 확인
  let index = 0;
  for (let i = 0; i < breaks.length; i++) {
      if (value >= breaks[i] && value < breaks[i + 1]) {
          index = i;
          break;
      }
  }

  return index;
}

export const colorsYlorrd = ['#ffffb2', '#fecc5c', '#fd8d3c', '#f03b20', '#bd0026'];
export const sizesYlorrd = [7, 10, 13, 16, 20];

export const randomColor = ():string => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export const isColorUnique = (color: string, colors: string[]):boolean => {
  return colors.indexOf(color) === -1;
}

export const generateUniqueColors = (numColors: number): string[] => {
  const uniqueColors: string[] = [];
  while (uniqueColors.length < numColors) {
      const color: string = randomColor();
      if (isColorUnique(color, uniqueColors)) {
          uniqueColors.push(color);
      }
  }
  return uniqueColors;
}

const colorsReds = ['#ffc3be', '#ff9c97', '#fe6b6b', '#e61d25', '#a01319'];
const colorsYellows = ['#fff9c5', '#ffee57', '#ffe200', '#ffaf00', '#ec9200'];
const colorsGreens = ['#bdffa6', '#6eff57', '#2fea00', '#00cb00', '#008100'];
const colorsMagentas = ['#ffcfea', '#ff78c3', '#fe41aa', '#e4007f', '#a2005a'];
const colorsBlues = ['#b7beff', '#7d8aff', '#394dff', '#0019ff', '#0011ac'];
const colorsGreys = ['#f7f7f7', '#cccccc', '#969696', '#636363', '#252525'];
const colorsRainbows1 = ['#2f86b9', '#8cc7a9', '#fff7b6', '#f58d52', '#d81e1e'];
const colorsRainbows2 = ['#0000fa', '#00b860', '#fdd306', '#ff6a01', '#fc0101'];

export const choroplethColorList = [
  { value: colorsReds, title: '빨강계열 색상램프' },
  { value: colorsYellows, title: '노랑계열 색상램프' },
  { value: colorsGreens, title: '녹색계열 색상램프' },
  { value: colorsMagentas, title: '마젠타계열 색상램프' },
  { value: colorsBlues, title: '파랑계열 색상램프' },
  { value: colorsGreys, title: '회색계열 색상램프' },
  { value: colorsRainbows1, title: '무지개계열 색상램프1' },
  { value: colorsRainbows2, title: '무지개계열 색상램프2' },
];