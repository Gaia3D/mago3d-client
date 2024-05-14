import * as mgrs from "mgrs";

export const DMtoDD = (longitude: number[], latitude: number[]): number[] => {
  const x = longitude[0] + longitude[1] / 60;
  const y = latitude[0] + latitude[1] / 60;

  return [x, y];
};

export const DMStoDD = (longitude: number[], latitude: number[]): number[] => {
  const x = longitude[0] + longitude[1] / 60 + longitude[2] / 3600;
  const y = latitude[0] + latitude[1] / 60 + latitude[2] / 3600;

  return [x, y];
};

export const MGRStoDD = (MGRS: string) => {
  const x = mgrs.toPoint(MGRS)[0];
  const y = mgrs.toPoint(MGRS)[1];

  return [x, y];
};
