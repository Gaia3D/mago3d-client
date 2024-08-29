import * as Cesium from 'cesium';

let screenSpaceEventHandler : Cesium.ScreenSpaceEventHandler | undefined = undefined;

const color : Cesium.Color = Cesium.Color.fromCssColorString("#0675e6");
const manHeight = 1.5;
let tempColor : any = undefined;
let tempMaterial : any = undefined;

let pickedObject: any | undefined = undefined;

const calculateCartesian = (cartographic: Cesium.Cartographic, centerHeightOffset: number, heightOffset: number): Cesium.Cartesian3 => {
  return Cesium.Cartesian3.fromRadians(
      cartographic.longitude,
      cartographic.latitude,
      centerHeightOffset + heightOffset
  );
};

export const onViewCenter = (viewer: Cesium.Viewer) => {
  const scene = viewer.scene;

  if (!screenSpaceEventHandler) {
    screenSpaceEventHandler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
  }

  const mouseLeftClickHandler = (event: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
    const tempObject = pickedObject;
    pickedObject = scene.pick(event.position);

    if (pickedObject?.primitive instanceof Cesium.Primitive) {
      const pickedObjects = scene.drillPick(event.position);
      if (tempObject?.id === pickedObject?.id) {
        if (pickedObjects.length > 1 && pickedObject?.id === pickedObjects[0]?.id) {
          pickedObject = pickedObjects[1];
        } else {
          pickedObject = tempObject;
          return;
        }
      }
    }

    let startCartesian: Cesium.Cartesian3 | undefined;
    let startCartographic: Cesium.Cartographic | undefined;
    let centerHeight: number | undefined;

    if (pickedObject instanceof Cesium.Cesium3DTileFeature) {
      /* @ts-expect-error : null */
      startCartesian = pickedObject.content.tile.boundingSphere.center;
      if (!startCartesian) { return; }
      startCartographic = Cesium.Cartographic.fromCartesian(startCartesian);
      centerHeight = startCartographic.height;
    } else if (pickedObject?.primitive instanceof Cesium.Primitive && pickedObject.id?.polygon) {
      startCartesian = pickedObject.primitive._boundingSphereWC[0].center;
      if (!startCartesian) { return; }
      startCartographic = Cesium.Cartographic.fromCartesian(startCartesian);
      centerHeight = pickedObject.id.polygon.height.getValue();
    } else {
      return;
    }

    if(!centerHeight){ return; }
    if(!startCartesian){ return; }

    const startDestination = calculateCartesian(startCartographic, centerHeight, manHeight);

    const cameraCartographic = Cesium.Cartographic.fromCartesian(viewer.camera.position);
    const cameraCartesian = calculateCartesian(cameraCartographic, centerHeight, 0);

    const cameraDirection = Cesium.Cartesian3.subtract(startDestination, cameraCartesian, new Cesium.Cartesian3());
    const cameraDirInverse = Cesium.Cartesian3.negate(cameraDirection, new Cesium.Cartesian3());
    const cameraNormal = Cesium.Cartesian3.normalize(cameraDirInverse, new Cesium.Cartesian3());

    const startUpCartesian = calculateCartesian(startCartographic, centerHeight, 10.0);
    const startUpNormal = Cesium.Cartesian3.subtract(startUpCartesian, startDestination, new Cesium.Cartesian3());

    viewer.camera.flyTo({
      destination: startDestination,
      orientation: {
        direction: cameraNormal,
        up: startUpNormal,
      },
      duration: 2.0
    });

    function updateModelMatrix(object: any, modelMatrix: any) {
      const owner = object.id.entityCollection.owner;
      const primitives = owner._primitives._primitives;
      for (let i = 1; i < primitives.length; i++) {
        const primitive = primitives[i];
        if (primitive instanceof Cesium.Primitive) {
          primitive.modelMatrix = modelMatrix;
        }
      }
      object.id.entityCollection.show = true;
    }

    if (tempObject?.primitive instanceof Cesium.Primitive && tempObject.id?.polygon) {

      tempObject.id.polygon.material = tempMaterial;
      tempObject.id.polygon.outlineColor = tempColor;

      const modelMatrix = tempObject.primitive.modelMatrix;
      tempObject.id.entityCollection.show = false;
      setTimeout(() => {
        if (tempObject) {
          updateModelMatrix(tempObject, modelMatrix);
        }
      }, 100);
    }

    if (pickedObject?.primitive instanceof Cesium.Primitive && pickedObject.id?.polygon) {

      tempColor = pickedObject.id.polygon.outlineColor;
      tempMaterial = pickedObject.id.polygon.material;

      pickedObject.id.polygon.material = new Cesium.ColorMaterialProperty(color.withAlpha(0.1));
      pickedObject.id.polygon.outlineColor = color;

      const modelMatrix = pickedObject.primitive.modelMatrix;
      pickedObject.id.entityCollection.show = false;
      setTimeout(() => {
        if (pickedObject) {
          updateModelMatrix(pickedObject, modelMatrix);
        }
      }, 100);
    }
  };

  screenSpaceEventHandler.setInputAction(mouseLeftClickHandler, Cesium.ScreenSpaceEventType.LEFT_CLICK);
};

export const offViewCenter = (viewer: Cesium.Viewer) => {
  if (screenSpaceEventHandler) {
    screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
    screenSpaceEventHandler = undefined;
  }
};
