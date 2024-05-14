import * as Cesium from "cesium";
import Event from "./event";

let instance: GlobeController;
export enum GlobeControllerEventType {
  onReady,
}

/**
 * GlobeController
 * @description: GlobeController is a singleton class that manages the Cesium Viewer
 */
export class GlobeController {
  /**
   * @description: ready is a boolean that indicates if the viewer is ready to be used
   */
  public ready = false;

  /**
   * @description: viewerCreated is an event that is triggered when the viewer is created
   * @param {boolean} created - true if the viewer is created, false otherwise
   * @returns {void}
   **/
  public viewerCreated = new Event<boolean>();
  public handler: Cesium.ScreenSpaceEventHandler | undefined;
  public eventDataSource: Cesium.CustomDataSource = new Cesium.CustomDataSource("eventDataSource");
  public analysisDataSource: Cesium.CustomDataSource = new Cesium.CustomDataSource("analysisDataSource");
  public mapnoteDataSource: Cesium.CustomDataSource = new Cesium.CustomDataSource("mapnoteDataSource");
  public timeseriesDataSource: Cesium.CustomDataSource = new Cesium.CustomDataSource("timeseriesDataSource");
  public toolDataSource: Cesium.CustomDataSource = new Cesium.CustomDataSource("toolDataSource");
  public toolPrimitives: Cesium.PrimitiveCollection = new Cesium.PrimitiveCollection();
  private _tilesPrimitives: Cesium.PrimitiveCollection | undefined;
  public pointStackerLayer: Cesium.ImageryLayer | undefined = undefined;

  /**
   * @description: _viewer is the Cesium Viewer
   * @type {Cesium.Viewer | undefined}
   * @private
   * @memberof GlobeController
   * @see https://cesium.com/docs/cesiumjs-ref-doc/Viewer.html
   */
  private _viewer: Cesium.Viewer | undefined;

  /**
   * @description: constructor is private to prevent creating multiple instances of the class
   * @private
   * @memberof GlobeController
   * @see https://www.typescriptlang.org/docs/handbook/classes.html#private-constructors
   */
  constructor() {
    if (instance) {
      throw new Error("Error: Instantiation failed: Use GlobeController.getInstance() instead of new.");
    }
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    instance = this;
    this.viewerCreated.on(() => {
      this._tilesPrimitives = new Cesium.PrimitiveCollection();
      this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer?.scene.canvas);
      this.viewer?.scene.primitives.add(this._tilesPrimitives);
      this.viewer?.scene.primitives.add(this.toolPrimitives);

      this.viewer?.dataSources.add(this.eventDataSource);
      this.viewer?.dataSources.add(this.analysisDataSource);
      this.viewer?.dataSources.add(this.mapnoteDataSource);
      this.viewer?.dataSources.add(this.timeseriesDataSource);
      this.viewer?.dataSources.add(this.toolDataSource);
    });
  }

  /**
   * @description: viewer is a getter that returns the Cesium Viewer
   * @readonly
   * @type {Cesium.Viewer | undefined}
   * @memberof GlobeController
   */
  get viewer() {
    return this._viewer;
  }

  get tilesPrimitives() {
    return this._tilesPrimitives;
  }
  
  public setPointStackerLayer(layer: Cesium.ImageryLayer | undefined) {
    this.pointStackerLayer = layer;
  }

  /**
   * @description: createViewer creates the Cesium Viewer
   * @param {string | Element} mapId - the id of the HTML element where the viewer will be created
   * @param {Cesium.Viewer.ConstructorOptions} options - the options for the viewer
   * @returns {Cesium.Viewer} - the Cesium Viewer
   * @memberof GlobeController
   */
  public createViewer(mapId: string | Element, options: Cesium.Viewer.ConstructorOptions): Cesium.Viewer {
    this._viewer = new Cesium.Viewer(mapId, options);
    this.ready = true;
    this.notifyViewerCreated(this.ready);
    return this._viewer;
  }

  public pickPosition(pos: Cesium.Cartesian2): Cesium.Cartesian3 | undefined {
    return (
      this._viewer?.scene.pickPosition(pos) ??
      this._viewer?.camera.pickEllipsoid(pos, this._viewer.scene.globe.ellipsoid)
    );
  }

  /**
   *
   * @param x
   * @param y
   * @param height
   */
  public flyToDegree(x: number, y: number, height = 1500) {
    const destination = Cesium.Cartesian3.fromDegrees(x, y, height);
    this.flyTo(destination);
  }

  /**
   *
   * @param cartesian3
   */
  public flyTo(cartesian3: Cesium.Cartesian3) {
    this._viewer?.camera.flyTo({
      destination: cartesian3,
    });
  }

  public addDataSource(name?: string): Cesium.DataSource {
    const dataSource = new Cesium.CustomDataSource(name);
    this.viewer?.dataSources.add(dataSource);
    return dataSource;
  }

  public getDataSource(name: string): Cesium.DataSource | undefined {
    const dataSources = this.viewer?.dataSources;
    if (!dataSources) return;
    const length = dataSources.length;
    let targetDataSource;
    for (let i = 0; i < length; i++) {
      const ds = dataSources.get(i);
      if (ds.name === name) {
        targetDataSource = ds;
        break;
      }
    }
    if (!targetDataSource) targetDataSource = this.addDataSource(name);
    return targetDataSource;
  }

  public addEntity(targetDataSource?: Cesium.DataSource): Cesium.Entity {
    const entity = new Cesium.Entity({});
    if (targetDataSource) {
      targetDataSource.entities.add(entity);
    } else {
      this.viewer?.entities.add(entity);
    }
    return entity;
  }

  /**
   * @description: notifyViewerCreated triggers the viewerCreated event
   * @param {boolean} created - true if the viewer is created, false otherwise
   * @returns {void}
   * @memberof GlobeController
   */
  private notifyViewerCreated(created: boolean): void {
    this.viewerCreated.trigger(created);
  }

  public addPolyLine(positions: number[]): Cesium.PolylineCollection {
    const polylineCollection = this._viewer?.scene.primitives.add(new Cesium.PolylineCollection());
    polylineCollection.add({
      positions: Cesium.Cartesian3.fromDegreesArray(positions),
      width: 1,
    });
    return polylineCollection;
  }

  public removePolyLine(polylines: Cesium.PolylineCollection) {
    this._viewer?.scene.primitives.remove(polylines);
  }
}

/**
 * @description: getInstance returns the singleton instance of the GlobeController class
 * @returns {GlobeController} - the singleton instance of the GlobeController class
 */
export const getInstance = () => {
  if (!instance) instance = new GlobeController();
  return instance;
};