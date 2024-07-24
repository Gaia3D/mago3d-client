import * as Cesium from 'cesium'

/**
 * QuantizedMeshManager
 * @class QuantizedMeshManager
 *
 */

let viewer = undefined;
let scene = undefined;
let globe = undefined;
let surface = undefined;
let tilesRendered = undefined;
let tilesMap = undefined;
let excavatedTilesMap = undefined;
let terrainProvider = undefined;
let excavationAltitude = undefined;

let excavatedQuantizedMeshMap = undefined;
let excavationSetsArray = undefined;
let quantizedMeshExcavationSet = undefined;
let workerQuantizedMeshExcavation = undefined;
let _status = false;

export const QuantizedMeshManager = function(instanceViewer: Cesium.Viewer) {
  viewer = instanceViewer;
  excavatedQuantizedMeshMap = {};
  excavationSetsArray = [];
  quantizedMeshExcavationSet = undefined;
  workerQuantizedMeshExcavation = undefined;
  _status = true
  excavatedTilesMap = {}
  tilesMap = {}
}

Object.defineProperties(QuantizedMeshManager.prototype, {
  status: {
    get: function() {
      return this._status
    }, set: function(status) {
      this._status = status
    }
  }
})

function isNumber(n) {
  return !isNaN(parseFloat(n)) && !isNaN(n - 0)
}

QuantizedMeshManager.prototype.newExcavationSet = function(excavationGeoCoords, excavationAltitude) {
  // Check the type of the geoCoords.***
  // take one geoCoord.***
  const geoCoord = excavationGeoCoords[0]
  if (isNumber(geoCoord)) {
    // convert number array to geographicCoords array.***
    const geoCoordsAux = excavationGeoCoords
    excavationGeoCoords = []
    const coordsCount = geoCoordsAux.length / 2
    for (let i = 0; i < coordsCount; i++) {
      const lon = geoCoordsAux[i * 2]
      const lat = geoCoordsAux[i * 2 + 1]
      const geoCoord = new GeographicCoord(lon, lat, 0.0)
      excavationGeoCoords.push(geoCoord)
    }
  } else if (Array.isArray(geoCoord)) {
    const geoCoordsAux = excavationGeoCoords
    excavationGeoCoords = []
    const coordsCount = geoCoordsAux.length
    for (let i = 0; i < coordsCount; i++) {
      const lon = geoCoordsAux[i][0]
      const lat = geoCoordsAux[i][1]
      const geoCoord = new GeographicCoord(lon, lat, 0.0)
      excavationGeoCoords.push(geoCoord)
    }
  }

  const excavationSet = new QuantizedMeshExcavationSet(this, excavationGeoCoords, excavationAltitude)
  this.excavationSetsArray.push(excavationSet)
  return excavationSet
}

QuantizedMeshManager.prototype.setQuantizedMeshExcavationSet = function(geoCoordsArray, excavationAltitude) {
  this.quantizedMeshExcavationSet = new QuantizedMeshExcavationSet(this, geoCoordsArray, excavationAltitude)
}

QuantizedMeshManager.prototype.excavate = function() {
  const terrainProvider = this.magoManager.scene.terrainProvider

  if (!(terrainProvider instanceof Cesium.EditableCesiumTerrainProvider)) {
    return false
  }
  //this.excavating = false;

  //let tilesMap = terrainProvider.target.tilesMap;
  //terrainProvider.target = undefined;
  this.testAndReproductionTerrain()
}

QuantizedMeshManager.prototype.applyQuantizedMeshExcavation = function() {
  const scene = this.magoManager.scene
  const terrainProvider = scene.terrainProvider
  if (terrainProvider instanceof Cesium.EditableCesiumTerrainProvider) {
    const tilesMap = this.tilesMap = this.quantizedMeshExcavationSet.getIntersectedTiles()
    const excavationAltitude = this.quantizedMeshExcavationSet.excavationAltitude

    const excavationGeoCoords = this.quantizedMeshExcavationSet.geoCoordsArray.reduce(function(accum, item) {
      accum.push(item.longitude)
      accum.push(item.latitude)
      return accum
    }, [])

    terrainProvider.target = {
      tilesMap, excavationAltitude, excavationGeoCoords
    }

    this.excavatedTilesMap = {}
  }
}

QuantizedMeshManager.prototype.stopQuantizedMeshExcavation = function() {
  const terrainProvider = this.magoManager.scene.terrainProvider
  if (!(terrainProvider instanceof Cesium.EditableCesiumTerrainProvider)) {
    return false
  }
  if (!terrainProvider.target) {
    return false
  }

  terrainProvider.target = undefined
  this.excavatedTilesMap = {}
}

function test_doExcavateTile(tile, childTile, tilesMap, excavatedTilesMap, scene) {
  // 1rst, check if tile is candidate.***
  //내 자신이 대상지역인지 체크, 아닐시 패스
  if (!targetCheck(tilesMap, tile)) {
    return false
  }

  if (targetCheck(excavatedTilesMap, tile)) {
    if (childTile) {
      if (!targetCheck(tilesMap, childTile)) {
        return false
      }

      if (targetCheck(excavatedTilesMap, childTile)) {
        return false
      }

      initializeGlobeSurfaceTile(childTile, scene)

      if (!excavatedTilesMap[childTile.level]) {
        excavatedTilesMap[childTile.level] = {}
      }

      if (!excavatedTilesMap[childTile.level][childTile.x]) {
        excavatedTilesMap[childTile.level][childTile.x] = []
      }

      if (excavatedTilesMap[childTile.level][childTile.x].indexOf(childTile.y) < 0) {
        excavatedTilesMap[childTile.level][childTile.x].push(childTile.y)
      }
      return true
    }

    return false
  }

  // Now, check parendet.***
  const parent = tile.parent
  const tieLevel = tile.level
  if (tieLevel === 13 || test_doExcavateTile(parent, tile, tilesMap, excavatedTilesMap, scene)) {
    // My parent is total ready, so excavete me if necesary.***
    // Excavate tile.***
    // ...

    initializeGlobeSurfaceTile(tile, scene)

    if (!excavatedTilesMap[tile.level]) {
      excavatedTilesMap[tile.level] = {}
    }

    if (!excavatedTilesMap[tile.level][tile.x]) {
      excavatedTilesMap[tile.level][tile.x] = []
    }

    if (excavatedTilesMap[tile.level][tile.x].indexOf(tile.y) < 0) {
      excavatedTilesMap[tile.level][tile.x].push(tile.y)
    }
    return true
  }

  return false
}

QuantizedMeshManager.prototype.testAndReproductionTerrain = function() {
  const scene = this.magoManager.scene
  const globe = scene.globe
  const surface = globe._surface
  const index = 0
  const tilesRendered = surface._tilesToRender
  const tilesMap = this.tilesMap
  for (let i = 0, len = tilesRendered.length; i < len; ++i) {

    if (index > 10) {
      break
    }
    const tile = tilesRendered[i]
    const test = test_doExcavateTile(tile, undefined, tilesMap, this.excavatedTilesMap, scene)
    if (test) {
      index++
    }
  }
}

function reproductionTerrain(tileForTest, refTilesMap, scene) {
  const test = targetCheck(refTilesMap, tileForTest)
  if (test) {
    initializeGlobeSurfaceTile(tileForTest, scene)
  }

  return test
}

function testAndReproductionTerrain(tileForTest, refTilesMap, scene) {
  const test = targetCheck(refTilesMap, tileForTest)
  if (test) {
    initializeGlobeSurfaceTile(tileForTest, scene)
  }

  return test
}

function initializeGlobeSurfaceTile(globeSurfaceTile, scene) {
  globeSurfaceTile.data = undefined
  globeSurfaceTile.state = Cesium.QuadtreeTileLoadState.START

  const globe = scene.globe
  const tileProvider = globe._surface.tileProvider
  Cesium.GlobeSurfaceTile.initialize(globeSurfaceTile, scene.terrainProvider, tileProvider._imageryLayers)
}

function targetCheck(ref, tile) {
  const x = tile.x
  const y = tile.y
  const level = tile.level
  return ref[level] && ref[level][x] && ref[level][x].indexOf(y) > -1
}


QuantizedMeshManager.prototype.doExcavationPromise = function(qMesh, excavationGeoCoords, excavationAltitude) {
  // Use this function instead "doExcavation()".***
  // Actually the "doExcavation()" function is used to test excavation algrithm.***
  const X = qMesh.tileIndices.X
  const Y = qMesh.tileIndices.Y
  const L = qMesh.tileIndices.L

  // Now, min & max geographic coords.***
  const imageryType = CODE.imageryType.CRS84
  const geoExtent = SmartTile.getGeographicExtentOfTileLXY(L, X, Y, undefined, imageryType)

  const minLon = geoExtent.minGeographicCoord.longitude
  const minLat = geoExtent.minGeographicCoord.latitude
  const maxLon = geoExtent.maxGeographicCoord.longitude
  const maxLat = geoExtent.maxGeographicCoord.latitude

  const data = {
    info: { X: X, Y: Y, L: L },
    uValues: qMesh._uValues,
    vValues: qMesh._vValues,
    hValues: qMesh._heightValues,
    indices: qMesh._indices,
    minHeight: qMesh._minimumHeight,
    maxHeight: qMesh._maximumHeight,
    southIndices: qMesh._southIndices,
    eastIndices: qMesh._eastIndices,
    northIndices: qMesh._northIndices,
    westIndices: qMesh._westIndices,
    southSkirtHeight: qMesh._southSkirtHeight,
    eastSkirtHeight: qMesh._eastSkirtHeight,
    northSkirtHeight: qMesh._northSkirtHeight,
    westSkirtHeight: qMesh._westSkirtHeight,
    boundingSphere: {
      center: qMesh._boundingSphere.center, radius: qMesh._boundingSphere.radius
    },
    horizonOcclusionPoint: qMesh._horizonOcclusionPoint,
    geoExtent: {
      minLongitude: minLon, minLatitude: minLat, maxLongitude: maxLon, maxLatitude: maxLat
    },
    excavationGeoCoords: excavationGeoCoords,
    excavationAltitude: excavationAltitude
  }

  if (!this.workerQuantizedMeshExcavation) {
    this.workerQuantizedMeshExcavation = new PromiseWorker(createWorker(this.magoManager.config.scriptRootPath + 'Worker/workerQuantizedMeshExcavationPromise.js'))
  }
  const magoManager = this.magoManager
  //this.workerQuantizedMeshExcavation.postMessage(data, [data.uValues]); // send to worker by reference (transfer).
  return this.workerQuantizedMeshExcavation.postMessage(data).then(function(e) {
    const result = e.result
    const info = e.info
    const provider = magoManager.scene.terrainProvider
    const rectangle = provider._tilingScheme.tileXYToRectangle(info.X, info.Y, info.L)
    const orientedBoundingBox = Cesium.OrientedBoundingBox.fromRectangle(rectangle, result.minHeight, result.maxHeight, provider._tilingScheme.ellipsoid)
    for (let i = 0; i < 9; i++) {
      orientedBoundingBox.halfAxes[i] = orientedBoundingBox.halfAxes[i] * 3
    }
    return new Cesium.QuantizedMeshTerrainData({
      minimumHeight: result.minHeight,
      maximumHeight: result.maxHeight,
      quantizedVertices: result.uvhValues,
      indices: result.indices,
      boundingSphere: result.boundingSphere,
      orientedBoundingBox: orientedBoundingBox,
      horizonOcclusionPoint: result.horizonOcclusionPoint,
      westIndices: result.westIndices,
      southIndices: result.southIndices,
      eastIndices: result.eastIndices,
      northIndices: result.northIndices,
      westSkirtHeight: result.westSkirtHeight,
      southSkirtHeight: result.southSkirtHeight,
      eastSkirtHeight: result.eastSkirtHeight,
      northSkirtHeight: result.northSkirtHeight
    })
  })
}

QuantizedMeshManager.prototype.doExcavation = function(qMesh, excavationGeoCoords, excavationAltitude) {
  // test worker calling another worker.***
  const magoManager = this.magoManager
  if (!this.workerQuantizedMeshExcavation) {
    const qMeshManager = this
    this.workerQuantizedMeshExcavation = createWorker(magoManager.config.scriptRootPath + 'Worker/workerQuantizedMeshExcavation.js')
    this.workerQuantizedMeshExcavation.onmessage = function(e) {
      const tileInfo = e.data.info
      const result = e.data.result
      const excavatedQuantizedMeshMap = qMeshManager.excavatedQuantizedMeshMap
      const Z = tileInfo.L
      const X = tileInfo.X
      const Y = tileInfo.Y
      if (!excavatedQuantizedMeshMap[Z]) {
        excavatedQuantizedMeshMap[Z] = {}
      }
      if (!excavatedQuantizedMeshMap[Z][X]) {
        excavatedQuantizedMeshMap[Z][X] = {}
      }
      excavatedQuantizedMeshMap[Z][X][Y] = result
    }
  }

  const X = qMesh.tileIndices.X
  const Y = qMesh.tileIndices.Y
  const L = qMesh.tileIndices.L

  // Now, min & max geographic coords.***
  const imageryType = CODE.imageryType.CRS84
  const tileIndices = qMesh.tileIndices
  const geoExtent = SmartTile.getGeographicExtentOfTileLXY(L, X, Y, undefined, imageryType)

  const data = {
    info: { X: X, Y: Y, L: L },
    uValues: qMesh._uValues,
    vValues: qMesh._vValues,
    hValues: qMesh._heightValues,
    indices: qMesh._indices,
    minHeight: qMesh._minimumHeight,
    maxHeight: qMesh._maximumHeight,
    southIndices: qMesh._southIndices,
    eastIndices: qMesh._eastIndices,
    northIndices: qMesh._northIndices,
    westIndices: qMesh._westIndices,
    southSkirtHeight: qMesh._southSkirtHeight,
    eastSkirtHeight: qMesh._eastSkirtHeight,
    northSkirtHeight: qMesh._northSkirtHeight,
    westSkirtHeight: qMesh._westSkirtHeight,
    boundingSphere: {
      center: qMesh._boundingSphere.center, radius: qMesh._boundingSphere.radius
    },
    horizonOcclusionPoint: qMesh._horizonOcclusionPoint,
    geoExtent: {
      minLongitude: geoExtent.minGeographicCoord.longitude,
      minLatitude: geoExtent.minGeographicCoord.latitude,
      maxLongitude: geoExtent.maxGeographicCoord.longitude,
      maxLatitude: geoExtent.maxGeographicCoord.latitude
    },
    excavationGeoCoords: excavationGeoCoords,
    excavationAltitude: excavationAltitude
  }

  this.workerQuantizedMeshExcavation.postMessage(data)
  const hola = 0
}

QuantizedMeshManager.prototype.getExcavatedQuantizedMesh = function(X, Y, Z) {
  const excavatedQuantizedMeshMap = this.excavatedQuantizedMeshMap
  if (!excavatedQuantizedMeshMap[Z]) {
    return
  }
  if (!excavatedQuantizedMeshMap[Z][X]) {
    return
  }
  if (!excavatedQuantizedMeshMap[Z][X][Y]) {
    return
  }
  return excavatedQuantizedMeshMap[Z][X][Y]
}

QuantizedMeshManager.makeQuantizedMeshVirtually = function(lonSegments, latSegments, altitude, resultQMesh) {
  // This function makes a planar qMesh (used when the terrainProvider has no qMesh of a tile).***
  //-----------------------------------------------------------------------------------------------
  if (!resultQMesh) {
    resultQMesh = {}
  }

  // Set the altitude of the tile.
  resultQMesh._minimumHeight = altitude
  resultQMesh._maximumHeight = altitude

  const pointsCount = (lonSegments + 1.0) * (latSegments + 1.0)

  const shortMax = 32767
  const uValues = new Uint16Array(pointsCount)
  const vValues = new Uint16Array(pointsCount)
  const heightValues = new Uint16Array(pointsCount)
  const indices = new Uint16Array(pointsCount)

  const increCol = 1.0 / lonSegments
  const increRow = 1.0 / latSegments
  let idx = 0

  for (let r = 0; r < latSegments + 1; r++) {
    for (let c = 0; c < lonSegments + 1; c++) {
      uValues[idx] = Math.round(c * increCol * shortMax)
      vValues[idx] = Math.round(r * increRow * shortMax)
      heightValues[idx] = shortMax
      idx += 1
    }
  }

  const options : any = undefined
  const points_columnsCount = lonSegments + 1
  const points_rowsCount = latSegments + 1
  const resultObject = GeometryUtils.getIndicesTrianglesRegularNet(points_columnsCount, points_rowsCount, undefined, undefined, undefined, undefined, undefined, options)

  resultQMesh._uValues = uValues
  resultQMesh._vValues = vValues
  resultQMesh._heightValues = heightValues
  resultQMesh._indices = resultObject.indicesArray

  return resultQMesh
}