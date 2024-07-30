// import * as Cesium from 'cesium';
//
// const color = Cesium.Color.ORANGE;
// let tempColor: Cesium.Color | undefined;
// let screenSpaceEventHandler: Cesium.ScreenSpaceEventHandler | undefined = undefined;
// let status = false;
// let pickedObject: any;
//
// export const addBuildingFloor = (viewer: Cesium.Viewer) => {
//   const scene = viewer.scene;
//   if (!screenSpaceEventHandler) {
//     screenSpaceEventHandler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
//   }
//
//   offFloorEvents(viewer);
//
//   const mouseLeftClickHandler = (event: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
//     if (status) return;
//
//     if (tempColor) {
//       pickedObject = undefined;
//       tempColor = undefined;
//     }
//
//     pickedObject = scene.pick(event.position);
//
//     if (!(pickedObject?.primitive instanceof Cesium.Primitive)) return;
//     tempColor = pickedObject.id.polygon.material;
//
//     const entityCollection = pickedObject.id.entityCollection;
//     const entities = entityCollection.values;
//     const lastEntity = entities[entities.length - 1];
//     const lastPolygon = lastEntity.polygon;
//     const positions = lastPolygon.hierarchy.getValue().positions;
//
//     const floorHeight = lastPolygon.extrudedHeight.getValue() - lastPolygon.height.getValue();
//     const altitude = lastPolygon.extrudedHeight.getValue();
//     const extrudedHeight = altitude + floorHeight;
//
//     const newEntity = new Cesium.Entity({
//       polygon: {
//         hierarchy: new Cesium.PolygonHierarchy(positions),
//         material: color,
//         outline: false,
//         height: altitude,
//         extrudedHeight: extrudedHeight,
//         shadows: Cesium.ShadowMode.ENABLED,
//         outlineColor: color.withAlpha(0.5),
//       }
//     });
//
//     entityCollection.add(newEntity);
//
//     relocateBuilding(pickedObject);
//   };
//
//   screenSpaceEventHandler.setInputAction(mouseLeftClickHandler, Cesium.ScreenSpaceEventType.LEFT_CLICK);
// };
//
// export const removeBuildingFloor = (viewer: Cesium.Viewer) => {
//   const scene = viewer.scene;
//   if (!screenSpaceEventHandler) {
//     screenSpaceEventHandler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
//   }
//
//   offFloorEvents(viewer);
//
//   const mouseLeftClickHandler = (event: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
//     if (status) return;
//
//     pickedObject = scene.pick(event.position);
//
//     if (!pickedObject) return;
//
//     const entityCollection = pickedObject.id.entityCollection;
//     const entities = entityCollection.values;
//     const lastEntity = entities[entities.length - 1];
//
//     entityCollection.remove(lastEntity);
//
//     relocateBuilding(pickedObject);
//   };
//
//   screenSpaceEventHandler.setInputAction(mouseLeftClickHandler, Cesium.ScreenSpaceEventType.LEFT_CLICK);
// };
//
// const relocateBuilding = (pickedObject: any) => {
//   const modelMatrix = pickedObject.primitive.modelMatrix;
//   pickedObject.id.entityCollection.show = false;
//   status = true;
//
//   setTimeout(() => {
//     if (pickedObject) {
//       const owner = pickedObject.id.entityCollection.owner;
//       const primitives = owner._primitives._primitives;
//       for (let i = 1; i < primitives.length; i++) {
//         const primitive = primitives[i];
//         if (primitive instanceof Cesium.Primitive) {
//           primitive.modelMatrix = modelMatrix;
//         }
//       }
//       pickedObject.id.entityCollection.show = true;
//     }
//     status = false;
//   }, 100);
// };
//
// export const offFloorEvents = (viewer: Cesium.Viewer) => {
//   if (screenSpaceEventHandler) {
//     screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
//     screenSpaceEventHandler = undefined;
//   }
// };
