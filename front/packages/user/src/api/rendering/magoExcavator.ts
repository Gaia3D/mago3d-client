import * as Cesium from 'cesium';
import { CesiumTerrainProvider } from 'cesium';

interface GaiaTerrainProviderOptions {
  ellipsoid?: Cesium.Ellipsoid;
}

class GaiaTerrainProvider extends CesiumTerrainProvider {
  private _heightmapWidth?: number;
  private _heightmapStructure?: any;
  private _hasWaterMask = false;
  private _hasVertexNormals = false;
  private _hasMetadata = false;
  private _scheme?: any;
  private _ellipsoid?: Cesium.Ellipsoid;
  private _requestVertexNormals = false;
  private _requestWaterMask = false;
  private _requestMetadata = false;
  private _errorEvent?: any;
  private _credit: Cesium.Credit;
  private _availability?: any;
  private _tilingScheme?: any;
  private _levelZeroMaximumGeometricError?: any;
  private _layers?: any;
  private _tileCredits?: any;

  constructor(options: GaiaTerrainProviderOptions) {
    super(options);
    console.log('GaiaTerrainProvider', options);
    this._ellipsoid = options.ellipsoid;
    this._credit = new Cesium.Credit('Cesium Terrain Provider');
  }

  static async fromUrl(url: string, options: any) {
    const cesiumTerrainProvider = await CesiumTerrainProvider.fromUrl.call(this, url, options);
    console.log('fromUrl', url, options, cesiumTerrainProvider);

    /* @ts-ignore */
    const gaiaTerrainProvider = new GaiaTerrainProvider(options);

    const credit = new Cesium.Credit('Cesium Terrain Provider')

    /* @ts-ignore */
    gaiaTerrainProvider._errorEvent = cesiumTerrainProvider._errorEvent
    /* @ts-ignore */
    gaiaTerrainProvider._heightmapWidth = cesiumTerrainProvider._heightmapWidth
    /* @ts-ignore */
    gaiaTerrainProvider._scheme = cesiumTerrainProvider._scheme
    /* @ts-ignore */
    gaiaTerrainProvider._tileCredits = cesiumTerrainProvider._tileCredits
    /* @ts-ignore */
    gaiaTerrainProvider._availability = cesiumTerrainProvider._availability
    /* @ts-ignore */
    gaiaTerrainProvider._tilingScheme = cesiumTerrainProvider._tilingScheme
    /* @ts-ignore */
    gaiaTerrainProvider._requestWaterMask = cesiumTerrainProvider._requestWaterMask
    /* @ts-ignore */
    gaiaTerrainProvider._levelZeroMaximumGeometricError = cesiumTerrainProvider._levelZeroMaximumGeometricError
    /* @ts-ignore */
    gaiaTerrainProvider._heightmapStructure = cesiumTerrainProvider._heightmapStructure
    /* @ts-ignore */
    gaiaTerrainProvider._layers = cesiumTerrainProvider._layers
    /* @ts-ignore */
    gaiaTerrainProvider._hasWaterMask = false
    /* @ts-ignore */
    gaiaTerrainProvider._hasVertexNormals = false
    /* @ts-ignore */
    gaiaTerrainProvider._hasMetadata = false

    return gaiaTerrainProvider;
  }

  requestTileGeometry(x: number, y: number, level: number, throttleRequests: any) {
    const terrainDataPromise = Cesium.CesiumTerrainProvider.prototype.requestTileGeometry.call(
        this,
        x,
        y,
        level,
        throttleRequests
    );

    console.log('[RequestTileGeometry]---------------');
    let result: Promise<any> | any;

    if (terrainDataPromise instanceof Promise) {
      result = terrainDataPromise.then((data: any) => {
        console.log('requestTileGeometry', x, y, level, throttleRequests);
        console.log('data', data);

        const terrainMeshData = new Cesium.QuantizedMeshTerrainData({
          minimumHeight: 0,
          maximumHeight: 10,
          quantizedVertices: createVertices(),
          indices: createIndices(),
          boundingSphere: data._boundingSphere,
          orientedBoundingBox: data._orientedBoundingBox,
          horizonOcclusionPoint: data._horizonOcclusionPoint,
          westIndices: createWestSkirtIndices(),
          southIndices: createSouthSkirtIndices(),
          eastIndices: createEastSkirtIndices(),
          northIndices: createNorthSkirtIndices(),
          westSkirtHeight: data._westSkirtHeight,
          southSkirtHeight: data._southSkirtHeight,
          eastSkirtHeight: data._eastSkirtHeight,
          northSkirtHeight: data._northSkirtHeight,
        });

        return Promise.resolve(terrainMeshData);
      });
    } else {
      result = terrainDataPromise;
    }

    console.log('----------------------------');
    return result;
  }

  getLevelMaximumGeometricError(level: number) {
    //console.log('getLevelMaximumGeometricError', level);
    return super.getLevelMaximumGeometricError(level);
  }

  getTileDataAvailable(x: number, y: number, level: number) {
    //console.log('getTileDataAvailable', x, y, level);
    return super.getTileDataAvailable(x, y, level);
  }
}

function createVertices(): Uint16Array {
  const length = 32767;
  // u v h
  // 3    2
  //
  // 0    1
  const vertices = new Uint16Array([
    0, length, length, 0,   // 0 longitude
    0, 0, length, length,   // 1 longitude
    0, 0, 0, 0              // height
  ]);
  return vertices;
}

function createIndices(): Uint16Array {
  return new Uint16Array([0, 1, 2, 0, 2, 3]);
}

function createEastSkirtIndices(): number[] {
  return [1, 2];
}

function createWestSkirtIndices(): number[] {
  return [3, 0];
}

function createSouthSkirtIndices(): number[] {
  return [0, 1];
}

function createNorthSkirtIndices(): number[] {
  return [2, 3];
}

export {GaiaTerrainProvider};
export type { GaiaTerrainProviderOptions };
