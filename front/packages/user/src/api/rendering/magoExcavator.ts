import * as Cesium from 'cesium'
import { CesiumTerrainProvider } from 'cesium'

export const GaiaTerrainProvider = function GaiaTerrainProvider(options: any) {
  console.log('GaiaTerrainProvider', options)

  /* @ts-ignore */
  this._heightmapWidth = undefined
  /* @ts-ignore */
  this._heightmapStructure = undefined
  /* @ts-ignore */
  this._hasWaterMask = false
  /* @ts-ignore */
  this._hasVertexNormals = false
  /* @ts-ignore */
  this._hasMetadata = false
  /* @ts-ignore */
  this._scheme = undefined
  /* @ts-ignore */
  this._ellipsoid = options.ellipsoid
  /* @ts-ignore */
  this._requestVertexNormals = false
  /* @ts-ignore */
  this._requestWaterMask = false
  /* @ts-ignore */
  this._requestMetadata = false
  /* @ts-ignore */
  this._errorEvent = undefined
  /* @ts-ignore */
  this._credit = new Cesium.Credit('Cesium Terrain Provider')
  /* @ts-ignore */
  this._availability = undefined
  /* @ts-ignore */
  this._tilingScheme = undefined
  /* @ts-ignore */
  this._levelZeroMaximumGeometricError = undefined
  /* @ts-ignore */
  this._layers = undefined
  /* @ts-ignore */
  this._tileCredits = undefined

  Cesium.CesiumTerrainProvider.call(options)
}

GaiaTerrainProvider.prototype = Object.create(CesiumTerrainProvider.prototype)

GaiaTerrainProvider.fromUrl = async function(url: string, options: any) {
  const cesiumTerrainProvider = await CesiumTerrainProvider.fromUrl.call(this, url, options)
  console.log('fromUrl', url, options, cesiumTerrainProvider)

  /* @ts-ignore */
  const gaiaTerrainProvider = new GaiaTerrainProvider(options)

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

  return gaiaTerrainProvider
}

GaiaTerrainProvider.prototype.requestTileGeometry = function(x: any, y: any, level: any, throttleRequests: any) {
  const terrainDataPromise = Cesium.CesiumTerrainProvider.prototype.requestTileGeometry.call(this, x, y, level, throttleRequests)

  console.log('[RequestTileGeometry]---------------');
  let result;
  if (terrainDataPromise instanceof Promise) {
    result = terrainDataPromise.then((data: any) => {
      console.log('requestTileGeometry', x, y, level, throttleRequests)
      console.log('data', data)

      const westSkirtHeight = data._westSkirtHeight;
      const southSkirtHeight = data._southSkirtHeight;
      const eastSkirtHeight = data._eastSkirtHeight;
      const northSkirtHeight = data._northSkirtHeight;

      const maxHeight = 10;
      const minHeight = 0;
      const newVertices = createVertices();
      const indices = createIndices();
      const westIndices = createWestSkirtIndices();
      const southIndices = createSouthSkirtIndices();
      const eastIndices = createEastSkirtIndices();
      const northIndices = createNorthSkirtIndices();

      const terrainMeshData = new Cesium.QuantizedMeshTerrainData({
        minimumHeight         : minHeight,
        maximumHeight         : maxHeight,
        quantizedVertices     : newVertices,
        indices               : indices,
        boundingSphere        : data._boundingSphere,
        orientedBoundingBox   : data._orientedBoundingBox,
        horizonOcclusionPoint : data._horizonOcclusionPoint,
        westIndices           : westIndices,
        southIndices          : southIndices,
        eastIndices           : eastIndices,
        northIndices          : northIndices,
        westSkirtHeight       : westSkirtHeight,
        southSkirtHeight      : southSkirtHeight,
        eastSkirtHeight       : eastSkirtHeight,
        northSkirtHeight      : northSkirtHeight,
      });

      return new Promise((resolve, reject) => {
        resolve(terrainMeshData);
      });
    });
  } else {
    result = terrainDataPromise;
  }
  console.log('----------------------------');
  return result;
}

GaiaTerrainProvider.prototype.getLevelMaximumGeometricError = function(level: any) {
  //console.log('getLevelMaximumGeometricError', level);
  return Cesium.CesiumTerrainProvider.prototype.getLevelMaximumGeometricError.call(this, level)
}

GaiaTerrainProvider.prototype.getTileDataAvailable = function(x: any, y: any, level: any) {
  //console.log('getTileDataAvailable', x, y, level);
  return Cesium.CesiumTerrainProvider.prototype.getTileDataAvailable.call(this, x, y, level)
}


function createVertices() {
  const length = 32767;
  const vertices = new Uint16Array(12);
  // u v h
  // 3    2
  //
  // 0    1

  // 0 longitude
  vertices[0] = 0;
  vertices[1] = length;
  vertices[2] = length;
  vertices[3] = 0;

  // 1 longitude
  vertices[4] = 0;
  vertices[5] = 0;
  vertices[6] = length;
  vertices[7] = length;

  // height
  vertices[8] = 0;
  vertices[9] = 0;
  vertices[10] = 0;
  vertices[11] = 0;

  return vertices;
}

function createIndices() {
  const indices = new Uint16Array(6);
  // 0, 1, 2
  indices[0] = 0;
  indices[1] = 1;
  indices[2] = 2;

  // 0, 2, 3
  indices[3] = 0;
  indices[4] = 2;
  indices[5] = 3;
  return indices;
}


function createEastSkirtIndices() {
  const indices : number[] = [];
  indices[0] = 1;
  indices[1] = 2;
  return indices;
}


function createWestSkirtIndices() {
  const indices : number[] = [];
  indices[0] = 3;
  indices[1] = 0;
  return indices;
}

function createSouthSkirtIndices() {
  const indices : number[] = [];
  indices[0] = 0;
  indices[1] = 1;
  return indices;
}

function createNorthSkirtIndices() {
  const indices : number[] = [];
  indices[0] = 2;
  indices[1] = 3;
  return indices;
}



