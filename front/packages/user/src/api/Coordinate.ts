import * as mgrs from "mgrs";
import { immerable } from "immer";
import { DMStoDD, DMtoDD, MGRStoDD } from "./coordinateConverter";
import { Cartesian3, Cartographic, Math as CMath } from "cesium";
import * as gars from "gars-utils";
import { DDtoUTM, UTMType, UTMtoDD } from "./UTMConverter";

export type CoordinateType = 'DD' | 'DM' | 'DMS' | 'MGRS' | 'UTM' | 'GARS';

export const isNumber = (value: string):boolean => {
  if ((value === undefined || value === null|| value === '') || isNaN(Number(value))) {
    return false;
  } else {
    return true;
  }
}

const bandValueFromChar = (latitudeBand:number) => {
  let value = latitudeBand - 'A'.charCodeAt(0) + 1;
  if (latitudeBand > 'I'.charCodeAt(0)) {
      value--;
      if (latitudeBand > 'O'.charCodeAt(0)) {
          value--;
      }
  }
  return value;
}
const bandValue = (latitudeBand:string) => {
  if (latitudeBand.length === 1) {
      return bandValueFromChar(latitudeBand.charCodeAt(0));
  }
  const latitude = latitudeBand.toUpperCase();
  const latitude1 = bandValueFromChar(latitude.charCodeAt(0));
  const latitude2 = bandValueFromChar(latitude.charCodeAt(1));
  return 24 * (latitude1 - 1) + latitude2;
}
export class Coordinate {
  [immerable] = true;
  private _x: number;
  private _y: number;
  static garsPattern = new RegExp('^(\\d{3})([A-HJ-NP-Z]{2})(?:([1-4])([1-9])?)?$', 'i');

  constructor(x: number, y: number) {
    this._x = x;
    this._y = y;
  }

  get x(): number {
    return this._x;
  }

  set x(value: number) {
    this._x = value;
  }

  get y(): number {
    return this._y;
  }

  set y(value: number) {
    this._y = value;
  }

  public toString(): string {
    return `${this.x.toFixed(6)}°, ${this.y.toFixed(6)}°`;
  }

  public toGars(): string {
    const { x, y } = this;
    return gars.llToGars({
        lat: y,
        lng: x
    }, gars.GarsPrecision.FiveMinutes);
  }

  public toDM(): { x: number[]; y: number[] } {
    const { x, y } = this;
    const DM = {
      x: [Math.floor(x), (x - Math.floor(x)) * 60],
      y: [Math.floor(y), (y - Math.floor(y)) * 60],
    };
    return DM;
  }

  public toDMString(): string {
    const DM = this.toDM();
    return `${DM.x[0]}°${DM.x[1].toFixed(3)}'${DM.y[0]}°${DM.y[1].toFixed(3)}'`;
  }

  public toDMS(): { x: number[]; y: number[] } {
    const { x, y } = this;
    const DMS = {
      x: [
        Math.floor(x),
        Math.floor((x - Math.floor(x)) * 60),
        (x - Math.floor(x) - Math.floor((x - Math.floor(x)) * 60) / 60) * 3600,
      ],
      y: [
        Math.floor(y),
        Math.floor((y - Math.floor(y)) * 60),
        (y - Math.floor(y) - Math.floor((y - Math.floor(y)) * 60) / 60) * 3600,
      ],
    };
    return DMS;
  }

  public toDMSString(): string {
    const DMS = this.toDMS();
    return `${DMS.x[0]}°${DMS.x[1]}'${DMS.x[2].toFixed(2)}"${DMS.y[0]}°${DMS.y[1]}'${DMS.y[2].toFixed(2)}"`;
  }

  public toMGRS(): string {
    const { x, y } = this;
    const MGRS = mgrs.forward([x, y]);

    return MGRS;
  }

  public toUTM(): UTMType {
    const { x, y } = this;
    const ll = {
      lat: y,
      lon: x,
    };
    
    const UTMObject = DDtoUTM(ll);
    return UTMObject;
  }

  public toUTMString(): string {
    const utmObject = this.toUTM();

    return `${utmObject.zoneNum}${utmObject.zoneLetter} ${utmObject.easting.toFixed(2)}E ${utmObject.northing.toFixed(2)}N`;
  }

  public toCartesian3(): Cartesian3 {
    const { x, y } = this;
    return Cartesian3.fromDegrees(x, y);
  }

  static fromDD(longitude: number, latitude: number): Coordinate {
    return new Coordinate(longitude, latitude);
  }

  static fromDM(longitude: number[], latitude: number[]): Coordinate {
    const [x, y] = DMtoDD(longitude, latitude);
    return new Coordinate(x, y);
  }

  static fromDMS(longitude: number[], latitude: number[]): Coordinate {
    const [x, y] = DMStoDD(longitude, latitude);
    return new Coordinate(x, y);
  }

  static fromMGRS(MGRS: string): Coordinate | undefined {
    try {
      if (!Coordinate.validMgrs(MGRS)) {
        throw new Error('Invalid MGRS');
      }
      const [x, y] = MGRStoDD(MGRS);
      return new Coordinate(x, y);
    } catch (error) {
      console.error(error);
    }
  }

  static fromUTM(UTM: UTMType): Coordinate | undefined {
    const x = UTMtoDD(UTM).lon;
    const y = UTMtoDD(UTM).lat;

    return new Coordinate(x, y);
  }

  static fromGars(garsString: string): Coordinate | undefined {
    const {lat, lng} = gars.garsToCenterLl(garsString)
    
    return new Coordinate(lng, lat);
  }

  static fromCartesian3(cartesian: Cartesian3): Coordinate {
    const { longitude, latitude } = Cartographic.fromCartesian(cartesian);
    return new Coordinate(CMath.toDegrees(longitude), CMath.toDegrees(latitude));
  }

  static validUtm(utm: string): boolean {
    const utmRegExp = /^((60)|([0-5]{1}[0-9]{0,1}))[SN]{1}[0-9]{6,7}mE[0-9]{5,7}mN$/;
    return utmRegExp.test(utm);
  }

  static validMgrs(mgrs: string): boolean {
    const mgrsRegExp = /^((60)|([1-5]{1}[0-9]{0,1}))[ZBXWVUTSRQPNMLKJHGFEDCY]{3}([0-9]{6}|[0-9]{8}|[0-9]{10})$/;
    return mgrsRegExp.test(mgrs);
  }

  static validGars(gars: string): boolean {
    gars = gars.replace('\\s', '');
    let matches = false;
    if (Coordinate.garsPattern.test(gars)) {
        const match = gars.match(Coordinate.garsPattern);
        if (match) {
            const longitude = Number.parseInt(match[1], 10);
            matches = longitude >= 1 && longitude <= 720;
            if (matches) {
                const latitude = match[2].toUpperCase();
                const latitudeValue = bandValue(latitude);
                matches =
                    latitudeValue >= 1 &&
                        latitudeValue <= 360;
            }
        }
    }
    return matches;
}
}
